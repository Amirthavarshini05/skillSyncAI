import sqlite3
import json

conn = sqlite3.connect('skillsync.db')
c = conn.cursor()

# Clear existing data
c.execute("DELETE FROM roadmaps")
c.execute("DELETE FROM roles")
c.execute("DELETE FROM opportunities")

# 20+ Real-world Roles
roles = [
  ('role_1', 'Frontend Developer', 'Engineering', 'High', '₹6-12 LPA', 'Strong UI foundation aligns perfectly with frontend. Missing advanced state management.', json.dumps(["React", "JavaScript", "HTML/CSS", "Redux", "Tailwind", "TypeScript"])),
  ('role_2', 'Data Analyst', 'Data', 'Very High', '₹5-10 LPA', 'Great analytical thinking, needs SQL and Visualization tools.', json.dumps(["Python", "SQL", "Tableau", "PowerBI", "Stats", "Excel"])),
  ('role_3', 'Product Manager', 'Management', 'Medium', '₹8-15 LPA', 'Good communication, lacks structured product thinking.', json.dumps(["Agile", "Product Strategy", "User Research", "Data Analytics", "Jira"])),
  ('role_4', 'AI/ML Engineer', 'Engineering', 'Very High', '₹10-25 LPA', 'Strong math foundation. Deep learning frameworks needed.', json.dumps(["Python", "TensorFlow", "PyTorch", "Machine Learning", "Mathematics", "Pandas"])),
  ('role_5', 'Backend Developer', 'Engineering', 'High', '₹7-14 LPA', 'Solid APIs understanding. Needs more microservices exposure.', json.dumps(["Node.js", "Python", "Java", "SQL", "MongoDB", "Docker", "Redis"])),
  ('role_6', 'Full Stack Developer', 'Engineering', 'Very High', '₹8-16 LPA', 'Versatile across the stack, needs scalable architectures.', json.dumps(["React", "Node.js", "Express", "MongoDB", "TypeScript", "AWS"])),
  ('role_7', 'UI/UX Designer', 'Design', 'Medium', '₹5-12 LPA', 'Great eye for design. Could improve interactive prototyping.', json.dumps(["Figma", "Adobe XD", "Wireframing", "User Research", "Prototyping"])),
  ('role_8', 'Cybersecurity Analyst', 'Security', 'High', '₹7-15 LPA', 'Good network understanding. Needs SIEM tools hands-on.', json.dumps(["Networking", "Linux", "SIEM", "Ethical Hacking", "Cryptography", "Wireshark"])),
  ('role_9', 'DevOps Engineer', 'Engineering', 'High', '₹10-20 LPA', 'Strong sysadmin skills. Needs to master CI/CD and cloud.', json.dumps(["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform", "Linux"])),
  ('role_10', 'Data Scientist', 'Data', 'Very High', '₹12-24 LPA', 'Excellent math and coding. Needs stronger domain expertise.', json.dumps(["Python", "R", "Machine Learning", "Deep Learning", "SQL", "Data Modeling"])),
  ('role_11', 'Cloud Architect', 'Engineering', 'Very High', '₹15-30 LPA', 'Solid cloud foundation, needs to design enterprise architectures.', json.dumps(["AWS", "Azure", "GCP", "Microservices", "System Design", "Networking"])),
  ('role_12', 'Blockchain Developer', 'Engineering', 'Medium', '₹10-25 LPA', 'Strong backend skills. Needs smart contract development.', json.dumps(["Solidity", "Web3.js", "Ethereum", "Cryptography", "Node.js"])),
  ('role_13', 'Mobile App Developer', 'Engineering', 'High', '₹6-14 LPA', 'Good UI understanding. Needs native or cross-platform mastery.', json.dumps(["React Native", "Flutter", "Swift", "Kotlin", "Mobile UI"])),
  ('role_14', 'Game Developer', 'Engineering', 'Medium', '₹5-15 LPA', 'Passionate about gaming. Needs C++ and engine experience.', json.dumps(["C++", "C#", "Unity", "Unreal Engine", "3D Math"])),
  ('role_15', 'QA Engineer', 'Engineering', 'High', '₹5-10 LPA', 'Detail-oriented. Needs automated testing frameworks.', json.dumps(["Selenium", "Cypress", "Postman", "Java", "Python", "Manual Testing"])),
  ('role_16', 'Business Analyst', 'Management', 'High', '₹6-12 LPA', 'Great communication. Needs more process mapping tools.', json.dumps(["Excel", "SQL", "Requirements Gathering", "Visio", "Agile"])),
  ('role_17', 'Marketing Manager', 'Marketing', 'High', '₹7-15 LPA', 'Creative mind. Needs SEO and analytics mastery.', json.dumps(["SEO", "Google Analytics", "Content Strategy", "Social Media", "CRM"])),
  ('role_18', 'Sales Engineer', 'Sales', 'Medium', '₹8-18 LPA', 'Technical and persuasive. Needs CRM management.', json.dumps(["CRM", "Technical Presentations", "B2B Sales", "Communication"])),
  ('role_19', 'Site Reliability Engineer', 'Engineering', 'High', '₹12-25 LPA', 'Loves uptime. Needs deeper monitoring and infra-as-code.', json.dumps(["Linux", "Python", "Go", "Ansible", "Prometheus", "Grafana"])),
  ('role_20', 'Technical Writer', 'Content', 'Medium', '₹5-10 LPA', 'Writes well. Needs to understand complex system architectures.', json.dumps(["Markdown", "API Documentation", "Git", "Tech Writing", "English"])),
]

c.executemany("INSERT INTO roles (id, title, category, demand_level, avg_salary, why_matches, required_skills) VALUES (?, ?, ?, ?, ?, ?, ?)", roles)

# 30+ Job Opportunities
ops = [
  ('job_1', 'TechNova Solutions', 'React Developer Intern', 'Remote', 'Internship', json.dumps(["React", "JavaScript", "Tailwind"])),
  ('job_2', 'DataSphere', 'Junior Data Analyst', 'Bangalore, India', 'Full-time', json.dumps(["Python", "SQL", "Excel"])),
  ('job_3', 'CloudGen', 'Frontend Engineer', 'Gurgaon, India', 'Full-time', json.dumps(["React", "TypeScript", "Next.js"])),
  ('job_4', 'AI Dynamics', 'Machine Learning Intern', 'Remote', 'Internship', json.dumps(["Python", "TensorFlow", "Pandas"])),
  ('job_5', 'FinTech Innovators', 'Backend Developer', 'Mumbai, India', 'Full-time', json.dumps(["Node.js", "PostgreSQL", "AWS"])),
  ('job_6', 'WebWorks', 'Full Stack Engineer', 'Pune, India', 'Full-time', json.dumps(["MERN Stack", "TypeScript", "Docker"])),
  ('job_7', 'Creative Minds', 'UI/UX Designer', 'Remote', 'Contract', json.dumps(["Figma", "User Research", "CSS"])),
  ('job_8', 'SecureNet', 'Security Analyst', 'Hyderabad, India', 'Full-time', json.dumps(["Networking", "Linux", "SIEM"])),
  ('job_9', 'CloudScale', 'DevOps Engineer', 'Bangalore, India', 'Full-time', json.dumps(["AWS", "Kubernetes", "CI/CD"])),
  ('job_10', 'GlobalTech', 'Product Manager', 'Delhi, India', 'Full-time', json.dumps(["Agile", "Jira", "Market Research"])),
  ('job_11', 'DataWiz', 'Data Scientist', 'Remote', 'Full-time', json.dumps(["Python", "R", "Deep Learning"])),
  ('job_12', 'SkyHigh Cloud', 'Cloud Architect', 'Bangalore, India', 'Full-time', json.dumps(["AWS", "System Design", "Microservices"])),
  ('job_13', 'CryptoNet', 'Blockchain Developer', 'Remote', 'Contract', json.dumps(["Solidity", "Ethereum", "Node.js"])),
  ('job_14', 'Appify', 'Mobile App Developer', 'Chennai, India', 'Full-time', json.dumps(["React Native", "Mobile UI"])),
  ('job_15', 'GameStudios', 'Game Developer Intern', 'Pune, India', 'Internship', json.dumps(["Unity", "C#", "3D Math"])),
  ('job_16', 'BugSquashers', 'QA Automation Engineer', 'Remote', 'Full-time', json.dumps(["Selenium", "Python", "Postman"])),
  ('job_17', 'BizInsights', 'Business Analyst', 'Mumbai, India', 'Full-time', json.dumps(["SQL", "Excel", "Requirements Gathering"])),
  ('job_18', 'MarketPro', 'Digital Marketing Executive', 'Delhi, India', 'Full-time', json.dumps(["SEO", "Google Analytics", "Social Media"])),
  ('job_19', 'TechSales Inc', 'Sales Engineer', 'Bangalore, India', 'Full-time', json.dumps(["CRM", "Technical Presentations", "Communication"])),
  ('job_20', 'Uptime Heroes', 'Site Reliability Engineer', 'Remote', 'Full-time', json.dumps(["Linux", "Ansible", "Prometheus"])),
  ('job_21', 'DocuTech', 'Technical Writer', 'Remote', 'Part-time', json.dumps(["Markdown", "API Documentation", "Git"])),
  ('job_22', 'FinanceHub', 'Backend Node.js Engineer', 'Gurgaon, India', 'Full-time', json.dumps(["Node.js", "Redis", "MongoDB"])),
  ('job_23', 'AI Start', 'Computer Vision Engineer', 'Bangalore, India', 'Full-time', json.dumps(["Python", "PyTorch", "Mathematics"])),
  ('job_24', 'DesignCo', 'Product Designer', 'Remote', 'Full-time', json.dumps(["Figma", "Prototyping", "User Research"])),
  ('job_25', 'NetSecure', 'Penetration Tester', 'Remote', 'Contract', json.dumps(["Ethical Hacking", "Linux", "Wireshark"])),
  ('job_26', 'DeployFast', 'Release Engineer', 'Pune, India', 'Full-time', json.dumps(["Jenkins", "Git", "Linux"])),
  ('job_27', 'DataMind', 'Senior Data Analyst', 'Mumbai, India', 'Full-time', json.dumps(["SQL", "Tableau", "Stats"])),
  ('job_28', 'FrontierTech', 'Angular Developer', 'Chennai, India', 'Full-time', json.dumps(["Angular", "TypeScript", "HTML/CSS"])),
  ('job_29', 'AppMakers', 'iOS Developer', 'Bangalore, India', 'Full-time', json.dumps(["Swift", "Mobile UI", "iOS SDK"])),
  ('job_30', 'CodeCraft', 'Java Backend Developer', 'Remote', 'Full-time', json.dumps(["Java", "Spring Boot", "SQL"])),
]

c.executemany("INSERT INTO opportunities (id, company, title, location, type, required_skills) VALUES (?, ?, ?, ?, ?, ?)", ops)

roadmaps = [
  # Frontend Developer
  ('role_1', 'Beginner', '2 weeks', json.dumps([{"id": "t1", "title": "Master JS Fundamentals", "type": "course"}, {"id": "t2", "title": "Build a DOM manipulation project", "type": "project"}, {"id": "t3", "title": "Learn React Hooks", "type": "course"}])),
  ('role_1', 'Intermediate', '4 weeks', json.dumps([{"id": "t4", "title": "State Management with Redux Toolkit", "type": "course"}, {"id": "t5", "title": "E-Commerce App with React", "type": "project"}])),
  ('role_1', 'Advanced', '3 weeks', json.dumps([{"id": "t6", "title": "Next.js Framework basics", "type": "course"}, {"id": "t7", "title": "Deploy to Vercel with CI/CD", "type": "practice"}])),
  
  # Data Analyst
  ('role_2', 'Beginner', '3 weeks', json.dumps([{"id": "da1", "title": "Python for Data Science", "type": "course"}, {"id": "da2", "title": "SQL Basics & Queries", "type": "course"}])),
  ('role_2', 'Intermediate', '4 weeks', json.dumps([{"id": "da3", "title": "Data Visualization with PowerBI/Tableau", "type": "course"}, {"id": "da4", "title": "Exploratory Data Analysis Project", "type": "project"}])),
  ('role_2', 'Advanced', '4 weeks', json.dumps([{"id": "da5", "title": "Advanced SQL & Window Functions", "type": "practice"}, {"id": "da6", "title": "A/B Testing Foundations", "type": "course"}])),

  # AI/ML Engineer
  ('role_4', 'Beginner', '4 weeks', json.dumps([{"id": "ml1", "title": "Linear Algebra & Calculus for ML", "type": "course"}, {"id": "ml2", "title": "Intro to Machine Learning (Scikit-Learn)", "type": "course"}])),
  ('role_4', 'Intermediate', '6 weeks', json.dumps([{"id": "ml3", "title": "Deep Learning with TensorFlow/PyTorch", "type": "course"}, {"id": "ml4", "title": "Image Classification Project", "type": "project"}])),
  ('role_4', 'Advanced', '5 weeks', json.dumps([{"id": "ml5", "title": "Natural Language Processing (NLP)", "type": "course"}, {"id": "ml6", "title": "Deploying ML Models as APIs", "type": "practice"}])),

  # Full Stack Developer
  ('role_6', 'Beginner', '4 weeks', json.dumps([{"id": "fs1", "title": "HTML/CSS & Vanilla JS", "type": "course"}, {"id": "fs2", "title": "Node.js & Express Basics", "type": "course"}])),
  ('role_6', 'Intermediate', '6 weeks', json.dumps([{"id": "fs3", "title": "React Frontend Development", "type": "course"}, {"id": "fs4", "title": "MongoDB & RESTful APIs", "type": "project"}])),
  ('role_6', 'Advanced', '5 weeks', json.dumps([{"id": "fs5", "title": "Authentication & Authorization (JWT)", "type": "practice"}, {"id": "fs6", "title": "Full Stack Deployment (AWS/Heroku)", "type": "project"}]))
]

c.executemany("INSERT INTO roadmaps (role_id, stage, estimated_completion, tasks) VALUES (?, ?, ?, ?)", roadmaps)

conn.commit()
conn.close()
print("Seeded successfully with massive amounts of real-world data!")
