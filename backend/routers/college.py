from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from collections import Counter
import models, schemas, auth_utils
from database import get_db

router = APIRouter(
    prefix="/api/college",
    tags=["College"]
)

@router.get("/analytics", response_model=schemas.CollegeAnalyticsResponse)
def get_college_analytics(current_user: models.User = Depends(auth_utils.get_current_user), db: Session = Depends(get_db)):
    if current_user.role != models.UserRole.college:
        raise HTTPException(status_code=403, detail="Not a college")
        
    college_profile = db.query(models.CollegeProfile).filter(models.CollegeProfile.user_id == current_user.id).first()
    if not college_profile:
        raise HTTPException(status_code=404, detail="College profile not found")
        
    institution_name = college_profile.institution_name
    
    # Query all students from this college
    # The education column is JSON, we can do a basic filter in Python or use JSON operators
    # For SQLite compatibility and simplicity, we'll fetch students and filter in Python
    all_student_profiles = db.query(models.StudentProfile).join(models.User).filter(models.User.role == models.UserRole.student).all()
    
    college_students = []
    for profile in all_student_profiles:
        if profile.education and profile.education.get('collegeName') == institution_name:
            college_students.append(profile)
            
    total_students = len(college_students)
    
    # Calculate aggregations
    career_goals = []
    all_skills = []
    missing_skills_counter = Counter()
    
    for profile in college_students:
        if profile.preferences and profile.preferences.get('careerGoal'):
            career_goals.append(profile.preferences.get('careerGoal'))
            
        for skill in profile.skills:
            if isinstance(skill, dict) and skill.get('name'):
                all_skills.append(skill.get('name'))
                
        # To determine 'missing skills', we might check what is generally high in demand but missing
        # For a simplified insight, we can track what skills they don't have based on their career goal.
        # Here we just mock some standard industry skills to see if they are absent
        industry_standards = ['React', 'Python', 'Docker', 'AWS', 'Node.js', 'SQL', 'Git']
        student_skill_names = [s.get('name', '').lower() for s in profile.skills if isinstance(s, dict)]
        for std_skill in industry_standards:
            if std_skill.lower() not in student_skill_names:
                missing_skills_counter[std_skill] += 1
                
    goal_counts = Counter(career_goals).most_common(5)
    top_career_goals = [{"goal": g[0], "count": g[1]} for g in goal_counts]
    
    skill_counts = Counter(all_skills).most_common(5)
    top_skills = [{"skill": s[0], "count": s[1]} for s in skill_counts]
    
    missing_skills_list = [{"skill": k, "count": v} for k, v in missing_skills_counter.most_common(5)]

    return {
        "total_students": total_students,
        "top_career_goals": top_career_goals,
        "top_skills": top_skills,
        "missing_skills": missing_skills_list
    }

@router.get("/students", response_model=List[schemas.CollegeStudentResponse])
def get_college_students(current_user: models.User = Depends(auth_utils.get_current_user), db: Session = Depends(get_db)):
    if current_user.role != models.UserRole.college:
        raise HTTPException(status_code=403, detail="Not a college")
        
    college_profile = db.query(models.CollegeProfile).filter(models.CollegeProfile.user_id == current_user.id).first()
    if not college_profile:
        raise HTTPException(status_code=404, detail="College profile not found")
        
    institution_name = college_profile.institution_name
    
    all_student_profiles = db.query(models.StudentProfile).join(models.User).filter(models.User.role == models.UserRole.student).all()
    
    result = []
    for profile in all_student_profiles:
        if profile.education and profile.education.get('collegeName') == institution_name:
            result.append({
                "user_id": profile.user.id,
                "name": profile.user.name,
                "email": profile.user.email,
                "career_goal": profile.preferences.get('careerGoal') if profile.preferences else None,
                "department": profile.education.get('department') if profile.education else None,
                "skills": [s.get('name') for s in profile.skills if isinstance(s, dict) and s.get('name')]
            })
            
    return result
