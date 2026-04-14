import { useAppData } from '../../context/AppDataContext';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function SkillGap() {
  const { skills, roles } = useAppData();
  const targetRole = roles[0];
  
  const userSkillNames = skills.map(s => s.name.toLowerCase());
  
  const matchedSkills = targetRole.requiredSkills.filter(s => userSkillNames.includes(s.toLowerCase()));
  const missingSkills = targetRole.requiredSkills.filter(s => !userSkillNames.includes(s.toLowerCase()));

  return (
    <div className="space-y-6 max-w-5xl">
       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Skill Gap Analysis</h2>
            <p className="text-slate-600">Target Role: <strong className="text-blue-600">{targetRole.title}</strong></p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
             <div className="text-2xl font-bold text-blue-700 mr-3">{targetRole.matchScore}%</div>
             <div className="text-sm text-blue-600 font-medium">Readiness Score</div>
          </div>
       </div>

       <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100">
             <h3 className="flex items-center text-lg font-bold text-slate-800 mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                Mastered Skills
             </h3>
             <ul className="space-y-3">
                {matchedSkills.map(s => (
                   <li key={s} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="font-medium text-slate-700">{s}</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Aligned</span>
                   </li>
                ))}
             </ul>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
             <h3 className="flex items-center text-lg font-bold text-slate-800 mb-4">
                <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
                Missing / Priority Skills
             </h3>
             <ul className="space-y-3">
                {missingSkills.map(s => (
                   <li key={s} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                      <span className="font-medium text-red-800">{s}</span>
                      <button className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">Add to Roadmap</button>
                   </li>
                ))}
             </ul>
          </div>
       </div>
    </div>
  )
}
