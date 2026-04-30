import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, Users, BookOpen, GraduationCap, AlertTriangle, Building,
  CheckCircle2, Loader2, LogOut, Edit2, Save, X, AlertCircle
} from 'lucide-react';

const DEPARTMENTS_LIST = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Aerospace Engineering',
  'Biotechnology',
  'Data Science & AI',
  'Cybersecurity',
  'Business Administration (MBA)',
  'Commerce & Finance',
  'Mathematics & Statistics',
  'Physics',
  'Chemistry',
  'Arts & Humanities',
  'Architecture',
  'Law',
  'Medicine & Health Sciences',
  'Pharmacy',
  'Agriculture',
  'Graphic Design & Media',
  'Environmental Science',
  'Psychology',
];

// Parse the comma-separated departments string into a Set
const parseDepts = (str) =>
  new Set((str || '').split(',').map(s => s.trim()).filter(Boolean));

export default function CollegeDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  const [analytics, setAnalytics] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  // Only editable fields
  const [editStudentCount, setEditStudentCount] = useState(0);
  const [selectedDepts, setSelectedDepts] = useState(new Set());
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);

  const token = localStorage.getItem('skillsync_token');

  useEffect(() => {
    fetchProfile();
    fetchAnalytics();
    fetchStudents();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/users/me/college-profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setEditStudentCount(data.student_count || 0);
        setSelectedDepts(parseDepts(data.departments));
      }
    } catch (err) { console.error(err); }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/college/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setAnalytics(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/college/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setStudents(await res.json());
    } catch (err) { console.error(err); }
  };

  const toggleDept = (dept) => {
    setSelectedDepts(prev => {
      const next = new Set(prev);
      if (next.has(dept)) next.delete(dept);
      else next.add(dept);
      return next;
    });
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const departmentsStr = Array.from(selectedDepts).join(', ');
      const body = {
        institution_name: profile?.institution_name || '',
        institution_type: profile?.institution_type || '',
        student_count: Number(editStudentCount),
        departments: departmentsStr
      };
      const res = await fetch('http://localhost:8000/api/users/me/college-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setIsEditing(false);
        setSaveMsg({ type: 'success', text: 'Profile updated successfully!' });
        await fetchAnalytics();
        await fetchStudents();
      } else {
        const e = await res.json();
        setSaveMsg({ type: 'error', text: e.detail || 'Failed to save' });
      }
    } catch (err) {
      setSaveMsg({ type: 'error', text: 'Network error, please retry.' });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(null), 4000);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditStudentCount(profile?.student_count || 0);
    setSelectedDepts(parseDepts(profile?.departments));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-indigo-950 text-white min-h-screen flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3 text-xl font-bold mb-8">
            <GraduationCap className="text-indigo-400 w-8 h-8" />
            <span>SkillSync <span className="text-indigo-400">Edu</span></span>
          </div>
          <nav className="space-y-2">
            {[
              { id: 'analytics', icon: BarChart3, label: 'Analytics Overview' },
              { id: 'students', icon: Users, label: 'Our Students', badge: analytics?.total_students },
              { id: 'profile', icon: Building, label: 'Institution Profile' }
            ].map(({ id, icon: Icon, label, badge }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === id ? 'bg-indigo-600 shadow-lg shadow-indigo-900/50' : 'hover:bg-indigo-900 text-indigo-200 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
                {badge > 0 && (
                  <span className="ml-auto bg-indigo-500 text-white text-xs py-0.5 px-2 rounded-full">{badge}</span>
                )}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-6">
          <div className="flex items-center gap-3 mb-6 bg-indigo-900/50 p-4 rounded-xl border border-indigo-800">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-lg shadow-inner">
              {profile?.institution_name?.charAt(0) || user?.name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="font-medium text-sm text-white truncate">{profile?.institution_name || 'Institution'}</p>
              <p className="text-xs text-indigo-300 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm text-indigo-300 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto h-screen">
        {/* Save notification */}
        {saveMsg && (
          <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
            saveMsg.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
          }`}>
            {saveMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {saveMsg.text}
          </div>
        )}

        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {activeTab === 'analytics' && 'Analytics Overview'}
              {activeTab === 'students' && 'Our Students'}
              {activeTab === 'profile' && 'Institution Profile'}
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              {activeTab === 'analytics' && 'Insights on student skill gaps, goals, and platform engagement.'}
              {activeTab === 'students' && 'Students from your institution currently active on SkillSync.'}
              {activeTab === 'profile' && 'Manage your institutional settings and capacity.'}
            </p>
          </div>
          {activeTab === 'profile' && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </header>

        <div className="max-w-7xl mx-auto">
          {/* ── ANALYTICS ─────────────────────────────────────── */}
          {activeTab === 'analytics' && analytics && (
            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                    <Users className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Active Students</p>
                    <h3 className="text-3xl font-extrabold text-slate-900">{analytics.total_students}</h3>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Top Career Goal</p>
                    <h3 className="text-xl font-bold text-slate-900 truncate">
                      {analytics.top_career_goals?.[0]?.goal || 'N/A'}
                    </h3>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
                  <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Most Missing Skill</p>
                    <h3 className="text-xl font-bold text-slate-900 truncate">
                      {analytics.missing_skills?.[0]?.skill || 'N/A'}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Popular Skills */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
                    <BarChart3 className="text-indigo-600 w-5 h-5" />
                    <h2 className="text-lg font-bold text-slate-900">Most Popular Skills</h2>
                  </div>
                  <div className="p-6 flex-1">
                    {analytics.top_skills?.length === 0 ? (
                      <p className="text-slate-500 text-center py-8">No data yet.</p>
                    ) : (
                      <div className="space-y-5">
                        {analytics.top_skills.map((item, idx) => {
                          const pct = analytics.total_students > 0
                            ? Math.round((item.count / analytics.total_students) * 100)
                            : 0;
                          return (
                            <div key={idx}>
                              <div className="flex justify-between text-sm font-medium mb-1">
                                <span className="text-slate-700">{item.skill}</span>
                                <span className="text-slate-500">{item.count} ({pct}%)</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-2">
                                <div className="bg-indigo-500 h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Skill Gaps */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-slate-100 bg-rose-50 flex items-center gap-3">
                    <BookOpen className="text-rose-600 w-5 h-5" />
                    <h2 className="text-lg font-bold text-slate-900">Curriculum Skill Gaps</h2>
                  </div>
                  <div className="p-6 flex-1">
                    <p className="text-sm text-slate-500 mb-6">
                      Standard industry skills frequently missing from student profiles.
                    </p>
                    {analytics.missing_skills?.length === 0 ? (
                      <p className="text-slate-500 text-center py-8">No significant gaps identified.</p>
                    ) : (
                      <div className="space-y-4">
                        {analytics.missing_skills.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                              <span className="font-semibold text-slate-700">{item.skill}</span>
                            </div>
                            <span className="text-sm font-medium text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
                              Missing in {item.count} profiles
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STUDENTS ──────────────────────────────────────── */}
          {activeTab === 'students' && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              {students.length === 0 ? (
                <div className="text-center py-16">
                  <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-700 mb-2">No students found</h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    Students must enter your exact institution name during onboarding to appear here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
                        <th className="p-5 font-semibold">Student</th>
                        <th className="p-5 font-semibold">Career Goal</th>
                        <th className="p-5 font-semibold">Department</th>
                        <th className="p-5 font-semibold">Top Skills</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {students.map((student) => (
                        <tr key={student.user_id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-5">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
                                {student.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{student.name}</p>
                                <p className="text-xs text-slate-500">{student.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-5">
                            {student.career_goal
                              ? <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 font-medium text-xs rounded-md border border-blue-100">{student.career_goal}</span>
                              : <span className="text-slate-400 text-sm italic">Undecided</span>
                            }
                          </td>
                          <td className="p-5 text-sm font-medium text-slate-700">
                            {student.department || <span className="text-slate-400 italic">Not specified</span>}
                          </td>
                          <td className="p-5">
                            <div className="flex flex-wrap gap-1.5">
                              {student.skills.slice(0, 3).map((s, i) => (
                                <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">{s}</span>
                              ))}
                              {student.skills.length > 3 && (
                                <span className="text-xs text-slate-400 font-medium px-1 py-1">+{student.skills.length - 3}</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── INSTITUTION PROFILE ───────────────────────────── */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm max-w-2xl">
              <div className="flex items-center justify-between mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-slate-900">Institution Settings</h2>
                {isEditing ? (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center gap-1 px-3 py-1.5 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded-lg text-sm"
                    >
                      <X className="w-4 h-4" /> Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium disabled:opacity-60"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save Changes
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 px-3 py-1.5 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded-lg text-sm"
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Institution Name — always read-only */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Institution Name</label>
                  <div className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-medium">
                    {profile?.institution_name}
                  </div>
                  <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Students must enter this exact name during onboarding to appear in analytics.
                  </p>
                </div>

                {/* Institution Type — always read-only */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Institution Type</label>
                  <div className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600">
                    {profile?.institution_type}
                  </div>
                </div>

                {/* Student Count (editable) + Active (read-only) */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Total Student Capacity
                      {!isEditing && <span className="ml-2 text-xs font-normal text-indigo-500">(editable)</span>}
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        min={0}
                        value={editStudentCount}
                        onChange={e => setEditStudentCount(e.target.value)}
                        className="w-full px-4 py-2.5 border border-indigo-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <div className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600">
                        {profile?.student_count?.toLocaleString()}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Active on SkillSync</label>
                    <div className="w-full px-4 py-2.5 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-700 font-bold">
                      {analytics?.total_students ?? '0'}
                    </div>
                  </div>
                </div>

                {/* Departments — checkbox multi-select */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Top Departments / Streams
                      {!isEditing && <span className="ml-2 text-xs font-normal text-indigo-500">(editable)</span>}
                    </label>
                    {isEditing && (
                      <span className="text-xs text-slate-400">
                        {selectedDepts.size} selected
                      </span>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="border border-indigo-300 rounded-xl overflow-hidden">
                      <div className="bg-indigo-50 px-4 py-2.5 border-b border-indigo-200 text-xs font-semibold text-indigo-700 uppercase tracking-wide">
                        Select all that apply — click to toggle
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 max-h-72 overflow-y-auto divide-y divide-slate-100">
                        {DEPARTMENTS_LIST.map((dept) => {
                          const checked = selectedDepts.has(dept);
                          return (
                            <button
                              key={dept}
                              type="button"
                              onClick={() => toggleDept(dept)}
                              className={`flex items-center gap-3 px-4 py-3 text-left transition-colors w-full ${
                                checked
                                  ? 'bg-indigo-50 text-indigo-800'
                                  : 'bg-white text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <span className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                                checked ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'
                              }`}>
                                {checked && (
                                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </span>
                              <span className={`text-sm font-medium ${checked ? 'text-indigo-800' : 'text-slate-700'}`}>
                                {dept}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {parseDepts(profile?.departments).size > 0
                        ? Array.from(parseDepts(profile?.departments)).map((dept, i) => (
                            <span key={i} className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-sm font-medium">
                              {dept}
                            </span>
                          ))
                        : <span className="text-slate-400 text-sm italic">No departments configured</span>
                      }
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
