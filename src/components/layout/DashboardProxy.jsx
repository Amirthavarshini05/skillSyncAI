import { useAuth } from '../../context/AuthContext';
import StudentDashboard from '../../pages/student/StudentDashboard';
import CollegeDashboard from '../../pages/college/CollegeDashboard';
import RecruiterDashboard from '../../pages/recruiter/RecruiterDashboard';

export default function DashboardProxy() {
  const { user } = useAuth();
  
  if (user?.role === 'college') return <CollegeDashboard />;
  if (user?.role === 'recruiter') return <RecruiterDashboard />;
  
  return <StudentDashboard />;
}
