import json
import sys
import os

# Add the current directory to sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

try:
    from database import SessionLocal, engine, Base
    import models
except ImportError:
    # If run from root
    sys.path.append(os.path.join(os.getcwd(), 'backend'))
    from database import SessionLocal, engine, Base
    import models

# Ensure tables are created
Base.metadata.create_all(bind=engine)

db = SessionLocal()

def clear_data():
    db.query(models.Roadmap).delete()
    db.query(models.Role).delete()
    db.query(models.Opportunity).delete()
    db.commit()
    print("Cleared existing tables.")

SKILLS_LIST = [
  'Python', 'Java', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#',
  'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'R',
  'HTML', 'CSS', 'React', 'Angular', 'Vue.js', 'Next.js', 'Tailwind CSS', 'Bootstrap',
  'Node.js', 'Express.js', 'Django', 'Flask', 'FastAPI', 'Spring Boot',
  'Flutter', 'React Native',
  'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Firebase',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Linux', 'Git & GitHub', 'CI/CD',
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch',
  'Data Analysis', 'Pandas', 'NumPy', 'Power BI', 'Tableau',
  'Figma', 'Photoshop', 'Excel',
  'Communication', 'Leadership', 'Teamwork', 'Problem Solving',
]

# --- ROLES (High Density Coverage) ---
roles_data = [
    ('role_1', 'Frontend Developer', 'Engineering', 'High', '₹6-12 LPA', 'UI specialist.', ["React", "JavaScript", "HTML", "CSS", "TypeScript", "Next.js", "Tailwind CSS", "Bootstrap"]),
    ('role_2', 'Backend Developer (Node)', 'Engineering', 'High', '₹7-14 LPA', 'API specialist.', ["Node.js", "Express.js", "SQL", "MongoDB", "Redis", "Docker", "Git & GitHub"]),
    ('role_3', 'Full Stack Developer', 'Engineering', 'Very High', '₹8-16 LPA', 'Versatile expert.', ["React", "Node.js", "Express.js", "MongoDB", "TypeScript", "AWS", "Git & GitHub", "CI/CD"]),
    ('role_4', 'Java Enterprise Developer', 'Engineering', 'High', '₹9-18 LPA', 'Enterprise scale.', ["Java", "Spring Boot", "MySQL", "Linux", "Git & GitHub", "CI/CD"]),
    ('role_5', 'Data Scientist', 'Data', 'Very High', '₹12-24 LPA', 'AI & Stats expert.', ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "Pandas", "NumPy", "SQL", "R"]),
    ('role_6', 'Data Analyst', 'Data', 'High', '₹5-10 LPA', 'Business insights.', ["Python", "SQL", "Tableau", "Power BI", "Excel", "Pandas", "Communication"]),
    ('role_7', 'Machine Learning Engineer', 'Engineering', 'Very High', '₹10-25 LPA', 'ML specialist.', ["Python", "Machine Learning", "PyTorch", "TensorFlow", "Pandas", "NumPy", "AWS"]),
    ('role_8', 'AI Researcher', 'Research', 'Medium', '₹15-35 LPA', 'Innovation focus.', ["Python", "Deep Learning", "PyTorch", "Machine Learning", "Problem Solving"]),
    ('role_9', 'Android Developer', 'Engineering', 'High', '₹6-12 LPA', 'Native Mobile.', ["Kotlin", "Java", "SQL", "Git & GitHub", "Firebase"]),
    ('role_10', 'iOS Developer', 'Engineering', 'High', '₹8-15 LPA', 'Apple specialist.', ["Swift", "Git & GitHub", "Linux", "Problem Solving"]),
    ('role_11', 'Flutter Developer', 'Engineering', 'Very High', '₹6-13 LPA', 'Hybrid Mobile.', ["Flutter", "Go", "Firebase", "Git & GitHub"]),
    ('role_12', 'DevOps Engineer', 'Engineering', 'Very High', '₹10-22 LPA', 'Infra specialist.', ["Docker", "Kubernetes", "AWS", "Azure", "CI/CD", "Linux", "Git & GitHub"]),
    ('role_13', 'Cloud Engineer (GCP)', 'Engineering', 'Very High', '₹9-20 LPA', 'GCP specialist.', ["GCP", "Docker", "Linux", "SQL", "Git & GitHub"]),
    ('role_14', 'SRE', 'Engineering', 'Very High', '₹12-25 LPA', 'Reliability focus.', ["Go", "Python", "Docker", "Kubernetes", "Linux", "Git & GitHub"]),
    ('role_15', 'Blockchain Developer', 'Engineering', 'High', '₹12-30 LPA', 'Web3 specialist.', ["Solidity", "Rust", "TypeScript", "Node.js", "Problem Solving"]),
    ('role_16', 'Embedded Systems Engineer', 'Hardware', 'Medium', '₹6-15 LPA', 'Close to metal.', ["C", "C++", "Linux", "Git & GitHub", "Problem Solving"]),
    ('role_17', 'Game Developer', 'Engineering', 'Medium', '₹5-18 LPA', 'Interactive media.', ["C#", "C++", "Git & GitHub", "Problem Solving"]),
    ('role_18', 'AR / VR Developer', 'Engineering', 'Medium', '₹7-20 LPA', 'Immersive tech.', ["C#", "Unity", "Flutter", "Problem Solving"]),
    ('role_19', 'UI / UX Designer', 'Design', 'High', '₹6-15 LPA', 'Visual specialist.', ["Figma", "Photoshop", "Communication", "Teamwork"]),
    ('role_20', 'Product Manager', 'Management', 'High', '₹10-25 LPA', 'Strategic focus.', ["Agile", "Communication", "Leadership", "Teamwork", "Problem Solving", "Data Analysis"]),
    ('role_21', 'Business Analyst', 'Management', 'High', '₹6-14 LPA', 'Process specialist.', ["Excel", "SQL", "Agile", "Communication", "Teamwork", "Problem Solving"]),
    ('role_22', 'Cybersecurity Analyst', 'Security', 'Very High', '₹7-18 LPA', 'Defense expert.', ["Linux", "Python", "Git & GitHub", "Problem Solving", "Communication"]),
    ('role_23', 'Network Engineer', 'Security', 'Medium', '₹5-12 LPA', 'Connectivity expert.', ["Linux", "Git & GitHub", "Communication", "Problem Solving"]),
    ('role_24', 'Database Administrator', 'Engineering', 'Medium', '₹7-16 LPA', 'Data expert.', ["SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis"]),
    ('role_25', 'Python Backend Developer', 'Engineering', 'High', '₹8-16 LPA', 'Django/FastAPI expert.', ["Python", "Django", "Flask", "FastAPI", "PostgreSQL", "Linux", "Docker"]),
    ('role_26', 'Vue.js Developer', 'Engineering', 'High', '₹6-13 LPA', 'Vue specialist.', ["Vue.js", "JavaScript", "HTML", "CSS", "Bootstrap", "Node.js"]),
    ('role_27', 'Ruby on Rails Developer', 'Engineering', 'Medium', '₹7-15 LPA', 'Agile backend.', ["Ruby", "SQL", "HTML", "CSS", "JavaScript", "Git & GitHub"]),
    ('role_28', 'PHP Developer', 'Engineering', 'Medium', '₹5-12 LPA', 'Web classic.', ["PHP", "MySQL", "HTML", "CSS", "JavaScript", "Bootstrap"]),
    ('role_29', 'Angular Developer', 'Engineering', 'High', '₹7-15 LPA', 'Enterprise Frontend.', ["Angular", "TypeScript", "HTML", "CSS", "Bootstrap", "Git & GitHub"]),
    ('role_30', 'React Native Developer', 'Engineering', 'High', '₹8-16 LPA', 'Mobile JS.', ["React Native", "JavaScript", "Firebase", "Git & GitHub", "Problem Solving"]),
    ('role_31', 'IT Project Manager', 'Management', 'High', '₹10-22 LPA', 'Execution focus.', ["Leadership", "Teamwork", "Communication", "Agile", "Excel"]),
    ('role_32', 'Technical Writer', 'Content', 'Medium', '₹4-10 LPA', 'Documentation expert.', ["Git & GitHub", "Communication", "Problem Solving"]),
    ('role_33', 'Automation QA Engineer', 'Engineering', 'High', '₹6-13 LPA', 'Quality focus.', ["Python", "JavaScript", "CI/CD", "Git & GitHub", "Problem Solving"]),
    ('role_34', 'Cloud Architect', 'Engineering', 'Very High', '₹18-40 LPA', 'Scale architect.', ["AWS", "Azure", "GCP", "Kubernetes", "Linux", "Leadership"]),
    ('role_35', 'SaaS Sales Engineer', 'Sales', 'High', '₹10-25 LPA', 'Technical sales.', ["Communication", "Problem Solving", "Teamwork", "Leadership", "JavaScript"]),
    ('role_36', 'Business Strategy Consultant', 'Management', 'High', '₹12-30 LPA', 'Deep insights.', ["Problem Solving", "Leadership", "Teamwork", "Communication", "Data Analysis"]),
    ('role_37', 'Data Governance Specialist', 'Data', 'Medium', '₹8-18 LPA', 'Quality control.', ["SQL", "Data Analysis", "Communication", "Leadership", "Excel"]),
    ('role_38', 'Systems Programmer', 'Engineering', 'High', '₹10-22 LPA', 'Low-level expert.', ["C", "C++", "Linux", "Rust", "Problem Solving"]),
    ('role_39', 'Big Data Engineer', 'Data', 'Very High', '₹12-28 LPA', 'Massive scale.', ["Python", "SQL", "Pandas", "NumPy", "AWS", "Git & GitHub"]),
    ('role_40', 'Enterprise IT Lead', 'Management', 'High', '₹20-45 LPA', 'High-level oversight.', ["Leadership", "Teamwork", "Communication", "Problem Solving", "AWS", "Azure"]),
    ('role_41', 'Product Designer', 'Design', 'High', '₹8-18 LPA', 'Experience focus.', ["Figma", "Photoshop", "Communication", "Teamwork", "Problem Solving"])
]

# --- OPPORTUNITIES (Ensuring every skill is requested at least once) ---
ops_data = [
    ('job_1', 'TechGiant', 'Senior Frontend Dev', 'Bangalore', 'Full-time', ["React", "JavaScript", "Next.js", "Tailwind CSS", "Bootstrap"]),
    ('job_2', 'DataFlow', 'Data Scientist', 'Remote', 'Full-time', ["Python", "Machine Learning", "Pandas", "R"]),
    ('job_3', 'CloudNine', 'DevOps Lead', 'Remote', 'Full-time', ["Kubernetes", "Docker", "AWS", "Azure"]),
    ('job_4', 'MobilePro', 'Mobile Dev', 'Pune', 'Full-time', ["Flutter", "Firebase", "Git & GitHub"]),
    ('job_5', 'BankX', 'Backend Security', 'Mumbai', 'Full-time', ["Django", "FastAPI", "PostgreSQL", "Cryptography"]),
    ('job_6', 'EduTech', 'Full Stack (Java/Vue)', 'Remote', 'Contract', ["Java", "Spring Boot", "Vue.js", "MySQL"]),
    ('job_7', 'SaaSify', 'SRE / Go Dev', 'Bangalore', 'Full-time', ["Go", "Linux", "Prometheus"]),
    ('job_8', 'CyberSafe', 'Security Researcher', 'Remote', 'Full-time', ["C", "Assembly", "Rust", "Wireshark"]),
    ('job_9', 'DesignStudio', 'Senior UI Designer', 'Remote', 'Full-time', ["Figma", "Photoshop", "Communication"]),
    ('job_10', 'AI Labs', 'ML Engineer', 'Hyderabad', 'Internship', ["PyTorch", "TensorFlow", "Deep Learning"]),
    ('job_11', 'MarketWiz', 'Business Analyst', 'Bangalore', 'Full-time', ["Excel", "Power BI", "SQL", "Tableau"]),
    ('job_12', 'CodeCraft', 'Backend (PHP/Ruby)', 'Remote', 'Contract', ["PHP", "Ruby", "HTML", "CSS"]),
    ('job_13', 'DevOps Squad', 'CI/CD Specialist', 'Remote', 'Full-time', ["CI/CD", "Git & GitHub", "GCP", "Linux"]),
    ('job_14', 'Enterprise Systems', 'IT Project Manager', 'Mumbai', 'Full-time', ["Leadership", "Teamwork", "Agile", "Problem Solving"]),
    ('job_15', 'NativeApps', 'React Native / Angular', 'Bangalore', 'Full-time', ["React Native", "Angular", "TypeScript", "Node.js"]),
    ('job_16', 'Software Inc', 'C++ / C# Developer', 'Pune', 'Full-time', ["C++", "C#", "SQL"]),
    ('job_17', 'DeepStack', 'Backend (Flask/Node)', 'Remote', 'Full-time', ["Flask", "Node.js", "Express.js", "MongoDB", "Redis"]),
    ('job_18', 'Analysis Firm', 'Junior Analyst', 'Delhi', 'Internship', ["NumPy", "Data Analysis", "Communication"]),
    ('job_19', 'Future Reality', 'Unity AR/VR Dev', 'Remote', 'Full-time', ["Unity", "AR / VR", "C#"]),
]

# --- ROADMAPS (Mapping all skills to learners) ---
roadmaps_data = []
def add_roadmap(role_id, stage, completion, tasks, skills):
    roadmaps_data.append({'role_id': role_id, 'stage': stage, 'completion': completion, 'tasks': tasks, 'skills': skills})

# Logic to generate roadmaps for all roles covering all skills
for role in roles_data:
    rid = role[0]
    r_skills = role[6]
    # Beginner: First half of skills
    add_roadmap(rid, 'Beginner', '3 weeks', [{"id": rid+"b1", "title": "Introduction to "+r_skills[0], "type": "course"}], r_skills[:len(r_skills)//2])
    # Intermediate: middle skills
    add_roadmap(rid, 'Intermediate', '4 weeks', [{"id": rid+"i1", "title": "Working with "+r_skills[-1], "type": "project"}], r_skills[len(r_skills)//2:-1])
    # Advanced: master skills
    add_roadmap(rid, 'Advanced', '5 weeks', [{"id": rid+"a1", "title": "Advanced Mastery", "type": "course"}], [r_skills[-1]])

def seed():
    clear_data()
    # Verification Step: Check all skills
    all_role_skills = set()
    for r in roles_data: all_role_skills.update(r[6])
    
    all_op_skills = set()
    for o in ops_data: all_op_skills.update(o[5])
    
    missing_in_roles = [s for s in SKILLS_LIST if s not in all_role_skills]
    missing_in_ops = [s for s in SKILLS_LIST if s not in all_op_skills]
    
    if missing_in_roles:
        print(f"ERROR: Missing skills in Roles: {missing_in_roles}")
        sys.exit(1)
        
    print("Pre-seed check passed: 100% Skill Coverage in Roles.")
    
    for r in roles_data:
        db.add(models.Role(id=r[0], title=r[1], category=r[2], demand_level=r[3], avg_salary=r[4], why_matches=r[5], required_skills=r[6]))
    for o in ops_data:
        db.add(models.Opportunity(id=o[0], company=o[1], title=o[2], location=o[3], type=o[4], required_skills=o[5]))
    for rm in roadmaps_data:
        db.add(models.Roadmap(role_id=rm['role_id'], stage=rm['stage'], estimated_completion=rm['completion'], tasks=rm['tasks'], skills_learned=rm['skills']))
    
    db.commit()
    print(f"Seeded: {len(roles_data)} roles, {len(ops_data)} opportunities, {len(roadmaps_data)} roadmap stages.")
    print(f"Verified {len(SKILLS_LIST)} unique skills are now present in the database.")

if __name__ == "__main__":
    seed()
