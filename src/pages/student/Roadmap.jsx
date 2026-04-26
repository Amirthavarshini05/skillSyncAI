import { useState, useEffect } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Circle, ArrowLeft, Link as LinkIcon, Send, Undo2, Lock, Unlock, Sparkles, Trophy } from 'lucide-react';

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

  const toggleNormalTask = (id, isLocked) => {
    if (isLocked) return;
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

  const handleProjectClick = (id, e, isLocked) => {
    e.stopPropagation(); // prevent parent div click
    if (isLocked) return;
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
    <div className="space-y-8 max-w-5xl pb-20 animate-fade-in mx-auto">
      <Link
        to="/career-matches"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Career Matches
      </Link>

      <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-800 relative overflow-hidden text-white">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500 opacity-20 blur-3xl rounded-full mix-blend-screen pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div>
             <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
               Interactive Skill Tree <Sparkles className="w-6 h-6 text-indigo-400"/>
             </h2>
             <p className="text-slate-400 mt-2 text-lg">
               Path: <strong className="text-white">{roleTitle}</strong>
             </p>
           </div>
           
           {rolesWithRoadmap.length > 1 && (
             <div className="flex bg-slate-800/50 p-1.5 rounded-xl border border-slate-700/50 backdrop-blur-md">
               <select 
                  className="bg-transparent text-white font-bold text-sm px-4 py-2 appearance-none outline-none cursor-pointer"
                  value={activeRoleId}
                  onChange={(e) => window.location.href = `/roadmap?role=${e.target.value}`}
               >
                 {rolesWithRoadmap.map(r => <option key={r.id} value={r.id} className="bg-slate-900">{r.title}</option>)}
               </select>
             </div>
           )}
        </div>
      </div>

      {stages.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
          <p className="text-slate-500">No skill tree defined for this path yet.</p>
        </div>
      ) : (
        <div className="relative pt-6 pb-12">
          {/* Main vertical tree line */}
          <div className="absolute left-8 top-0 bottom-0 w-1.5 bg-slate-100 rounded-full"></div>

          <div className="space-y-12">
            {stages.map((stage, idx) => {
               // Determine if node is locked (previous stage must be fully completed)
               let isLocked = false;
               if (idx > 0) {
                  const prevStage = stages[idx-1];
                  const prevCompleted = prevStage.tasks.every(t => progress[t.id]?.completed);
                  if (!prevCompleted) isLocked = true;
               }

               let stageSkills = [];
               try {
                 stageSkills = typeof stage.skills_learned === 'string' ? JSON.parse(stage.skills_learned) : (stage.skills_learned || []);
               } catch(e) {}
               
               const allTasksCompleted = stage.tasks.every(t => progress[t.id]?.completed);
               
               // Visual styling states
               const nodeColor = allTasksCompleted ? 'bg-emerald-500' : isLocked ? 'bg-slate-200' : 'bg-indigo-500';
               const borderColor = allTasksCompleted ? 'border-emerald-200' : isLocked ? 'border-slate-200' : 'border-indigo-300';
               const cardBg = allTasksCompleted ? 'bg-white' : isLocked ? 'bg-slate-50/50' : 'bg-white';
               const glow = allTasksCompleted ? 'shadow-[0_0_15px_rgba(16,185,129,0.3)]' : (!isLocked ? 'shadow-[0_0_20px_rgba(99,102,241,0.2)] border-indigo-200' : 'shadow-none border-slate-100');

               return (
                <div key={idx} className={`relative pl-24 group transition-all duration-500 ${isLocked ? 'opacity-70 grayscale-[0.3]' : 'opacity-100'}`}>
                  {/* Tree Node Point */}
                  <div className={`absolute left-0 top-8 flex items-center justify-center`}>
                     {/* Connecting line to the card */}
                     <div className={`absolute left-[36px] top-[14px] w-12 h-1 bg-slate-200 ${allTasksCompleted ? 'bg-emerald-300' : !isLocked ? 'bg-indigo-200' : ''} transition-colors`}></div>
                     
                     {/* Outer pulse if active */}
                     {!isLocked && !allTasksCompleted && <div className="absolute w-12 h-12 bg-indigo-500/20 rounded-full animate-ping ml-[9px] mt-[1px]"></div>}
                     
                     {/* The Node */}
                     <div className={`relative z-10 w-16 h-16 rounded-2xl ml-[1.5px] border-4 ${borderColor} ${nodeColor} flex items-center justify-center text-white font-black shadow-lg transition-colors`}>
                        {allTasksCompleted ? <Trophy className="w-7 h-7" /> : isLocked ? <Lock className="w-6 h-6 text-slate-400" /> : <Unlock className="w-6 h-6" />}
                     </div>
                  </div>

                  {/* Stage Card */}
                  <div className={`p-8 rounded-3xl border-2 ${glow} ${cardBg} transition-all`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                      <h3 className={`font-black text-2xl tracking-tight ${isLocked ? 'text-slate-400' : 'text-slate-800'}`}>{stage.stage} Stage</h3>
                      {isLocked ? (
                         <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-bold uppercase tracking-wider mt-2 sm:mt-0 inline-flex items-center gap-1"><Lock className="w-3 h-3"/> Locked</span>
                      ) : (
                         <span className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-bold uppercase tracking-wider mt-2 sm:mt-0 inline-flex items-center gap-1 border border-indigo-100">
                            {stage.estimatedCompletion}
                         </span>
                      )}
                    </div>
                    
                    {stageSkills.length > 0 && (
                      <div className="text-sm font-semibold text-slate-400 mb-6 flex flex-wrap items-center gap-2">
                        Unlocks skills: 
                        {stageSkills.map(s => (
                           <span key={s} className={`px-2.5 py-1 rounded-md text-xs font-bold border ${allTasksCompleted ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm' : isLocked ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                             {s}
                           </span>
                        ))}
                        {allTasksCompleted && <span className="text-emerald-500 ml-1 font-bold animate-pulse inline-flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Saved to AI Profile!</span>}
                      </div>
                    )}

                    <div className="space-y-3 relative">
                      {isLocked && <div className="absolute inset-0 z-10 cursor-not-allowed"></div>}
                      {stage.tasks.map((task) => {
                        const isDone = progress[task.id]?.completed;
                        const savedLink = progress[task.id]?.link;
                        const isProject = task.type === 'project';
                        const isInputActive = activeProjectInput.id === task.id;

                        return (
                          <div key={task.id} className={`border-2 rounded-xl overflow-hidden transition-all duration-300 ${isDone ? 'border-emerald-100 bg-emerald-50/30' : isLocked ? 'border-slate-100 bg-slate-50/50' : 'border-slate-100 bg-white hover:border-indigo-100'}`}>
                            <div
                              className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 ${!isProject && !isLocked ? 'cursor-pointer group' : ''}`}
                              onClick={() => !isProject && toggleNormalTask(task.id, isLocked)}
                            >
                              <div className="flex items-center gap-4 flex-1">
                                 <button className={`shrink-0 focus:outline-none transition-transform ${!isLocked && !isDone && !isProject ? 'group-hover:scale-110' : ''}`}>
                                    {!isProject ? (
                                        isDone 
                                          ? <CheckCircle2 className="w-6 h-6 text-emerald-500 drop-shadow-sm" />
                                          : <Circle className={`w-6 h-6 ${isLocked ? 'text-slate-200' : 'text-slate-300 group-hover:text-indigo-400'}`} />
                                    ) : (
                                        isDone 
                                          ? <CheckCircle2 className="w-6 h-6 text-emerald-500 drop-shadow-sm" />
                                          : <LinkIcon className={`w-6 h-6 ${isLocked ? 'text-slate-200' : 'text-orange-400'}`} />
                                    )}
                                 </button>
                                 
                                 <div>
                                   <p className={`font-bold text-sm sm:text-base ${isDone ? 'text-slate-500 line-through' : isLocked ? 'text-slate-400' : 'text-slate-700'}`}>
                                     {task.title}
                                   </p>
                                   <span className={`text-[10px] uppercase tracking-widest font-black ${isLocked ? 'text-slate-300' : isProject ? 'text-orange-500' : 'text-slate-400'}`}>
                                     {task.type}
                                   </span>
                                 </div>
                              </div>

                              {/* Action Button for Project Tasks */}
                              {isProject && !isLocked && (
                                 <button 
                                    onClick={(e) => handleProjectClick(task.id, e, isLocked)}
                                    className={`shrink-0 w-full sm:w-auto text-xs px-4 py-2 rounded-lg font-bold shadow-sm transition-all active:scale-95 ${isDone ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' : 'bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-200'}`}
                                 >
                                   {isDone ? <span className="flex items-center justify-center gap-2"><Undo2 className="w-3.5 h-3.5" /> Undo URL</span> : 'Submit Project URL'}
                                 </button>
                              )}
                            </div>

                            {/* Submitted Link Display */}
                            {isDone && savedLink && (
                              <div className="px-4 pb-4 pt-0 sm:pl-14">
                                 <a href={savedLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-indigo-600 font-medium hover:border-indigo-300 hover:bg-indigo-50 transition-colors shadow-sm">
                                   <LinkIcon className="w-3.5 h-3.5" /> {savedLink}
                                 </a>
                              </div>
                            )}

                            {/* Project URL Input Form */}
                            {isInputActive && !isDone && !isLocked && (
                              <div className="px-4 pb-4 pt-2 sm:pl-14 flex flex-col sm:flex-row gap-2">
                                <input 
                                  type="url"
                                  placeholder="Paste your GitHub repository or live URL here..."
                                  className="flex-1 text-sm font-medium px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-inner"
                                  value={activeProjectInput.link}
                                  onChange={(e) => setActiveProjectInput({ ...activeProjectInput, link: e.target.value })}
                                />
                                <button 
                                  onClick={() => submitProject(task.id)}
                                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 font-bold shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-transform active:scale-95"
                                >
                                  Submit <Send className="w-4 h-4" />
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
      )}
    </div>
  );
}
