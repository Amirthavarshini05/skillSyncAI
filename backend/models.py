from sqlalchemy import Column, Integer, String, Boolean, Enum, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
from database import Base
import enum
from datetime import datetime

class UserRole(str, enum.Enum):
    student = "student"
    college = "college"
    recruiter = "recruiter"

class ApplicationStatus(str, enum.Enum):
    applied = "Applied"
    interview = "Interview"
    rejected = "Rejected"
    accepted = "Accepted"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(Enum(UserRole), default=UserRole.student)
    needs_onboarding = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    otp_code = Column(String, nullable=True)
    phone = Column(String, nullable=True)

    profile = relationship("StudentProfile", back_populates="user", uselist=False)
    recruiter_profile = relationship("RecruiterProfile", back_populates="user", uselist=False)
    college_profile = relationship("CollegeProfile", back_populates="user", uselist=False)
    applications = relationship("Application", back_populates="user")
    shortlists = relationship("Shortlist", foreign_keys="[Shortlist.recruiter_id]", back_populates="recruiter")

class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    skills = Column(JSON, default=list)
    education = Column(JSON, default=dict)
    preferences = Column(JSON, default=dict)
    resume_path = Column(String, nullable=True)
    resume_data = Column(JSON, default=dict, nullable=True)
    roadmap_progress = Column(JSON, default=dict)

    user = relationship("User", back_populates="profile")

class RecruiterProfile(Base):
    __tablename__ = "recruiter_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    company_name = Column(String, index=True)
    industry = Column(String)
    target_roles = Column(String)
    required_skills = Column(JSON, default=list)
    logo_path = Column(String, nullable=True)

    user = relationship("User", back_populates="recruiter_profile")

class CollegeProfile(Base):
    __tablename__ = "college_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    institution_name = Column(String, index=True)
    institution_type = Column(String)
    student_count = Column(Integer)
    departments = Column(String)
    logo_path = Column(String, nullable=True)

    user = relationship("User", back_populates="college_profile")

class Shortlist(Base):
    __tablename__ = "shortlists"

    id = Column(Integer, primary_key=True, index=True)
    recruiter_id = Column(Integer, ForeignKey("users.id"))
    student_id = Column(Integer, ForeignKey("users.id"))
    notes = Column(String, nullable=True)
    added_date = Column(DateTime, default=datetime.utcnow)

    recruiter = relationship("User", foreign_keys=[recruiter_id], back_populates="shortlists")
    student = relationship("User", foreign_keys=[student_id])

class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(String, primary_key=True, index=True) # string IDs matching mockData e.g. "job_1"
    company = Column(String)
    title = Column(String)
    location = Column(String)
    type = Column(String)
    required_skills = Column(JSON, default=list)
    match_score = Column(Integer, nullable=True) # Optionally storing default match score

    applications = relationship("Application", back_populates="job")

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    job_id = Column(String, ForeignKey("opportunities.id"))
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.applied)
    applied_date = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="applications")
    job = relationship("Opportunity", back_populates="applications")

class Role(Base):
    __tablename__ = "roles"

    id = Column(String, primary_key=True, index=True) # e.g. "role_1"
    title = Column(String)
    category = Column(String)
    demand_level = Column(String)
    avg_salary = Column(String)
    why_matches = Column(String, nullable=True)
    match_score = Column(Integer, nullable=True)
    required_skills = Column(JSON, default=list)

    roadmaps = relationship("Roadmap", back_populates="role")

class Roadmap(Base):
    __tablename__ = "roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    role_id = Column(String, ForeignKey("roles.id"))
    stage = Column(String) # e.g. "Beginner"
    estimated_completion = Column(String)
    tasks = Column(JSON, default=list)
    skills_learned = Column(JSON, default=list)

    role = relationship("Role", back_populates="roadmaps")
