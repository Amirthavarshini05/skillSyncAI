import { useAppData } from '../../context/AppDataContext';
import { AlertTriangle, CheckCircle2, TrendingUp, Target, ArrowRight } from 'lucide-react';

export default function SkillGap() {
  const { skills, roles } = useAppData();
  
  // Sort roles to pick the top match
  const sortedRoles = [...roles].sort((a, b) => b.matchScore - a.matchScore);
  const targetRole = sortedRoles[0];
  
  if (!targetRole) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );

  const mastered = [];
  const needsImprovement = [];
  const missing = [];

  targetRole.requiredSkills.forEach(reqSkill => {
    const reqLower = reqSkill.toLowerCase();
    
    // Find if user has a matching skill
    const userSkillObj = skills.find(s => {
      const sLower = s.name.toLowerCase();
      return sLower === reqLower || sLower.includes(reqLower) || reqLower.includes(sLower);
    });

    if (userSkillObj) {
      // If they have it, check the level
      if (userSkillObj.level === 'Beginner') {
        needsImprovement.push({ name: reqSkill, currentLevel: userSkillObj.level });
      } else {
        mastered.push({ name: reqSkill, currentLevel: userSkillObj.level });
      }
    } else {
      missing.push({ name: reqSkill, currentLevel: 'None' });
    }
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-6xl mx-auto">
       <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 md:p-10 text-white shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                 <Target className="w-6 h-6 text-indigo-400" />
                 <span className="text-sm font-bold tracking-widest uppercase text-indigo-300">Target Role Analysis</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">{targetRole.title}</h2>
              <p className="text-slate-300 max-w-xl text-lg">
                We've analyzed your profile against industry standards for this role. Here is where you stand and what you need to focus on.
              </p>
            </div>
            
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20">
               <div className="flex flex-col">
                 <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1">Match Score</span>
                 <div className="flex items-end gap-1">
                   <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-500">{targetRole.matchScore}</span>
                   <span className="text-lg text-emerald-400 font-bold mb-1">%</span>
                 </div>
               </div>
               <div className="w-16 h-16 rounded-full border-4 border-emerald-400/30 border-t-emerald-400 flex items-center justify-center relative">
                 <span className="absolute inset-0 rounded-full border border-emerald-400 animate-ping opacity-20"></span>
                 <CheckCircle2 className="w-8 h-8 text-emerald-400" />
               </div>
            </div>
          </div>
       </div>

       <div className="grid md:grid-cols-3 gap-6">
          {/* Mastered Skills */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 relative overflow-hidden group hover:shadow-md transition-all">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
             <div className="relative z-10">
               <h3 className="flex items-center text-xl font-bold text-slate-800 mb-6">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  Proficient
               </h3>
               {mastered.length === 0 ? (
                 <p className="text-slate-500 text-sm italic">No proficient skills found for this specific role yet.</p>
               ) : (
                 <ul className="space-y-3">
                    {mastered.map(s => (
                       <li key={s.name} className="flex justify-between items-center p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
                          <span className="font-semibold text-emerald-900">{s.name}</span>
                          <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md uppercase tracking-wide">{s.currentLevel}</span>
                       </li>
                    ))}
                 </ul>
               )}
             </div>
          </div>
          
          {/* Needs Improvement */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100 relative overflow-hidden group hover:shadow-md transition-all">
             <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
             <div className="relative z-10">
               <h3 className="flex items-center text-xl font-bold text-slate-800 mb-6">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                    <TrendingUp className="w-5 h-5 text-amber-600" />
                  </div>
                  Needs Improvement
               </h3>
               {needsImprovement.length === 0 ? (
                 <p className="text-slate-500 text-sm italic">No skills currently need improvement.</p>
               ) : (
                 <ul className="space-y-3">
                    {needsImprovement.map(s => (
                       <li key={s.name} className="flex flex-col p-3 bg-amber-50/50 rounded-xl border border-amber-100/50 gap-2">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-amber-900">{s.name}</span>
                            <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-md uppercase tracking-wide">{s.currentLevel}</span>
                          </div>
                          <div className="w-full bg-amber-200 rounded-full h-1.5 mt-1">
                            <div className="bg-amber-500 h-1.5 rounded-full w-1/3"></div>
                          </div>
                       </li>
                    ))}
                 </ul>
               )}
             </div>
          </div>

          {/* Missing Skills */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-100 relative overflow-hidden group hover:shadow-md transition-all">
             <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
             <div className="relative z-10">
               <h3 className="flex items-center text-xl font-bold text-slate-800 mb-6">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center mr-3">
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                  </div>
                  Missing Skills
               </h3>
               {missing.length === 0 ? (
                 <p className="text-slate-500 text-sm italic">You have all the required baseline skills!</p>
               ) : (
                 <ul className="space-y-3">
                    {missing.map(s => (
                       <li key={s.name} className="flex flex-col p-3 bg-rose-50/50 rounded-xl border border-rose-100/50 gap-3 group/item">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-rose-900">{s.name}</span>
                          </div>
                          <button className="flex items-center justify-center w-full text-xs font-bold bg-white border border-rose-200 text-rose-700 px-3 py-2 rounded-lg hover:bg-rose-600 hover:text-white transition-colors">
                            Add to Roadmap <ArrowRight className="w-3 h-3 ml-1" />
                          </button>
                       </li>
                    ))}
                 </ul>
               )}
             </div>
          </div>
       </div>
    </div>
  )
}
