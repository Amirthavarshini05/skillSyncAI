from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel
import os
import shutil
import PyPDF2
from docx import Document
import re
import models, schemas, auth_utils
from database import get_db

router = APIRouter(
    prefix="/api/users",
    tags=["Users"]
)

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None

@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(auth_utils.get_current_user)):
    return current_user

@router.put("/me", response_model=schemas.UserResponse)
def update_me(data: UserUpdate, current_user: models.User = Depends(auth_utils.get_current_user), db: Session = Depends(get_db)):
    if data.name is not None:
        current_user.name = data.name
    if data.phone is not None:
        current_user.phone = data.phone
    db.commit()
    db.refresh(current_user)
    return current_user

COMMON_SKILLS = [
    "python", "java", "javascript", "react", "node.js", "c++", "c#", "sql", "machine learning", "data analysis", 
    "docker", "kubernetes", "aws", "azure", "gcp", "html", "css", "typescript", "figma", "angular", "vue.js",
    "next.js", "tailwind css", "bootstrap", "express.js", "django", "flask", "fastapi", "spring boot", "php",
    "ruby", "go", "rust", "flutter", "react native", "swift", "kotlin", "mysql", "postgresql", "mongodb",
    "redis", "deep learning", "tensorflow", "pytorch", "pandas", "numpy", "power bi", "tableau", "photoshop",
    "excel", "linux", "git", "github", "ci/cd", "agile", "scrum", "communication", "leadership", "teamwork", "problem solving"
]

def extract_skills_from_text(text: str):
    text_lower = text.lower()
    found_skills = []
    for skill in COMMON_SKILLS:
        if re.search(r'\b' + re.escape(skill) + r'\b', text_lower):
            found_skills.append({"name": skill.title(), "level": "Beginner"})
    return found_skills

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/me/resume")
def upload_resume(file: UploadFile = File(...), current_user: models.User = Depends(auth_utils.get_current_user), db: Session = Depends(get_db)):
    if not file.filename.lower().endswith(('.pdf', '.doc', '.docx')):
        raise HTTPException(status_code=400, detail="Only PDF or DOCX files are allowed")

    file_path = os.path.join(UPLOAD_DIR, f"{current_user.id}_{file.filename}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = ""
    try:
        if file.filename.lower().endswith('.pdf'):
            with open(file_path, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                for page in reader.pages:
                    if page.extract_text():
                        text += page.extract_text() + "\n"
        elif file.filename.lower().endswith('.docx'):
            doc = Document(file_path)
            for para in doc.paragraphs:
                text += para.text + "\n"
    except Exception as e:
        print("Error parsing resume:", e)
    
    extracted_skills = extract_skills_from_text(text)
    
    return {"resume_path": file_path, "skills": extracted_skills}

@router.post("/me/onboarding", response_model=schemas.UserResponse)
def complete_onboarding(profile_data: schemas.StudentProfileCreate, current_user: models.User = Depends(auth_utils.get_current_user), db: Session = Depends(get_db)):
    if not current_user.needs_onboarding:
        raise HTTPException(status_code=400, detail="Onboarding already completed")
    
    profile = models.StudentProfile(
        user_id=current_user.id,
        skills=profile_data.skills,
        education=profile_data.education,
        preferences=profile_data.preferences,
        resume_path=profile_data.resume_path,
        resume_data=profile_data.resume_data
    )
    db.add(profile)
    
    current_user.needs_onboarding = False
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/me/profile", response_model=schemas.StudentProfileResponse)
def get_profile(current_user: models.User = Depends(auth_utils.get_current_user), db: Session = Depends(get_db)):
    profile = db.query(models.StudentProfile).filter(models.StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/me/profile", response_model=schemas.StudentProfileResponse)
def update_profile(profile_data: schemas.StudentProfileCreate, current_user: models.User = Depends(auth_utils.get_current_user), db: Session = Depends(get_db)):
    profile = db.query(models.StudentProfile).filter(models.StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = models.StudentProfile(user_id=current_user.id)
        db.add(profile)
        
    profile.skills = profile_data.skills
    profile.education = profile_data.education
    profile.preferences = profile_data.preferences
    profile.roadmap_progress = profile_data.roadmap_progress
    
    if profile_data.resume_path:
        profile.resume_path = profile_data.resume_path
    if profile_data.resume_data:
        profile.resume_data = profile_data.resume_data
    
    db.commit()
    db.refresh(profile)
    return profile

@router.post("/me/recruiter-onboarding", response_model=schemas.UserResponse)
def complete_recruiter_onboarding(profile_data: schemas.RecruiterProfileCreate, current_user: models.User = Depends(auth_utils.get_current_user), db: Session = Depends(get_db)):
    if not current_user.needs_onboarding:
        raise HTTPException(status_code=400, detail="Onboarding already completed")
    if current_user.role != models.UserRole.recruiter:
        raise HTTPException(status_code=403, detail="Not a recruiter")
    
    profile = models.RecruiterProfile(
        user_id=current_user.id,
        company_name=profile_data.company_name,
        industry=profile_data.industry,
        target_roles=profile_data.target_roles,
        required_skills=profile_data.required_skills,
        logo_path=profile_data.logo_path
    )
    db.add(profile)
    
    current_user.needs_onboarding = False
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/me/recruiter-profile", response_model=schemas.RecruiterProfileResponse)
def get_recruiter_profile(current_user: models.User = Depends(auth_utils.get_current_user), db: Session = Depends(get_db)):
    if current_user.role != models.UserRole.recruiter:
        raise HTTPException(status_code=403, detail="Not a recruiter")
    profile = db.query(models.RecruiterProfile).filter(models.RecruiterProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Recruiter profile not found")
    return profile

@router.put("/me/recruiter-profile", response_model=schemas.RecruiterProfileResponse)
def update_recruiter_profile(profile_data: schemas.RecruiterProfileCreate, current_user: models.User = Depends(auth_utils.get_current_user), db: Session = Depends(get_db)):
    if current_user.role != models.UserRole.recruiter:
        raise HTTPException(status_code=403, detail="Not a recruiter")
    profile = db.query(models.RecruiterProfile).filter(models.RecruiterProfile.user_id == current_user.id).first()
    if not profile:
        profile = models.RecruiterProfile(user_id=current_user.id)
        db.add(profile)
        
    profile.company_name = profile_data.company_name
    profile.industry = profile_data.industry
    profile.target_roles = profile_data.target_roles
    profile.required_skills = profile_data.required_skills
    if profile_data.logo_path:
        profile.logo_path = profile_data.logo_path
        
    db.commit()
    db.refresh(profile)
    return profile

@router.post("/me/college-onboarding", response_model=schemas.UserResponse)
def complete_college_onboarding(profile_data: schemas.CollegeProfileCreate, current_user: models.User = Depends(auth_utils.get_current_user), db: Session = Depends(get_db)):
    if not current_user.needs_onboarding:
        raise HTTPException(status_code=400, detail="Onboarding already completed")
    if current_user.role != models.UserRole.college:
        raise HTTPException(status_code=403, detail="Not a college")
    
    profile = models.CollegeProfile(
        user_id=current_user.id,
        institution_name=profile_data.institution_name,
        institution_type=profile_data.institution_type,
        student_count=profile_data.student_count,
        departments=profile_data.departments,
        logo_path=profile_data.logo_path
    )
    db.add(profile)
    
    current_user.needs_onboarding = False
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/me/college-profile", response_model=schemas.CollegeProfileResponse)
def get_college_profile(current_user: models.User = Depends(auth_utils.get_current_user), db: Session = Depends(get_db)):
    if current_user.role != models.UserRole.college:
        raise HTTPException(status_code=403, detail="Not a college")
    profile = db.query(models.CollegeProfile).filter(models.CollegeProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="College profile not found")
    return profile

@router.put("/me/college-profile", response_model=schemas.CollegeProfileResponse)
def update_college_profile(profile_data: schemas.CollegeProfileCreate, current_user: models.User = Depends(auth_utils.get_current_user), db: Session = Depends(get_db)):
    if current_user.role != models.UserRole.college:
        raise HTTPException(status_code=403, detail="Not a college")
    profile = db.query(models.CollegeProfile).filter(models.CollegeProfile.user_id == current_user.id).first()
    if not profile:
        profile = models.CollegeProfile(user_id=current_user.id)
        db.add(profile)
        
    profile.institution_name = profile_data.institution_name
    profile.institution_type = profile_data.institution_type
    profile.student_count = profile_data.student_count
    profile.departments = profile_data.departments
    if profile_data.logo_path:
        profile.logo_path = profile_data.logo_path
        
    db.commit()
    db.refresh(profile)
    return profile
