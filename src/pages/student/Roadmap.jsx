import { useState, useEffect } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Circle, ArrowLeft, Link as LinkIcon, Send, Undo2 } from 'lucide-react';

export default function Roadmap() {
  const { roadmap, roles, studentProfile, refetchData } = useAppData();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  // Local state mirroring the backend roadmap_progress JSON
  const [progress, setProgress] = useState({});
  // State for the currently active project input box (stores draft link)
  const [activeProjectInput, setActiveProjectInput] = useState({ id: null, link: '' });

  // Update local state when profile loads
  useEffect(() => {
    if (studentProfile?.roadmap_progress) {
      setProgress(studentProfile.roadmap_progress);
    }
  }, [studentProfile]);

  // Resolve which role to show
  const paramRoleId = searchParams.get('role');
  const defaultRoleId = roles.length > 0 ? roles[0].id : 'role_1';
  const activeRoleId = paramRoleId || defaultRoleId;

  const stages = roadmap[activeRoleId] || [];
  const stateTitle = location.state?.title;
  const activeRole = roles.find((r) => r.id === activeRoleId);
  const roleTitle = stateTitle || activeRole?.title || activeRoleId;
  const rolesWithRoadmap = roles.filter((r) => roadmap[r.id]);

  // API Call to save progress & skills
  const saveProgressToBackend = async (newProgress, newlyEarnedArray = []) => {
    const token = localStorage.getItem('skillsync_token');
    if (!token || !studentProfile) return;

    let updatedSkills = [...studentProfile.skills];
    // Map existing skills to handle updates
    const existingMap = new Map();
    updatedSkills.forEach((s, idx) => existingMap.set(s.name.toLowerCase(), idx));

    const levelRank = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };

    if (newlyEarnedArray.length > 0) {
      newlyEarnedArray.forEach(newS => {
        const lowerName = newS.name.toLowerCase();
        if (existingMap.has(lowerName)) {
           const idx = existingMap.get(lowerName);
           const currentLvl = updatedSkills[idx].level;
           const currentRank = levelRank[currentLvl] || 0;
           const newRank = levelRank[newS.level] || 0;
           if (newRank > currentRank) {
              updatedSkills[idx].level = newS.level;
           }
        } else {
           updatedSkills.push({ name: newS.name, level: newS.level });
           existingMap.set(lowerName, updatedSkills.length - 1);
        }
      });
    }

    try {
      const res = await fetch('http://localhost:8000/api/users/me/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          skills: updatedSkills,
          education: studentProfile.education || {},
          preferences: studentProfile.preferences || {},
          roadmap_progress: newProgress,
          resume_path: studentProfile.resume_path,
          resume_data: studentProfile.resume_data
        })
      });
      if (res.ok) {
        refetchData(); // Refresh global context so profile update reflects everywhere
      }
    } catch (e) {
      console.error("Failed to save progress", e);
    }
  };

  const getNewlyEarnedSkills = (currentProgress) => {
    let earned = [];
    stages.forEach(stage => {
      const allTasksCompleted = stage.tasks.every(t => currentProgress[t.id]?.completed);
      if (allTasksCompleted && stage.skills_learned) {
         try {
           const parsedSkills = typeof stage.skills_learned === 'string' 
             ? JSON.parse(stage.skills_learned) 
             : stage.skills_learned;
           parsedSkills.forEach(s => earned.push({ name: s, level: stage.stage }));
         } catch(e) { console.error("Error parsing skills", e); }
      }
    });
    return earned;
  };

  const toggleNormalTask = (id) => {
    const isDone = progress[id]?.completed;
    const newProgress = { ...progress };
    
    if (isDone) {
      delete newProgress[id];
    } else {
      newProgress[id] = { completed: true };
    }
    
    setProgress(newProgress);
    saveProgressToBackend(newProgress, getNewlyEarnedSkills(newProgress));
  };

  const handleProjectClick = (id, e) => {
    e.stopPropagation(); // prevent parent div click
    const isDone = progress[id]?.completed;
    if (isDone) {
       // Allow them to undo
       const newProgress = { ...progress };
       delete newProgress[id];
       setProgress(newProgress);
       saveProgressToBackend(newProgress, getNewlyEarnedSkills(newProgress));
    } else {
       // Open input
       setActiveProjectInput(prev => prev.id === id ? {id: null, link: ''} : { id, link: '' });
    }
  };

  const submitProject = (id) => {
    if (!activeProjectInput.link) return;
    
    const newProgress = { ...progress, [id]: { completed: true, link: activeProjectInput.link } };
    setProgress(newProgress);
    setActiveProjectInput({ id: null, link: '' });
    
    saveProgressToBackend(newProgress, getNewlyEarnedSkills(newProgress));
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12 animate-fade-in">
      <Link
        to="/career-matches"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Career Matches
      </Link>

      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Career Roadmap: <span className="text-indigo-600">{roleTitle}</span>
        </h2>
        <p className="text-slate-500 mt-1">
          Complete stages to unlock basic skills in your profile. Projects require a public URL.
        </p>
      </div>

      {rolesWithRoadmap.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {rolesWithRoadmap.map((r) => (
            <Link
              key={r.id}
              to={`/roadmap?role=${r.id}`}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                r.id === activeRoleId
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-300 hover:border-indigo-400 hover:text-indigo-600'
              }`}
            >
              {r.title}
            </Link>
          ))}
        </div>
      )}

      {stages.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
          <p className="text-slate-500 text-sm">
            No roadmap has been defined for <strong>{roleTitle}</strong> yet.
          </p>
        </div>
      )}

      <div className="space-y-8">
        {stages.map((stage, idx) => {
           // Parse skills for UI display
           let stageSkills = [];
           try {
             stageSkills = typeof stage.skills_learned === 'string' 
               ? JSON.parse(stage.skills_learned) 
               : (stage.skills_learned || []);
           } catch(e) {}
           
           const allTasksCompleted = stage.tasks.every(t => progress[t.id]?.completed);

           return (
            <div key={idx} className="relative pl-8">
              <div className={`absolute left-0 top-0 bottom-0 w-px ${allTasksCompleted ? 'bg-emerald-300' : 'bg-indigo-200'}`} />
              <div className={`absolute left-[-4px] top-6 w-2.5 h-2.5 rounded-full border-2 border-white shadow ${allTasksCompleted ? 'bg-emerald-500' : 'bg-indigo-500'}`} />

              <div className={`bg-white p-6 rounded-xl shadow-sm border transition ${allTasksCompleted ? 'border-emerald-100 hover:border-emerald-300' : 'border-slate-100 hover:border-indigo-200'}`}>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-lg text-slate-800">{stage.stage} Stage</h3>
                  <span className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-100 px-2.5 py-0.5 rounded-full font-semibold mb-1 lg:mb-0 text-center inline-block">
                    {stage.estimatedCompletion}
                  </span>
                </div>
                
                {stageSkills.length > 0 && (
                  <div className="text-xs text-slate-500 mb-5 flex flex-wrap items-center gap-1.5">
                    Skills learned here: 
                    {stageSkills.map(s => (
                       <span key={s} className={`px-2 py-0.5 rounded text-[10px] font-bold ${allTasksCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{s}</span>
                    ))}
                    {allTasksCompleted && <span className="text-emerald-600 ml-1 font-medium">(Added to profile!)</span>}
                  </div>
                )}

                <div className="space-y-3">
                  {stage.tasks.map((task) => {
                    const isDone = progress[task.id]?.completed;
                    const savedLink = progress[task.id]?.link;
                    const isProject = task.type === 'project';
                    const isInputActive = activeProjectInput.id === task.id;

                    return (
                      <div key={task.id} className="border border-slate-100 rounded-lg overflow-hidden">
                        <div
                          className={`flex items-center gap-3 p-3 transition ${!isProject ? 'hover:bg-slate-50 cursor-pointer group' : ''} ${isDone ? 'bg-slate-50/50' : ''}`}
                          onClick={() => !isProject && toggleNormalTask(task.id)}
                        >
                          {!isProject ? (
                              isDone 
                                ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                : <Circle className="w-5 h-5 text-slate-300 group-hover:text-indigo-400 shrink-0" />
                          ) : (
                              isDone 
                                ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                : <LinkIcon className="w-5 h-5 text-orange-400 shrink-0" />
                          )}
                          
                          <div className="flex-1">
                            <p className={`font-medium text-sm ${isDone ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                              {task.title}
                            </p>
                            <span className={`text-[10px] uppercase tracking-wider font-semibold ${isProject ? 'text-orange-500' : 'text-slate-400'}`}>
                              {task.type}
                            </span>
                          </div>

                          {/* Action Button for Project Tasks */}
                          {isProject && (
                             <button 
                                onClick={(e) => handleProjectClick(task.id, e)}
                                className={`text-xs px-3 py-1.5 rounded-md font-medium transition ${isDone ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}`}
                             >
                               {isDone ? <Undo2 className="w-3.5 h-3.5" /> : 'Submit URL'}
                             </button>
                          )}
                        </div>

                        {/* Submitted Link Display */}
                        {isDone && savedLink && (
                          <div className="px-11 pb-3 pt-0 text-sm text-slate-500">
                             <a href={savedLink} target="_blank" rel="noreferrer" className="text-indigo-500 hover:underline inline-flex items-center gap-1">
                               <LinkIcon className="w-3 h-3" /> {savedLink}
                             </a>
                          </div>
                        )}

                        {/* Project URL Input Form */}
                        {isInputActive && !isDone && (
                          <div className="px-11 pb-3 pt-1 flex gap-2">
                            <input 
                              type="url"
                              placeholder="https://github.com/your-repo"
                              className="flex-1 text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              value={activeProjectInput.link}
                              onChange={(e) => setActiveProjectInput({ ...activeProjectInput, link: e.target.value })}
                            />
                            <button 
                              onClick={() => submitProject(task.id)}
                              className="bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
           );
        })}
      </div>
    </div>
  );
}
