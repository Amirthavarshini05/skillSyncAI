from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import models, schemas, auth_utils
from database import get_db
import random
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
    if not required_skills:
        return 100
    if not user_skills:
        return random.randint(30, 50) # Fallback if user has no skills yet

    # Convert enriched user skills to a dictionary mapping name to level
    user_skills_map = {s.get("name", "").lower(): s.get("level", "Beginner") for s in user_skills if isinstance(s, dict)}
    
    match_count = 0
    for req_skill in required_skills:
        req_lower = req_skill.lower()
        
        # Find if user has a skill that matches
        matched_level = None
        if req_lower in user_skills_map:
            matched_level = user_skills_map[req_lower]
        else:
            # Partial match check
            for u_skill, lvl in user_skills_map.items():
                if req_lower in u_skill or u_skill in req_lower:
                    matched_level = lvl
                    break
        
        if matched_level:
            # Give full point for Advanced/Intermediate, half point for Beginner
            if matched_level in ["Advanced", "Intermediate"]:
                match_count += 1
            else:
                match_count += 0.5
            
    # Calculate base percentage (0 to 100)
    base_score = (match_count / len(required_skills)) * 100
    
    # Scale the score so the UI always shows something reasonable (e.g., 40 to 100)
    # This prevents the score from being 0% which can be discouraging
    scaled_score = 40 + int((base_score / 100) * 60)
    return scaled_score

@router.get("/roles", response_model=List[schemas.RoleResponse])
def get_roles(current_user: models.User = Depends(auth_utils.get_current_user), db: Session = Depends(get_db)):
    roles = db.query(models.Role).all()
    profile = db.query(models.StudentProfile).filter(models.StudentProfile.user_id == current_user.id).first()
    raw_skills = profile.skills if profile else []
    enriched_skills = get_enriched_user_skills(raw_skills)

    # Calculate actual match score based on user's profile vs role requirements
    for r in roles:
        r.match_score = calculate_match_score(enriched_skills, r.required_skills)
        
    # Sort by match score descending
    roles.sort(key=lambda x: x.match_score, reverse=True)
    return roles

@router.get("/opportunities", response_model=List[schemas.OpportunityResponse])
def get_opportunities(current_user: models.User = Depends(auth_utils.get_current_user), db: Session = Depends(get_db)):
    ops = db.query(models.Opportunity).all()
    profile = db.query(models.StudentProfile).filter(models.StudentProfile.user_id == current_user.id).first()
    raw_skills = profile.skills if profile else []
    enriched_skills = get_enriched_user_skills(raw_skills)

    # Calculate actual match score based on user's profile vs job requirements
    for o in ops:
        o.match_score = calculate_match_score(enriched_skills, o.required_skills)
        
    # Sort by match score descending
    ops.sort(key=lambda x: x.match_score, reverse=True)
    return ops

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
            "tasks": r.tasks
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

@router.get("/insights")
def get_market_insights(current_user: models.User = Depends(auth_utils.get_current_user), db: Session = Depends(get_db)):
    return {
        "trendingRole": {"title": "AI / ML Engineer", "stat": "+24% YoY Demand"},
        "topHub": {"title": "Bangalore, India", "stat": "12,000+ open roles"},
        "topSkill": {"title": "React & Next.js", "stat": "Found in 45% of frontend JDs"},
        "forecast": [40, 60, 55, 80, 95, 85]
    }
