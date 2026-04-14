import { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_SKILLS, MOCK_ROLES, MOCK_ROADMAP, MOCK_OPPORTUNITIES } from '../data/mockData';

const AppDataContext = createContext();

export function AppDataProvider({ children }) {
  const [studentProfile, setStudentProfile] = useState(() => {
    const saved = localStorage.getItem('skillsync_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [trackedApplications, setTrackedApplications] = useState(() => {
    const saved = localStorage.getItem('skillsync_apps');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (studentProfile) {
      localStorage.setItem('skillsync_profile', JSON.stringify(studentProfile));
    }
  }, [studentProfile]);

  useEffect(() => {
    localStorage.setItem('skillsync_apps', JSON.stringify(trackedApplications));
  }, [trackedApplications]);

  const saveProfileProfile = (data) => setStudentProfile(data);

  const applyForJob = (jobId) => {
    if (!trackedApplications.some(app => app.jobId === jobId)) {
      setTrackedApplications([...trackedApplications, { jobId, status: 'Applied', date: new Date().toISOString() }]);
    }
  };

  return (
    <AppDataContext.Provider value={{
      studentProfile,
      saveProfileProfile,
      trackedApplications,
      applyForJob,
      skills: MOCK_SKILLS,
      roles: MOCK_ROLES,
      roadmap: MOCK_ROADMAP,
      opportunities: MOCK_OPPORTUNITIES
    }}>
      {children}
    </AppDataContext.Provider>
  );
}

export const useAppData = () => useContext(AppDataContext);
