import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for mock user session
    const storedUser = localStorage.getItem('skillsync_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password, role) => {
    const mockUser = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role: role || 'student',
    };
    setUser(mockUser);
    localStorage.setItem('skillsync_user', JSON.stringify(mockUser));
  };

  const signup = (name, email, password, role) => {
    const mockUser = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      name,
      email,
      role: role || 'student',
      needsOnboarding: true
    };
    setUser(mockUser);
    localStorage.setItem('skillsync_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('skillsync_user');
  };

  const completeOnboarding = () => {
    if (user) {
      const updatedUser = { ...user, needsOnboarding: false };
      setUser(updatedUser);
      localStorage.setItem('skillsync_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
