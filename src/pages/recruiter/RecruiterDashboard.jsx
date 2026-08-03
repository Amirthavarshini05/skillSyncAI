import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Search, Bookmark, BookmarkCheck, Briefcase, User as UserIcon,
  Loader2, LogOut, Edit2, Save, X, CheckCircle2, AlertCircle,
  ExternalLink, FolderGit2, GraduationCap, Phone, Mail
} from 'lucide-react';

// ─── Predefined option lists ───────────────────────────────────────────────────
const TARGET_ROLES_LIST = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Mobile Developer',
  'DevOps Engineer',
  'Cloud Architect',
  'Data Engineer',
  'Data Scientist',
  'Machine Learning Engineer',
  'AI/LLM Engineer',
  'Cybersecurity Analyst',
  'Blockchain Developer',
  'Embedded Systems Engineer',
  'QA / Test Engineer',
  'UI/UX Designer',
  'Product Manager',
  'Business Analyst',
  'Scrum Master / Agile Coach',
  'Database Administrator',
  'Network Engineer',
  'System Administrator',
  'Technical Writer',
  'Research Scientist',
  'Game Developer',
];

const SKILLS_LIST = [
  // Languages
  'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin',
  // Frontend
  'React', 'Angular', 'Vue.js', 'Next.js', 'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap',
  // Backend
  'Node.js', 'Express.js', 'Django', 'Flask', 'FastAPI', 'Spring Boot',
  // Mobile
  'Flutter', 'React Native',
  // Databases
  'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis',
  // DevOps & Cloud
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'CI/CD', 'Git', 'Linux',
  // AI/ML
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy',
  // Data & Viz
  'Data Analysis', 'Power BI', 'Tableau', 'Excel',
  // Design
  'Figma', 'Photoshop',
  // Soft skills
  'Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Agile', 'Scrum',
];

// ─── Checkbox picker component (reusable) ─────────────────────────────────────
function CheckboxPicker({ options, selected, onToggle, accentColor = 'blue' }) {
  const colorMap = {
    blue: {
      header: 'bg-blue-50 border-blue-200 text-blue-700',
      checked: 'bg-blue-600 border-blue-600',
      row: 'bg-blue-50 text-blue-800',
      label: 'text-blue-800',
    }
  };
  const c = colorMap[accentColor] || colorMap.blue;

  return (
    <div className="border border-blue-300 rounded-xl overflow-hidden">
      <div className={`px-4 py-2.5 border-b border-blue-200 text-xs font-semibold uppercase tracking-wide ${c.header}`}>
        Select all that apply — click to toggle &nbsp;·&nbsp; {selected.size} selected
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 max-h-64 overflow-y-auto divide-y divide-slate-100">
        {options.map((opt) => {
          const checked = selected.has(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className={`flex items-center gap-3 px-4 py-3 text-left transition-colors w-full ${
                checked ? c.row : 'bg-white hover:bg-slate-50'
              }`}
            >
              <span className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                checked ? c.checked : 'border-slate-300'
              }`}>
                {checked && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <span className={`text-sm font-medium ${checked ? c.label : 'text-slate-700'}`}>{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const parseSet = (val) => {
  if (Array.isArray(val)) return new Set(val.filter(Boolean));
  return new Set((val || '').split(',').map(s => s.trim()).filter(Boolean));
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RecruiterDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('matches');
  const [matches, setMatches] = useState([]);
  const [shortlist, setShortlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editCompanyName, setEditCompanyName] = useState('');
  const [editIndustry, setEditIndustry] = useState('');
  const [selectedRoles, setSelectedRoles] = useState(new Set());
  const [selectedSkills, setSelectedSkills] = useState(new Set());
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);

  // Learning modal
  const [learningModal, setLearningModal] = useState(null); // { student, projects, loading }

  const token = localStorage.getItem('skillsync_token');

  useEffect(() => {
    fetchProfile();
    fetchMatches();
    fetchShortlist();
  }, []);

  const syncEditState = (data) => {
    setEditCompanyName(data.company_name || '');
    setEditIndustry(data.industry || '');
    setSelectedRoles(parseSet(data.target_roles));
    setSelectedSkills(parseSet(data.required_skills));
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/users/me/recruiter-profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        syncEditState(data);
      }
    } catch (err) { console.error(err); }
  };

  const fetchMatches = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/recruiter/match', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setMatches(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchShortlist = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/recruiter/shortlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setShortlist(await res.json());
    } catch (err) { console.error(err); }
  };

  const openLearning = async (match) => {
    setLearningModal({ student: match, projects: [], loading: true });
    try {
      const res = await fetch(`http://localhost:8000/api/recruiter/student/${match.user_id}/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const projects = res.ok ? await res.json() : [];
      setLearningModal({ student: match, projects, loading: false });
    } catch (err) {
      setLearningModal({ student: match, projects: [], loading: false });
    }
  };

  const handleShortlist = async (studentId) => {
    try {
      const res = await fetch('http://localhost:8000/api/recruiter/shortlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ student_id: studentId, notes: '' })
      });
      if (res.ok) fetchShortlist();
      else { const e = await res.json(); alert(e.detail || 'Could not shortlist'); }
    } catch (err) { console.error(err); }
  };

  const isShortlisted = (id) => shortlist.some(s => s.student_id === id);

  const toggleRole = (role) => setSelectedRoles(prev => {
    const next = new Set(prev);
    next.has(role) ? next.delete(role) : next.add(role);
    return next;
  });

  const toggleSkill = (skill) => setSelectedSkills(prev => {
    const next = new Set(prev);
    next.has(skill) ? next.delete(skill) : next.add(skill);
    return next;
  });

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const body = {
        company_name: editCompanyName,
        industry: editIndustry,
        target_roles: Array.from(selectedRoles).join(', '),
        required_skills: Array.from(selectedSkills),
      };
      const res = await fetch('http://localhost:8000/api/users/me/recruiter-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setIsEditing(false);
        setSaveMsg({ type: 'success', text: 'Profile updated successfully!' });
        await fetchMatches();
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
    syncEditState(profile || {});
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (score >= 40) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside className="w-full md:w-64 bg-slate-900 text-white min-h-screen flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3 text-xl font-bold mb-8">
            <Briefcase className="text-blue-400" />
            <span>SkillSync <span className="text-blue-400">Recruit</span></span>
          </div>
          <nav className="space-y-2">
            {[
              { id: 'matches', icon: Search, label: 'Candidate Matcher' },
              { id: 'shortlist', icon: Bookmark, label: 'Shortlisted', badge: shortlist.length },
              { id: 'profile', icon: UserIcon, label: 'Company Profile' }
            ].map(({ id, icon: Icon, label, badge }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === id ? 'bg-blue-600 shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
                {badge > 0 && (
                  <span className="ml-auto bg-blue-500 text-white text-xs py-0.5 px-2 rounded-full">{badge}</span>
                )}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-6">
          <div className="flex items-center gap-3 mb-6 bg-slate-800 p-4 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-lg">
              {profile?.company_name?.charAt(0) || user?.name?.charAt(0) || '?'}
            </div>
            <div className="overflow-hidden">
              <p className="font-medium text-sm text-white truncate">{profile?.company_name || 'Company'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main Content ──────────────────────────────────────── */}
      <main className="flex-1 p-8 overflow-y-auto h-screen">
        {/* Toast notification */}
        {saveMsg && (
          <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-sm font-medium ${
            saveMsg.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
          }`}>
            {saveMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {saveMsg.text}
          </div>
        )}

        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {activeTab === 'matches' && 'Candidate Matcher'}
              {activeTab === 'shortlist' && 'Shortlisted Candidates'}
              {activeTab === 'profile' && 'Company Profile'}
            </h1>
            <p className="text-slate-500 mt-1">
              {activeTab === 'matches' && `${matches.length} candidate(s) match at least one of your required skills.`}
              {activeTab === 'shortlist' && 'Manage your saved student profiles.'}
              {activeTab === 'profile' && 'Manage your recruitment preferences.'}
            </p>
          </div>
          {activeTab === 'profile' && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </header>

        <div className="max-w-6xl">

          {/* ── CANDIDATE MATCHES ─────────────────────────────── */}
          {activeTab === 'matches' && (
            <div className="space-y-6">
              {matches.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                  <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No matching candidates found.</p>
                  <p className="text-sm text-slate-400 mt-2">Add required skills in Company Profile to find candidates.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {matches.map((match) => (
                    <div key={match.user_id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl">
                            {match.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-lg">{match.name}</h3>
                            <p className="text-slate-500 text-sm">{match.education?.collegeName || 'University Student'}</p>
                            {isShortlisted(match.user_id) && (
                              <div className="flex flex-col gap-1 mt-2">
                                <div className="flex items-center gap-2 text-xs text-blue-600 font-medium">
                                  <Mail className="w-3 h-3" /> {match.email}
                                </div>
                                {match.phone && (
                                  <div className="flex items-center gap-2 text-xs text-blue-600 font-medium">
                                    <Phone className="w-3 h-3" /> {match.phone}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className={`inline-flex items-center justify-center px-3 py-1 font-bold rounded-full border text-sm shadow-sm ${getScoreColor(match.match_score)}`}>
                          {match.match_score}% Match
                        </div>
                      </div>

                      {/* Matched (required) skills highlighted green */}
                      {match.matched_skills?.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            ✓ Skills matching your requirements
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {match.matched_skills.map((s, i) => (
                              <span key={i} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-semibold border border-emerald-200">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Other skills */}
                      {match.skills.filter(s => !match.matched_skills?.includes(s.name)).length > 0 && (
                        <div className="mb-5">
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Additional Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {match.skills
                              .filter(s => !match.matched_skills?.includes(s.name))
                              .slice(0, 4)
                              .map((s, i) => (
                                <span key={i} className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-md text-xs font-medium border border-slate-200">
                                  {s.name}
                                </span>
                              ))}
                            {match.skills.filter(s => !match.matched_skills?.includes(s.name)).length > 4 && (
                              <span className="px-2.5 py-1 bg-slate-50 text-slate-500 rounded-md text-xs border border-slate-200">
                                +{match.skills.filter(s => !match.matched_skills?.includes(s.name)).length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        {/* Project count badge */}
                        <button
                          onClick={() => openLearning(match)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 rounded-lg text-xs font-semibold transition-colors"
                        >
                          <FolderGit2 className="w-3.5 h-3.5" />
                          {match.project_count > 0
                            ? `${match.project_count} Project${match.project_count > 1 ? 's' : ''} Submitted`
                            : 'View Learning'}
                        </button>

                        {isShortlisted(match.user_id) ? (
                          <button disabled className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-500 rounded-lg text-sm font-medium cursor-not-allowed">
                            <BookmarkCheck className="w-4 h-4" />
                            Shortlisted
                          </button>
                        ) : (
                          <button
                            onClick={() => handleShortlist(match.user_id)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            <Bookmark className="w-4 h-4" />
                            Shortlist
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── SHORTLIST ────────────────────────────────────── */}
          {activeTab === 'shortlist' && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              {shortlist.length === 0 ? (
                <div className="text-center py-12">
                  <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No candidates shortlisted yet.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                      <th className="p-4 font-medium">Candidate</th>
                      <th className="p-4 font-medium">Contact Info</th>
                      <th className="p-4 font-medium">Date Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shortlist.map((item) => (
                      <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                              {item.student?.name?.charAt(0) || '?'}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{item.student?.name || 'Unknown'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <Mail className="w-3 h-3 text-slate-400" /> {item.student?.email}
                            </div>
                            {item.student?.phone && (
                              <div className="flex items-center gap-2 text-xs text-slate-600">
                                <Phone className="w-3 h-3 text-slate-400" /> {item.student?.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-sm text-slate-600">
                          {new Date(item.added_date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* ── COMPANY PROFILE ──────────────────────────────── */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm max-w-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 border-b pb-4">
                <h2 className="text-lg font-bold text-slate-900">Recruitment Preferences</h2>
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
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-60"
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
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editCompanyName}
                      onChange={e => setEditCompanyName(e.target.value)}
                      placeholder="e.g. Acme Corp"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  ) : (
                    <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-600 text-sm">
                      {profile?.company_name || <span className="italic text-slate-400">Not set</span>}
                    </div>
                  )}
                </div>

                {/* Industry */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editIndustry}
                      onChange={e => setEditIndustry(e.target.value)}
                      placeholder="e.g. FinTech, EdTech, Healthcare"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  ) : (
                    <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-600 text-sm">
                      {profile?.industry || <span className="italic text-slate-400">Not set</span>}
                    </div>
                  )}
                </div>

                {/* Target Roles — checkbox picker */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Target Roles
                      {!isEditing && <span className="ml-2 text-xs font-normal text-blue-500">(editable)</span>}
                    </label>
                  </div>
                  {isEditing ? (
                    <CheckboxPicker
                      options={TARGET_ROLES_LIST}
                      selected={selectedRoles}
                      onToggle={toggleRole}
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {parseSet(profile?.target_roles).size > 0
                        ? Array.from(parseSet(profile?.target_roles)).map((role, i) => (
                            <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-medium">
                              {role}
                            </span>
                          ))
                        : <span className="text-slate-400 text-sm italic">No target roles configured</span>
                      }
                    </div>
                  )}
                </div>

                {/* Required Skills — checkbox picker */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Required Skills{' '}
                      <span className="text-xs text-slate-400 font-normal">(used by matching engine)</span>
                      {!isEditing && <span className="ml-2 text-xs font-normal text-blue-500">(editable)</span>}
                    </label>
                  </div>
                  {isEditing ? (
                    <CheckboxPicker
                      options={SKILLS_LIST}
                      selected={selectedSkills}
                      onToggle={toggleSkill}
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {(profile?.required_skills?.length > 0)
                        ? profile.required_skills.map((skill, i) => (
                            <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium border border-slate-200">
                              {skill}
                            </span>
                          ))
                        : <span className="text-slate-400 text-sm italic">No skills configured</span>
                      }
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── LEARNING MODAL ───────────────────────────────────── */}
      {learningModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setLearningModal(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-violet-600 to-indigo-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-lg">
                  {learningModal.student.name.charAt(0)}
                </div>
                <div>
                  <h2 className="font-bold text-white text-lg leading-tight">{learningModal.student.name}</h2>
                  <p className="text-violet-200 text-xs">{learningModal.student.education?.collegeName || 'Student'}</p>
                </div>
              </div>
              <button onClick={() => setLearningModal(null)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-3 bg-violet-50 border-b border-violet-100 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-violet-600" />
              <span className="text-sm font-semibold text-violet-700">Submitted Projects &amp; Learning Proof</span>
              {!learningModal.loading && (
                <span className="ml-auto text-xs font-bold text-violet-500 bg-violet-100 px-2 py-0.5 rounded-full">
                  {learningModal.projects.length} project{learningModal.projects.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              {learningModal.loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
                </div>
              ) : learningModal.projects.length === 0 ? (
                <div className="text-center py-12">
                  <FolderGit2 className="w-14 h-14 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No projects submitted yet</p>
                  <p className="text-slate-400 text-sm mt-1">This student hasn't submitted any project URLs in their roadmap.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(
                    learningModal.projects.reduce((acc, p) => {
                      if (!acc[p.role_title]) acc[p.role_title] = [];
                      acc[p.role_title].push(p);
                      return acc;
                    }, {})
                  ).map(([roleTitle, projs]) => (
                    <div key={roleTitle}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{roleTitle}</span>
                        <div className="flex-1 h-px bg-slate-100" />
                        <span className="text-xs text-slate-400">{projs.length} project{projs.length > 1 ? 's' : ''}</span>
                      </div>
                      <div className="space-y-2">
                        {projs.map((proj, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:border-violet-200 hover:bg-violet-50 transition-colors">
                            <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <FolderGit2 className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-700">{proj.task_title}</p>
                              <a
                                href={proj.link}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-medium mt-0.5 truncate max-w-full"
                              >
                                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{proj.link}</span>
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="text-xs text-slate-400">
                <span className="font-semibold text-slate-600">{learningModal.student.match_score}%</span> skill match
                {learningModal.student.project_count > 0 && (
                  <span className="ml-2 text-violet-600 font-semibold">· {learningModal.student.project_count} project{learningModal.student.project_count > 1 ? 's' : ''}</span>
                )}
              </div>
              {!isShortlisted(learningModal.student.user_id) && (
                <button
                  onClick={() => { handleShortlist(learningModal.student.user_id); setLearningModal(null); }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Bookmark className="w-4 h-4" />
                  Shortlist Candidate
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
