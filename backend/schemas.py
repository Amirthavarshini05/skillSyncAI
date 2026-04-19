from pydantic import BaseModel, EmailStr
from typing import List, Dict, Any, Optional
from datetime import datetime
from models import UserRole, ApplicationStatus

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.student

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: UserRole
    needs_onboarding: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class StudentProfileBase(BaseModel):
    skills: List[Dict[str, str]] = []
    education: Dict[str, Any] = {}
    preferences: Dict[str, Any] = {}
    resume_path: Optional[str] = None
    resume_data: Optional[Dict[str, Any]] = None

class StudentProfileCreate(StudentProfileBase):
    pass

class StudentProfileResponse(StudentProfileBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class OpportunityResponse(BaseModel):
    id: str
    company: str
    title: str
    location: str
    type: str
    required_skills: List[str]
    match_score: Optional[int] = None

    class Config:
        from_attributes = True

class ApplicationCreate(BaseModel):
    job_id: str

class ApplicationResponse(BaseModel):
    id: int
    user_id: int
    job_id: str
    status: ApplicationStatus
    applied_date: datetime
    job: Optional[OpportunityResponse] = None

    class Config:
        from_attributes = True

class RoadmapResponse(BaseModel):
    id: int
    role_id: str
    stage: str
    estimated_completion: str
    tasks: List[Dict[str, str]]

    class Config:
        from_attributes = True

class RoleResponse(BaseModel):
    id: str
    title: str
    category: str
    demand_level: str
    avg_salary: str
    why_matches: Optional[str] = None
    match_score: Optional[int] = None
    required_skills: List[str]

    class Config:
        from_attributes = True
