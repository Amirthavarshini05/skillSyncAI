import { Link, useLocation } from 'react-router-dom';
import { Home, User, Target, Zap, Map, TrendingUp, Briefcase, CheckSquare, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const studentLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Skill Profile', path: '/skill-profile', icon: User },
    { name: 'Career Matches', path: '/career-matches', icon: Target },
    { name: 'Skill Gap', path: '/skill-gap', icon: Zap },
    { name: 'Roadmap', path: '/roadmap', icon: Map },
    { name: 'Market Insights', path: '/market-insights', icon: TrendingUp },
    { name: 'Opportunities', path: '/opportunities', icon: Briefcase },
    { name: 'Tracker', path: '/tracker', icon: CheckSquare },
  ];

  const collegeLinks = [
    { name: 'College Dashboard', path: '/dashboard', icon: Home },
  ];

  const recruiterLinks = [
    { name: 'Recruiter Dashboard', path: '/dashboard', icon: Home },
  ];

  let links = studentLinks;
  if (user?.role === 'college') links = collegeLinks;
  if (user?.role === 'recruiter') links = recruiterLinks;

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0">
      <div>
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <span className="text-xl font-bold text-blue-600">SkillSync AI</span>
        </div>
        <nav className="p-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition ${
                  isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{link.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-slate-200 space-y-1">
        <button onClick={logout} className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-red-600 transition">
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}
