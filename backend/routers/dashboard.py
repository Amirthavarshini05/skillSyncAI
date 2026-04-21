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
    for r in roles:
        r.match_score = calculate_match_score(enriched_skills, r.required_skills)

    # Only return roles where the student has at least one matching skill
    matched_roles = [r for r in roles if r.match_score > 0]

    # Sort by match score descending (highest relevance first)
    matched_roles.sort(key=lambda x: x.match_score, reverse=True)
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
            r.match_score = calculate_match_score(enriched_skills, r.required_skills)
            if r.match_score == 0:          # Only roles the student has zero overlap with
                explore.append(r)

    return explore


@router.get("/opportunities", response_model=List[schemas.OpportunityResponse])
def get_opportunities(current_user: models.User = Depends(auth_utils.get_current_user), db: Session = Depends(get_db)):
    ops = db.query(models.Opportunity).all()
    profile = db.query(models.StudentProfile).filter(models.StudentProfile.user_id == current_user.id).first()
    raw_skills = profile.skills if profile else []
    enriched_skills = get_enriched_user_skills(raw_skills)

    # Compute strict match score for each opportunity
    for o in ops:
        o.match_score = calculate_match_score(enriched_skills, o.required_skills)

    # Only return opportunities where the student has at least one matching skill
    matched_ops = [o for o in ops if o.match_score > 0]

    # Sort by match score descending
    matched_ops.sort(key=lambda x: x.match_score, reverse=True)
    return matched_ops

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

import urllib.request
import xml.etree.ElementTree as ET

@router.get("/insights")
def get_market_insights(current_user: models.User = Depends(auth_utils.get_current_user), db: Session = Depends(get_db)):
    news = []
    try:
        url = "https://news.google.com/rss/search?q=technology+jobs&hl=en-IN&gl=IN&ceid=IN:en"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            xml_data = response.read()
            root = ET.fromstring(xml_data)
            for item in root.findall('./channel/item')[:5]:
                news.append({
                    "title": item.find('title').text,
                    "link": item.find('link').text,
                    "pubDate": item.find('pubDate').text,
                    "source": item.find('source').text if item.find('source') is not None else "Google News"
                })
    except Exception as e:
        print("RSS Scraping error:", e)
        news = [
            {"title": "Tech Hiring Surges in 2026: Companies Seek AI and Cloud Experts", "link": "#", "pubDate": "Today", "source": "Tech News"},
            {"title": "Remote Work Policies Stabilize Across Major Tech Hubs", "link": "#", "pubDate": "Yesterday", "source": "Job Market Daily"},
            {"title": "New Study Shows React and Next.js Dominating Frontend Roles", "link": "#", "pubDate": "2 days ago", "source": "Frontend Weekly"}
        ]

    return {
        "trendingRole": {"title": "AI / ML Engineer", "stat": "+24% YoY Demand"},
        "topHub": {"title": "Bangalore, India", "stat": "12,000+ open roles"},
        "topSkill": {"title": "React & Next.js", "stat": "Found in 45% of frontend JDs"},
        "forecast": [
            {"year": "2020", "React": 40, "Python": 50, "AWS": 30},
            {"year": "2021", "React": 55, "Python": 60, "AWS": 45},
            {"year": "2022", "React": 70, "Python": 65, "AWS": 60},
            {"year": "2023", "React": 80, "Python": 75, "AWS": 75},
            {"year": "2024", "React": 95, "Python": 85, "AWS": 88},
            {"year": "2025", "React": 85, "Python": 90, "AWS": 95}
        ],
        "news": news
    }
