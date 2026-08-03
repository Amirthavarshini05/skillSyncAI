from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import models, schemas, auth_utils
from database import get_db
from pydantic import BaseModel

router = APIRouter(
    prefix="/api/recruiter",
    tags=["Recruiter"]
)

class StudentMatchWithOverlap(BaseModel):
    user_id: int
    name: str
    email: str
    phone: Optional[str] = None
    skills: list
    education: dict
    match_score: int
    matched_skills: List[str] = []
    project_count: int = 0

class SubmittedProject(BaseModel):
    task_id: str
    task_title: str
    role_title: str
    link: str

@router.get("/match", response_model=List[schemas.StudentMatchResponse])
def get_matching_students(current_user: models.User = Depends(auth_utils.get_current_user), db: Session = Depends(get_db)):
    if current_user.role != models.UserRole.recruiter:
        raise HTTPException(status_code=403, detail="Not a recruiter")
        
    recruiter_profile = db.query(models.RecruiterProfile).filter(models.RecruiterProfile.user_id == current_user.id).first()
    if not recruiter_profile:
        raise HTTPException(status_code=404, detail="Recruiter profile not found")
        
    required_skills = [s.lower().strip() for s in recruiter_profile.required_skills if s.strip()]
    if not required_skills:
        return []
        
    # Get all student profiles
    student_profiles = db.query(models.StudentProfile).join(models.User).filter(models.User.role == models.UserRole.student).all()
    
    matches = []
    for profile in student_profiles:
        student_skills_raw = [s.get('name', '').lower().strip() for s in profile.skills if isinstance(s, dict)]
        
        # Calculate overlap — ANY shared skill qualifies
        overlap = set(required_skills).intersection(set(student_skills_raw))
        if len(required_skills) > 0:
            match_score = int((len(overlap) / len(required_skills)) * 100)
        else:
            match_score = 0
            
        if match_score > 0:  # Show student if at least 1 required skill matches
            # Preserve original casing for matched skills display
            matched_skills_display = [
                s.get('name', '') for s in profile.skills
                if isinstance(s, dict) and s.get('name', '').lower().strip() in overlap
            ]
            # Count submitted projects from roadmap_progress
            roadmap_progress = profile.roadmap_progress or {}
            project_count = sum(
                1 for v in roadmap_progress.values()
                if isinstance(v, dict) and v.get('completed') and v.get('link')
            )
            matches.append({
                "user_id": profile.user.id,
                "name": profile.user.name,
                "email": profile.user.email,
                "phone": profile.user.phone,
                "skills": profile.skills,
                "education": profile.education or {},
                "match_score": match_score,
                "matched_skills": matched_skills_display,
                "project_count": project_count
            })
            
    # Composite ranking: 60% skill match + 40% project count (normalised to max 100)
    max_projects = max((m['project_count'] for m in matches), default=1) or 1
    for m in matches:
        m['_rank'] = m['match_score'] * 0.6 + (m['project_count'] / max_projects * 100) * 0.4
    matches.sort(key=lambda x: x['_rank'], reverse=True)
    # Strip internal rank key
    for m in matches:
        m.pop('_rank', None)
    return matches


@router.get("/student/{user_id}/projects", response_model=List[SubmittedProject])
def get_student_projects(
    user_id: int,
    current_user: models.User = Depends(auth_utils.get_current_user),
    db: Session = Depends(get_db)
):
    """Return all submitted project links for a student, enriched with task title and role name."""
    if current_user.role != models.UserRole.recruiter:
        raise HTTPException(status_code=403, detail="Not a recruiter")

    profile = db.query(models.StudentProfile).filter(models.StudentProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")

    roadmap_progress = profile.roadmap_progress or {}

    # Build a task_id → (task_title, role_title) lookup from the Roadmap + Role tables
    all_roadmaps = db.query(models.Roadmap).all()
    task_lookup = {}  # task_id → {task_title, role_title}
    for rm in all_roadmaps:
        role = db.query(models.Role).filter(models.Role.id == rm.role_id).first()
        role_title = role.title if role else rm.role_id
        tasks = rm.tasks or []
        for task in tasks:
            if isinstance(task, dict):
                tid = task.get('id', '')
                ttitle = task.get('title', tid)
                task_lookup[tid] = {'task_title': ttitle, 'role_title': role_title}

    submitted = []
    for task_id, val in roadmap_progress.items():
        if isinstance(val, dict) and val.get('completed') and val.get('link'):
            info = task_lookup.get(task_id, {'task_title': task_id, 'role_title': 'Unknown Role'})
            submitted.append(SubmittedProject(
                task_id=task_id,
                task_title=info['task_title'],
                role_title=info['role_title'],
                link=val['link']
            ))

    return submitted

@router.post("/shortlist", response_model=schemas.ShortlistResponse)
def add_to_shortlist(data: schemas.ShortlistCreate, current_user: models.User = Depends(auth_utils.get_current_user), db: Session = Depends(get_db)):
    if current_user.role != models.UserRole.recruiter:
        raise HTTPException(status_code=403, detail="Not a recruiter")
        
    existing = db.query(models.Shortlist).filter(
        models.Shortlist.recruiter_id == current_user.id,
        models.Shortlist.student_id == data.student_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Student already shortlisted")
        
    shortlist_item = models.Shortlist(
        recruiter_id=current_user.id,
        student_id=data.student_id,
        notes=data.notes
    )
    db.add(shortlist_item)
    db.commit()
    db.refresh(shortlist_item)
    
    return shortlist_item

@router.get("/shortlist", response_model=List[schemas.ShortlistResponse])
def get_shortlist(current_user: models.User = Depends(auth_utils.get_current_user), db: Session = Depends(get_db)):
    if current_user.role != models.UserRole.recruiter:
        raise HTTPException(status_code=403, detail="Not a recruiter")
        
    shortlist = db.query(models.Shortlist).filter(models.Shortlist.recruiter_id == current_user.id).order_by(models.Shortlist.added_date.desc()).all()
    return shortlist
