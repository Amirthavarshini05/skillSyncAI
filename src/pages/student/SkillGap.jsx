import { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { AlertTriangle, TrendingUp, Target, ArrowRight, Zap, Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SkillGap() {
  const { skills, roles } = useAppData();
  const [expandedSkill, setExpandedSkill] = useState(null);
  
  if (!roles || roles.length === 0) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );

  // 1. Analyze frequency of required skills across all roles
  const skillAnalysis = new Map();
  roles.forEach(role => {
     if (role.requiredSkills) {
        role.requiredSkills.forEach(req => {
           const lowerReq = req.toLowerCase();
           if (!skillAnalysis.has(lowerReq)) {
              skillAnalysis.set(lowerReq, { name: req, count: 0, roles: [] });
           }
           const entry = skillAnalysis.get(lowerReq);
           entry.count += 1;
           entry.roles.push(role.title);
        });
     }
  });

  const userSkillNames = new Set(skills.map(s => s.name.toLowerCase()));
  
  // 2. Filter for only missing skills and sort by highest impact (frequency)
  const missingSkills = Array.from(skillAnalysis.values())
    .filter(skill => !userSkillNames.has(skill.name.toLowerCase()))
    .sort((a, b) => b.count - a.count);

  const totalRequired = skillAnalysis.size;
  const missingCount = missingSkills.length;
  const gapPercentage = totalRequired === 0 ? 0 : Math.round((missingCount / totalRequired) * 100);
  
  const highestImpactSkill = missingSkills.length > 0 ? missingSkills[0] : null;

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-6xl mx-auto">
       
       {/* Premium Header Banner */}
       <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 md:p-10 text-white shadow-2xl border border-slate-800">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/20 blur-[100px] rounded-full pointer-events-none -mr-40 -mt-40 mix-blend-screen"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-3">
                 <Target className="w-5 h-5 text-orange-400" />
                 <span className="text-sm font-bold tracking-widest uppercase text-orange-300">Strategic Gap Analysis</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">Skill Gap Intelligence</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                We've analyzed all the career paths you matched with. Instead of guessing what to learn next, here are the exact skills holding you back, ranked by their <strong className="text-white">hiring impact</strong>.
              </p>
            </div>
            
            <div className="flex flex-col gap-4 shrink-0 w-full md:w-auto">
               <div className="flex items-center gap-4 bg-slate-800/80 backdrop-blur-md p-5 rounded-2xl border border-slate-700/50">
                 <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                   <AlertTriangle className="w-6 h-6 text-orange-400" />
                 </div>
                 <div>
                   <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block mb-0.5">Global Deficit</span>
                   <div className="flex items-end gap-1">
                     <span className="text-3xl font-black text-white">{gapPercentage}</span>
                     <span className="text-lg text-orange-400 font-bold mb-1">%</span>
                   </div>
                 </div>
               </div>

               {highestImpactSkill && (
                  <div className="flex items-center gap-4 bg-orange-500/10 backdrop-blur-md p-5 rounded-2xl border border-orange-500/20">
                    <div className="w-14 h-14 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-orange-200/70 font-bold block mb-0.5">Highest Impact Skill</span>
                      <span className="text-xl font-black text-orange-400">{highestImpactSkill.name}</span>
                    </div>
                  </div>
               )}
            </div>
          </div>
       </div>

       {/* Detailed Breakdown */}
       <div className="bg-white rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-800">Ranked Skill Deficits</h3>
            <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{missingCount} Skills to Learn</span>
          </div>
          
          {missingCount === 0 ? (
            <div className="p-12 text-center">
               <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-10 h-10 text-emerald-500" />
               </div>
               <h3 className="text-xl font-bold text-slate-800 mb-2">You are 100% Ready!</h3>
               <p className="text-slate-500">You have zero skill gaps across all your matched career paths. Time to start applying!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
               {missingSkills.map((skill, idx) => {
                  const impactScore = Math.round((skill.count / roles.length) * 100);
                  const isExpanded = expandedSkill === skill.name;
                  
                  return (
                     <div key={skill.name} className="transition-colors hover:bg-slate-50">
                        <div 
                           className="p-6 md:px-8 cursor-pointer flex flex-col md:flex-row md:items-center gap-6"
                           onClick={() => setExpandedSkill(isExpanded ? null : skill.name)}
                        >
                           {/* Rank & Name */}
                           <div className="flex items-center gap-4 w-full md:w-1/3">
                              <span className={`text-lg font-black w-8 text-center ${idx < 3 ? 'text-orange-500' : 'text-slate-300'}`}>
                                 #{idx + 1}
                              </span>
                              <div>
                                 <h4 className="font-bold text-slate-800 text-lg">{skill.name}</h4>
                                 <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                                    Blocks {skill.count} Career Path{skill.count > 1 ? 's' : ''}
                                 </p>
                              </div>
                           </div>

                           {/* Impact Bar */}
                           <div className="flex-1">
                              <div className="flex justify-between text-xs font-bold mb-2">
                                 <span className="text-slate-500">Impact Score</span>
                                 <span className={impactScore > 50 ? 'text-orange-600' : 'text-slate-600'}>{impactScore}/100</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                 <div 
                                    className={`h-full rounded-full ${impactScore > 50 ? 'bg-orange-500' : 'bg-slate-400'}`} 
                                    style={{ width: `${impactScore}%` }}
                                 ></div>
                              </div>
                           </div>

                           {/* Actions */}
                           <div className="shrink-0 flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                              <span className="text-sm font-semibold text-indigo-600 hidden md:block">
                                 {isExpanded ? 'Hide Details' : 'View Impact'}
                              </span>
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                 {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </div>
                           </div>
                        </div>

                        {/* Expanded Content */}
                        {isExpanded && (
                           <div className="px-6 md:px-8 pb-6 pt-2 animate-fade-in">
                              <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
                                 <div className="absolute right-0 top-0 opacity-10">
                                    <Briefcase className="w-48 h-48 -mr-10 -mt-10" />
                                 </div>
                                 <h5 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-4">Unlocks the following roles:</h5>
                                 <div className="flex flex-wrap gap-2 relative z-10">
                                    {skill.roles.map((rTitle, i) => (
                                       <span key={i} className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm font-medium text-slate-200 flex items-center gap-2">
                                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> {rTitle}
                                       </span>
                                    ))}
                                 </div>
                                 
                                 <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
                                    <Link to={`/roadmap?role=${roles.find(r => r.title === skill.roles[0])?.id}`} className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors inline-flex items-center justify-center gap-2">
                                       <Target className="w-4 h-4" /> Start Learning on Roadmap
                                    </Link>
                                    <a href={`https://www.youtube.com/results?search_query=${skill.name}+crash+course`} target="_blank" rel="noreferrer" className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors inline-flex items-center justify-center gap-2">
                                       Find Free Resources
                                    </a>
                                 </div>
                              </div>
                           </div>
                        )}
                     </div>
                  )
               })}
            </div>
          )}
       </div>
       
       <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between shadow-sm">
          <div className="mb-6 sm:mb-0">
             <h4 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-2">
                <TrendingUp className="text-indigo-600" /> Need to close these gaps?
             </h4>
             <p className="text-slate-600">Follow your personalized roadmaps to learn the missing skills systematically.</p>
          </div>
          <Link to="/roadmap" className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold shadow-md shadow-indigo-200 transition-all hover:-translate-y-1 active:translate-y-0 flex items-center gap-2 text-lg">
             Go to Roadmaps <ArrowRight className="w-5 h-5" />
          </Link>
       </div>
    </div>
  );
}
