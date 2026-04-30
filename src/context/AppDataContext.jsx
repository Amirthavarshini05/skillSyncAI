import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AppDataContext = createContext();

export function AppDataProvider({ children }) {
  const { user } = useAuth();
  const [studentProfile, setStudentProfile] = useState(null);
  const [trackedApplications, setTrackedApplications] = useState([]);
  const [skills, setSkills] = useState([]);
  const [roles, setRoles] = useState([]);
  const [roadmap, setRoadmap] = useState({});
  const [opportunities, setOpportunities] = useState([]);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
      const token = localStorage.getItem('skillsync_token');
      if (!token || !user) return;
      
      const headers = { 'Authorization': `Bearer ${token}` };
      
      try {
        const [profileRes, appsRes, skillsRes, rolesRes, roadmapRes, oppsRes, insightsRes] = await Promise.all([
          fetch('http://localhost:8000/api/users/me/profile', { headers }),
          fetch('http://localhost:8000/api/dashboard/applications', { headers }),
          fetch('http://localhost:8000/api/dashboard/skills', { headers }),
          fetch('http://localhost:8000/api/dashboard/roles', { headers }),
          fetch('http://localhost:8000/api/dashboard/roadmap', { headers }),
          fetch('http://localhost:8000/api/dashboard/opportunities', { headers }),
          fetch('http://localhost:8000/api/dashboard/insights', { headers })
        ]);

        if (profileRes.ok) setStudentProfile(await profileRes.json());
        if (appsRes.ok) {
          const apps = await appsRes.json();
          setTrackedApplications(apps.map(a => ({ ...a, jobId: a.job_id, date: a.applied_date })));
        }
        if (skillsRes.ok) setSkills(await skillsRes.json());
        if (rolesRes.ok) {
          const fetchedRoles = await rolesRes.json();
          // Rename snake_case to camelCase
          setRoles(fetchedRoles.map(r => ({
            ...r,
            matchScore: r.match_score,
            demandLevel: r.demand_level,
            avgSalary: r.avg_salary,
            whyMatches: r.why_matches,
            requiredSkills: r.required_skills
          })));
        }
        if (roadmapRes.ok) setRoadmap(await roadmapRes.json());
        if (oppsRes.ok) {
          const fetchedOpps = await oppsRes.json();
          // Rename snake_case to camelCase
          setOpportunities(fetchedOpps.map(o => ({
            ...o,
            matchScore: o.match_score,
            requiredSkills: o.required_skills
          })));
        }
        if (insightsRes.ok) setInsights(await insightsRes.json());

      } catch (err) {
        console.error("Failed to load dashboard data", err);
      }
    };
  const saveProfileProfile = (data) => setStudentProfile(data);
  const refetchData = () => fetchData();

  const applyForJob = async (jobId) => {
    const token = localStorage.getItem('skillsync_token');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:8000/api/dashboard/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ job_id: jobId })
      });
      if (res.ok) {
        const a = await res.json();
        const newApp = { ...a, jobId: a.job_id, date: a.applied_date };
        setTrackedApplications(prev => {
          if (prev.some(app => app.jobId === jobId)) return prev;
          return [...prev, newApp];
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateApplicationStatus = async (appId, newStatus) => {
    const token = localStorage.getItem('skillsync_token');
    if (!token) return;

    // Optimistically update UI
    setTrackedApplications(prev => prev.map(app => 
      app.id === appId ? { ...app, status: newStatus } : app
    ));

    try {
      await fetch(`http://localhost:8000/api/dashboard/applications/${appId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.error(err);
      // Revert on failure by refetching
      refetchData();
    }
  };

  return (
    <AppDataContext.Provider value={{
      studentProfile,
      saveProfileProfile,
      trackedApplications,
      applyForJob,
      updateApplicationStatus,
      skills,
      roles,
      roadmap,
      opportunities,
      insights,
      refetchData
    }}>
      {children}
    </AppDataContext.Provider>
  );
}

export const useAppData = () => useContext(AppDataContext);
