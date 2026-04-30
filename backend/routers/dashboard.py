from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import models, schemas, auth_utils
from database import get_db
router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"]
)

def get_enriched_user_skills(profile_skills):
    if not profile_skills:
        return []
    
    enriched = []
    for s in profile_skills:
        name = s.get("name", "")
        level = s.get("level", "Beginner")
        
        # We no longer simulate levels. We strictly use the user's actual profile data.
        # If the user's profile says Beginner, it will remain Beginner.
        enriched.append({
            "name": name,
            "level": level
        })
    return enriched

def calculate_match_score(user_skills, required_skills):
    """
    Strict formula: matched_skills / total_required_skills * 100
    Returns 0 when the user has no matching skills at all.
    """
    if not required_skills:
        return 0
    if not user_skills:
        return 0  # User has no skills — zero match, do not show this career

    # Build a flat set of lowercased user skill names for fast lookup
    user_skill_names = {
        s.get("name", "").lower()
        for s in user_skills
        if isinstance(s, dict)
    }

    matched = 0
    for req_skill in required_skills:
        req_lower = req_skill.lower()
        if req_lower in user_skill_names:
            matched += 1

    # Score = skills user already has / total skills required (0–100, no scaling)
    return round((matched / len(required_skills)) * 100)

@router.get("/roles", response_model=List[schemas.RoleResponse])
def get_roles(current_user: models.User = Depends(auth_utils.get_current_user), db: Session = Depends(get_db)):
    roles = db.query(models.Role).all()
    profile = db.query(models.StudentProfile).filter(models.StudentProfile.user_id == current_user.id).first()
    raw_skills = profile.skills if profile else []
    enriched_skills = get_enriched_user_skills(raw_skills)

    # Compute strict match score for each role
    matched_roles = []
    for r in roles:
        r_dict = r.__dict__.copy()
        r_dict.pop('_sa_instance_state', None)
        r_dict['match_score'] = calculate_match_score(enriched_skills, r.required_skills)
        if r_dict['match_score'] > 0:
            matched_roles.append(r_dict)

    # Sort by match score descending (highest relevance first)
    matched_roles.sort(key=lambda x: x['match_score'], reverse=True)
    return matched_roles

@router.get("/explore", response_model=List[schemas.RoleResponse])
def get_explore_roles(current_user: models.User = Depends(auth_utils.get_current_user), db: Session = Depends(get_db)):
    """
    Returns High / Very High demand roles where the student has 0% match.
    These are aspirational roles shown separately to inspire upskilling.
    """
    high_demand = {"High", "Very High"}
    roles = db.query(models.Role).all()
    profile = db.query(models.StudentProfile).filter(models.StudentProfile.user_id == current_user.id).first()
    raw_skills = profile.skills if profile else []
    enriched_skills = get_enriched_user_skills(raw_skills)

    explore = []
    for r in roles:
        if r.demand_level in high_demand:
            r_dict = r.__dict__.copy()
            r_dict.pop('_sa_instance_state', None)
            r_dict['match_score'] = calculate_match_score(enriched_skills, r.required_skills)
            if r_dict['match_score'] == 0:          # Only roles the student has zero overlap with
                explore.append(r_dict)

    return explore


@router.get("/opportunities", response_model=List[schemas.OpportunityResponse])
def get_opportunities(current_user: models.User = Depends(auth_utils.get_current_user), db: Session = Depends(get_db)):
    profile = db.query(models.StudentProfile).filter(models.StudentProfile.user_id == current_user.id).first()
    raw_skills = profile.skills if profile else []
    enriched_skills = get_enriched_user_skills(raw_skills)

    live_ops = []
    try:
        import urllib.request, json
        req = urllib.request.Request("https://remotive.com/api/remote-jobs?limit=50&category=software-dev", headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read())
            for job in data.get('jobs', []):
                job_tags = job.get('tags', [])
                if not job_tags:
                    job_tags = ["Software Engineering"]
                req_skills = [t.title() for t in job_tags[:8]]
                
                op_dict = {
                    "id": str(job['id']),
                    "company": job['company_name'],
                    "title": job['title'],
                    "location": job['candidate_required_location'] or "Remote",
                    "type": job['job_type'].replace('_', ' ').title() if job['job_type'] else "Full-Time",
                    "required_skills": req_skills,
                    "url": job['url']
                }
                match_score = calculate_match_score(enriched_skills, req_skills)
                op_dict["match_score"] = match_score
                if match_score > 0:
                    live_ops.append(op_dict)
    except Exception as e:
        print("Failed to fetch live jobs:", e)
        # Fallback to DB
        ops = db.query(models.Opportunity).all()
        for o in ops:
            o_dict = {
                "id": o.id,
                "company": o.company,
                "title": o.title,
                "location": o.location,
                "type": o.type,
                "required_skills": o.required_skills,
                "url": None,
                "match_score": calculate_match_score(enriched_skills, o.required_skills)
            }
            if o_dict["match_score"] > 0:
                live_ops.append(o_dict)

    live_ops.sort(key=lambda x: x["match_score"], reverse=True)
    return live_ops[:30]

@router.get("/roadmap")
def get_roadmap(current_user: models.User = Depends(auth_utils.get_current_user), db: Session = Depends(get_db)):
    roadmaps = db.query(models.Roadmap).all()
    result = {}
    for r in roadmaps:
        if r.role_id not in result:
            result[r.role_id] = []
        result[r.role_id].append({
            "stage": r.stage,
            "estimatedCompletion": r.estimated_completion,
            "tasks": r.tasks,
            "skills_learned": r.skills_learned
        })
    return result

@router.get("/skills")
def get_skills(current_user: models.User = Depends(auth_utils.get_current_user), db: Session = Depends(get_db)):
    profile = db.query(models.StudentProfile).filter(models.StudentProfile.user_id == current_user.id).first()
    if not profile or not profile.skills:
        return []
    
    enriched_base = get_enriched_user_skills(profile.skills)
    
    # Enrich skills with type
    final_enriched = []
    for s in enriched_base:
        name_lower = s["name"].lower()
        if name_lower in ["communication", "leadership", "teamwork", "problem solving"]:
            stype = "Soft"
        elif name_lower in ["ui design", "product management", "finance"]:
            stype = "Domain"
        else:
            stype = "Technical"
            
        final_enriched.append({
            "name": s["name"],
            "level": s["level"],
            "type": stype
        })
    return final_enriched

@router.post("/applications", response_model=schemas.ApplicationResponse)
def apply_for_job(application: schemas.ApplicationCreate, current_user: models.User = Depends(auth_utils.get_current_user), db: Session = Depends(get_db)):
    # Upsert Opportunity to satisfy FK constraint
    job = db.query(models.Opportunity).filter(models.Opportunity.id == application.job_id).first()
    if not job and application.title:
        job = models.Opportunity(
            id=application.job_id,
            company=application.company,
            title=application.title,
            location=application.location,
            type=application.type,
            required_skills=application.required_skills or []
        )
        db.add(job)
        db.commit()

    # Check if already applied
    existing = db.query(models.Application).filter(models.Application.user_id == current_user.id, models.Application.job_id == application.job_id).first()
    if existing:
        return existing
        
    app = models.Application(user_id=current_user.id, job_id=application.job_id)
    db.add(app)
    db.commit()
    db.refresh(app)
    return app

@router.get("/applications", response_model=List[schemas.ApplicationResponse])
def get_applications(current_user: models.User = Depends(auth_utils.get_current_user), db: Session = Depends(get_db)):
    return db.query(models.Application).filter(models.Application.user_id == current_user.id).all()

from pydantic import BaseModel
class StatusUpdate(BaseModel):
    status: models.ApplicationStatus

@router.put("/applications/{app_id}", response_model=schemas.ApplicationResponse)
def update_application_status(app_id: int, status_update: StatusUpdate, current_user: models.User = Depends(auth_utils.get_current_user), db: Session = Depends(get_db)):
    app = db.query(models.Application).filter(models.Application.id == app_id, models.Application.user_id == current_user.id).first()
    if app:
        app.status = status_update.status
        db.commit()
        db.refresh(app)
    return app

import urllib.request
import xml.etree.ElementTree as ET

import json
from collections import Counter

@router.get("/insights")
def get_market_insights(current_user: models.User = Depends(auth_utils.get_current_user), db: Session = Depends(get_db)):
    # 1. Real Database Computations
    roles = db.query(models.Role).all()
    ops = db.query(models.Opportunity).all()
    
    all_req_skills = []
    for r in roles:
        if r.required_skills:
            all_req_skills.extend(r.required_skills)
            
    skill_counts = Counter(all_req_skills)
    top_skill = skill_counts.most_common(1)[0][0] if skill_counts else "React"
    top_skill_count = skill_counts.most_common(1)[0][1] if skill_counts else 0
    
    locations = [o.location for o in ops if o.location]
    loc_counts = Counter(locations)
    top_hub = loc_counts.most_common(1)[0][0] if loc_counts else "Remote"
    
    trending_role_title = "Full Stack Engineer"
    if roles:
        high_demand_roles = [r for r in roles if r.demand_level in ["High", "Very High"]]
        if high_demand_roles:
            trending_role_title = high_demand_roles[0].title
            
    # 2. Fetch Real GitHub Trends
    github_trends = []
    try:
        req = urllib.request.Request("https://api.github.com/search/repositories?q=stars:>5000&sort=updated&order=desc", headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=3) as response:
            data = json.loads(response.read())
            for item in data.get('items', [])[:4]:
                github_trends.append({
                    "name": item['name'],
                    "description": item['description'],
                    "stars": item['stargazers_count'],
                    "language": item['language'] or "Mixed",
                    "url": item['html_url']
                })
    except Exception as e:
        print("GitHub API error:", e)
        github_trends = [
            {"name": "AutoGPT", "description": "An experimental open-source attempt to make GPT-4 fully autonomous.", "stars": 154000, "language": "Python", "url": "#"},
            {"name": "React", "description": "A declarative, efficient, and flexible JavaScript library for building user interfaces.", "stars": 218000, "language": "JavaScript", "url": "#"},
            {"name": "FastAPI", "description": "FastAPI framework, high performance, easy to learn, fast to code, ready for production", "stars": 67000, "language": "Python", "url": "#"},
            {"name": "Rust", "description": "Empowering everyone to build reliable and efficient software.", "stars": 90000, "language": "Rust", "url": "#"}
        ]
        
    # 3. Fetch News
    news = []
    try:
        url = "https://news.google.com/rss/search?q=technology+jobs&hl=en-IN&gl=IN&ceid=IN:en"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=3) as response:
            xml_data = response.read()
            root = ET.fromstring(xml_data)
            for item in root.findall('./channel/item')[:4]:
                news.append({
                    "title": item.find('title').text,
                    "link": item.find('link').text,
                    "pubDate": item.find('pubDate').text,
                    "source": item.find('source').text if item.find('source') is not None else "Google News"
                })
    except Exception as e:
        print("RSS Scraping error:", e)
        news = [
            {"title": "Tech Hiring Surges in 2026: Companies Seek AI and Cloud Experts", "link": "#", "pubDate": "Today", "source": "Tech News"}
        ]

    return {
        "trendingRole": {"title": trending_role_title, "stat": "Highest Employer Demand"},
        "topHub": {"title": top_hub, "stat": f"{loc_counts.get(top_hub, 0)} mapped open positions"},
        "topSkill": {"title": top_skill, "stat": f"Required in {top_skill_count} distinct roles"},
        "github": github_trends,
        "forecast": [
            {"year": "2020", "AI_ML": 20, "Cloud": 45, "Web": 80, "Cybersec": 30},
            {"year": "2021", "AI_ML": 35, "Cloud": 55, "Web": 85, "Cybersec": 40},
            {"year": "2022", "AI_ML": 55, "Cloud": 70, "Web": 82, "Cybersec": 55},
            {"year": "2023", "AI_ML": 85, "Cloud": 85, "Web": 78, "Cybersec": 70},
            {"year": "2024", "AI_ML": 110, "Cloud": 95, "Web": 75, "Cybersec": 85},
            {"year": "2025", "AI_ML": 140, "Cloud": 105, "Web": 72, "Cybersec": 95}
        ],
        "news": news
    }
