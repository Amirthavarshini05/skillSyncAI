import { useAppData } from '../../context/AppDataContext';
import { Link } from 'react-router-dom';

export default function CareerMatches() {
  const { roles } = useAppData();

  // Helper to color code the match score
  const getScoreColor = (score) => {
    if (score >= 90) return 'from-emerald-400 to-green-500 text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 75) return 'from-blue-400 to-indigo-500 text-blue-700 bg-blue-50 border-blue-200';
    return 'from-amber-400 to-orange-500 text-amber-700 bg-amber-50 border-amber-200';
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-900 p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-indigo-500 opacity-20 blur-2xl pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-white mb-3">Career Match Recommendations</h2>
          <p className="text-indigo-100 max-w-2xl text-lg font-light leading-relaxed">
            Based on your skills, preferences, and market trends, our AI has curated these top roles that perfectly align with your unique profile.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {roles.map((role, idx) => {
          const scoreStyle = getScoreColor(role.matchScore);
          
          return (
            <div 
              key={role.id} 
              className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col overflow-hidden hover:-translate-y-1"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
               {/* Top highlight bar */}
               <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
               
               <div className="p-6 md:p-8 flex-1 flex flex-col">
                 <div className="flex justify-between items-start mb-6">
                    <div>
                       <div className="flex items-center gap-3 mb-2">
                         <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 tracking-wide uppercase">
                           {role.category}
                         </span>
                         {role.matchScore >= 90 && (
                           <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 tracking-wide uppercase shadow-sm">
                             Top Match
                           </span>
                         )}
                       </div>
                       <h3 className="text-2xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors duration-300">{role.title}</h3>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center font-black text-xl shadow-inner ${scoreStyle.split(' ').slice(2).join(' ')}`}>
                        {role.matchScore}
                      </div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 mt-1 tracking-wider">Score</span>
                    </div>
                 </div>
                 
                 <div className="mb-6 flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-sm text-slate-600 leading-relaxed">
                      <span className="font-semibold text-slate-700 block mb-1">Why it matches you:</span> 
                      {role.whyMatches}
                    </p>
                 </div>

                 <div className="mb-6">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Key Skills Needed</span>
                    <div className="flex flex-wrap gap-2">
                       {role.requiredSkills.map(skill => (
                          <span key={skill} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs rounded-lg font-medium shadow-sm group-hover:border-indigo-100 group-hover:bg-indigo-50/50 transition-colors">
                            {skill}
                          </span>
                       ))}
                    </div>
                 </div>
                 
                 <div className="mt-auto grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                      <span className="block text-xs font-semibold text-slate-400 uppercase mb-1">Market Demand</span>
                      <strong className="text-slate-800 font-bold">{role.demandLevel}</strong>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                      <span className="block text-xs font-semibold text-slate-400 uppercase mb-1">Avg Salary</span>
                      <strong className="text-slate-800 font-bold">{role.avgSalary}</strong>
                    </div>
                 </div>

                 <Link to={`/student/roadmap`} className="mt-6 w-full relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold text-white rounded-xl bg-slate-900 group/btn hover:bg-indigo-600 transition-colors duration-300">
                    <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover/btn:w-56 group-hover/btn:h-56 opacity-10"></span>
                    <span className="relative flex items-center gap-2">
                      View Learning Roadmap
                      <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                 </Link>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
