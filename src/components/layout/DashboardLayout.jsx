import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { User, LogOut, Phone, Mail, Settings, X, Check, Edit2, Loader2 } from 'lucide-react';
import AiMentorChatbot from '../chat/AiMentorChatbot';

export default function DashboardLayout() {
  const { user, logout, refetchUser } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('skillsync_token');
      const res = await fetch('http://localhost:8000/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, phone })
      });
      if (res.ok) {
        await refetchUser();
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 justify-between sticky top-0 z-30">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">SkillSync <span className="text-blue-600">AI</span> Dashboard</h1>
          
          <div className="flex items-center space-x-4">
             <button 
               onClick={() => setShowProfile(!showProfile)}
               className="group relative flex items-center space-x-2 p-1 pr-3 hover:bg-slate-50 rounded-full transition-all border border-transparent hover:border-slate-200"
             >
               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-105 transition-transform">
                 {user?.name?.charAt(0) || 'U'}
               </div>
               <span className="text-sm font-medium text-slate-700 hidden sm:block">{user?.name}</span>
             </button>
          </div>

          {/* Profile Dropdown */}
          {showProfile && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)}></div>
              <div className="absolute right-8 top-14 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative">
                   <button 
                     onClick={() => setShowProfile(false)}
                     className="absolute top-4 right-4 text-slate-400 hover:text-white"
                   >
                     <X className="w-4 h-4"/>
                   </button>
                   <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center text-2xl font-bold">
                        {user?.name?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg leading-tight">{user?.name}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 uppercase tracking-wider font-semibold">
                          {user?.role} Profile
                        </p>
                      </div>
                   </div>
                </div>

                <div className="p-6 space-y-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                         <Mail className="w-4 h-4 text-slate-300"/>
                         <span>{user?.email}</span>
                      </div>
                   </div>

                   <div className="space-y-1">
                      <div className="flex justify-between items-center">
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Number</label>
                         {!isEditing && (
                           <button onClick={() => setIsEditing(true)} className="text-[10px] font-bold text-blue-600 hover:underline">EDIT</button>
                         )}
                      </div>
                      {isEditing ? (
                         <div className="flex items-center space-x-2">
                            <input 
                              autoFocus
                              className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="Add phone number"
                            />
                            <button 
                              onClick={handleSave} 
                              disabled={saving}
                              className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                               {saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Check className="w-4 h-4"/>}
                            </button>
                         </div>
                      ) : (
                         <div className="flex items-center space-x-2 text-sm text-slate-600">
                            <Phone className="w-4 h-4 text-slate-300"/>
                            <span>{user?.phone || <span className="italic text-slate-300">Not provided</span>}</span>
                         </div>
                      )}
                   </div>

                   <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2">
                      {user?.role === 'student' && (
                        <button 
                          onClick={() => { setShowProfile(false); navigate('/skill-profile'); }}
                          className="flex items-center space-x-3 px-3 py-2 rounded-xl text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition group"
                        >
                          <User className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                          <span className="text-sm font-medium">View Skill Profile</span>
                        </button>
                      )}
                      <button 
                        onClick={() => { logout(); navigate('/'); }}
                        className="flex items-center space-x-3 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Log Out</span>
                      </button>
                   </div>
                </div>
              </div>
            </>
          )}
        </header>
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
      <AiMentorChatbot />
    </div>
  );
}
