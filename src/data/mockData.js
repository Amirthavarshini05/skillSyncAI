export const MOCK_ROLES = [
  {
    id: "role_1",
    title: "Frontend Developer",
    category: "Engineering",
    matchScore: 92,
    demandLevel: "High",
    avgSalary: "₹6-12 LPA",
    whyMatches: "Your strong React and UI foundation aligns perfectly with frontend development. Missing some advanced state management.",
    requiredSkills: ["React", "JavaScript", "HTML/CSS", "Redux", "Tailwind"],
  },
  {
    id: "role_2",
    title: "Data Analyst",
    category: "Data",
    matchScore: 85,
    demandLevel: "Very High",
    avgSalary: "₹5-10 LPA",
    whyMatches: "Great start with Python and analytical thinking, but you need SQL and Visualization tools.",
    requiredSkills: ["Python", "SQL", "Tableau/PowerBI", "Stats", "Excel"],
  },
  {
    id: "role_3",
    title: "Product Manager",
    category: "Management",
    matchScore: 78,
    demandLevel: "Medium",
    avgSalary: "₹8-15 LPA",
    whyMatches: "Good communication skills, but lacks structured product thinking and agile methodologies.",
    requiredSkills: ["Agile", "Product Strategy", "User Research", "Data Analytics"],
  }
];

export const MOCK_OPPORTUNITIES = [
  {
    id: "job_1",
    company: "TechNova Solutions",
    title: "React Developer Intern",
    location: "Remote",
    type: "Internship",
    requiredSkills: ["React", "JavaScript", "Tailwind"],
    matchScore: 95
  },
  {
    id: "job_2",
    company: "DataSphere",
    title: "Junior Data Analyst",
    location: "Bangalore, India",
    type: "Full-time",
    requiredSkills: ["Python", "SQL", "Excel"],
    matchScore: 88
  },
  {
    id: "job_3",
    company: "CloudGen",
    title: "Frontend Engineer",
    location: "Gurgaon, India",
    type: "Full-time",
    requiredSkills: ["React", "TypeScript", "Next.js"],
    matchScore: 70
  }
];

export const MOCK_ROADMAP = {
  "role_1": [
    {
      stage: "Beginner",
      estimatedCompletion: "2 weeks",
      tasks: [
        { id: "t1", title: "Master JS Fundamentals", type: "course" },
        { id: "t2", title: "Build a DOM manipulation project", type: "project" },
        { id: "t3", title: "Learn React Hooks", type: "course" }
      ]
    },
    {
      stage: "Intermediate",
      estimatedCompletion: "4 weeks",
      tasks: [
        { id: "t4", title: "State Management with Redux Toolkit", type: "course" },
        { id: "t5", title: "E-Commerce App with React", type: "project" }
      ]
    },
    {
      stage: "Advanced",
      estimatedCompletion: "3 weeks",
      tasks: [
        { id: "t6", title: "Next.js Framework basics", type: "course" },
        { id: "t7", title: "Deploy to Vercel with CI/CD", type: "practice" }
      ]
    }
  ]
};

export const MOCK_SKILLS = [
  { name: "JavaScript", type: "Technical", level: "Advanced" },
  { name: "React", type: "Technical", level: "Intermediate" },
  { name: "UI Design", type: "Domain", level: "Beginner" },
  { name: "Communication", type: "Soft", level: "Advanced" },
  { name: "Python", type: "Technical", level: "Intermediate" }
];
