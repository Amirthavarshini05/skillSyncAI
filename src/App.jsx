import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';
import LandingPage from './pages/public/LandingPage';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Onboarding from './pages/auth/Onboarding';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardProxy from './components/layout/DashboardProxy';
import CareerMatches from './pages/student/CareerMatches';
import SkillProfile from './pages/student/SkillProfile';
import Roadmap from './pages/student/Roadmap';
import Opportunities from './pages/student/Opportunities';
import ApplicationTracker from './pages/student/ApplicationTracker';
import SkillGap from './pages/student/SkillGap';
import MarketInsights from './pages/student/MarketInsights';

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/" />;
  if (role && user.role !== role) return <Navigate to="/dashboard" />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            } />
            
            <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<DashboardProxy />} />
              <Route path="skill-profile" element={<SkillProfile />} />
              <Route path="career-matches" element={<CareerMatches />} />
              <Route path="skill-gap" element={<SkillGap />} />
              <Route path="roadmap" element={<Roadmap />} />
              <Route path="market-insights" element={<MarketInsights />} />
              <Route path="opportunities" element={<Opportunities />} />
              <Route path="tracker" element={<ApplicationTracker />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppDataProvider>
    </AuthProvider>
  );
}

export default App;
