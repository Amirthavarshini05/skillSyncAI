from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
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

COMMON_SKILLS = ["python", "java", "javascript", "react", "node.js", "c++", "c#", "sql", "machine learning", "data analysis", "docker", "kubernetes", "aws", "azure", "gcp", "html", "css", "typescript", "figma"]

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
    
    if profile_data.resume_path:
        profile.resume_path = profile_data.resume_path
    if profile_data.resume_data:
        profile.resume_data = profile_data.resume_data
    
    db.commit()
    db.refresh(profile)
    return profile
