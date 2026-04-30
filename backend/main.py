from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth, users, dashboard, recruiter, college

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SkillSync AI Backend")

# CORS setup for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(dashboard.router)
app.include_router(recruiter.router)
app.include_router(college.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to SkillSync AI API"}
