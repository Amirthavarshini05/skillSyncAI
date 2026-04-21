import { useAppData } from '../../context/AppDataContext';
import { AlertTriangle, TrendingUp, Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SkillGap() {
  const { skills, roles } = useAppData();
  
  if (!roles || roles.length === 0) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );

  // Aggregate ALL missing skills across all matched careers
  const allRequiredSkills = new Set();
  roles.forEach(role => {
     if (role.requiredSkills) {
        role.requiredSkills.forEach(req => allRequiredSkills.add(req));
     }
  });

  const userSkillNames = new Set(skills.map(s => s.name.toLowerCase()));
  
  const rawMissing = Array.from(allRequiredSkills).filter(reqSkill => {
      const r = reqSkill.toLowerCase();
      return !userSkillNames.has(r);
  });

  // Calculate overall gap percentage
  const totalRequired = allRequiredSkills.size;
  const missingCount = rawMissing.length;
  const gapPercentage = totalRequired === 0 ? 0 : Math.round((missingCount / totalRequired) * 100);

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-6xl mx-auto">
       <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 md:p-10 text-white shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                 <Target className="w-6 h-6 text-indigo-400" />
                 <span className="text-sm font-bold tracking-widest uppercase text-indigo-300">Global Skill Gap Analysis</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Your Missing Skills</h2>
              <p className="text-slate-300 max-w-xl text-lg">
                We aggregated the requirements across all your matched careers. Here is exactly what is missing from your profile to hit 100% readiness across the board.
              </p>
            </div>
            
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20">
               <div className="flex flex-col">
                 <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1">Overall Gap</span>
                 <div className="flex items-end gap-1">
                   <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">{gapPercentage}</span>
                   <span className="text-lg text-orange-400 font-bold mb-1">%</span>
                 </div>
               </div>
               <div className="w-16 h-16 rounded-full border-4 border-orange-400/30 border-t-orange-400 flex items-center justify-center relative">
                 <span className="absolute inset-0 rounded-full border border-orange-400 animate-ping opacity-20"></span>
                 <AlertTriangle className="w-8 h-8 text-orange-400" />
               </div>
            </div>
          </div>
       </div>

       <div className="bg-white p-8 rounded-3xl shadow-sm border border-orange-100 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-150"></div>
          <div className="relative z-10">
            <h3 className="flex items-center text-2xl font-bold text-slate-800 mb-8">
               <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mr-4">
                 <AlertTriangle className="w-6 h-6 text-orange-600" />
               </div>
               Critical Gaps to Fill
            </h3>
            
            {rawMissing.length === 0 ? (
              <p className="text-slate-500 text-lg italic text-center py-12">Congratulations! You have zero skill gaps across all matched careers. You are fully ready!</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                 {rawMissing.map(skill => (
                    <div key={skill} className="flex flex-col p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50 hover:border-orange-300 transition-colors">
                       <span className="font-bold text-orange-900 text-lg mb-1">{skill}</span>
                       <span className="text-xs font-bold text-orange-600/70 uppercase tracking-wide">Missing Requirement</span>
                    </div>
                 ))}
              </div>
            )}
          </div>
       </div>
       
       <div className="mt-8 bg-indigo-50 border border-indigo-100 p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between shadow-sm">
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
