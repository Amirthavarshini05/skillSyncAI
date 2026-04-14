import { useAppData } from '../../context/AppDataContext';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function SkillProfile() {
  const { skills } = useAppData();
  
  const data = skills.map(s => ({
    subject: s.name,
    A: s.level === 'Advanced' ? 90 : s.level === 'Intermediate' ? 60 : 30,
    fullMark: 100,
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">AI Skill Profiling</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <h3 className="font-bold text-slate-800 mb-6">Competency Radar</h3>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Skills" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                </RadarChart>
             </ResponsiveContainer>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <h3 className="font-bold text-slate-800 mb-4">Skill Assessment</h3>
           <div className="space-y-4">
              {skills.map((skill, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                   <div>
                     <span className="font-medium text-slate-700">{skill.name}</span>
                     <span className="ml-3 text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500">{skill.type}</span>
                   </div>
                   <span className={`text-sm font-medium ${skill.level === 'Advanced' ? 'text-green-600' : skill.level === 'Intermediate' ? 'text-blue-600' : 'text-orange-600'}`}>{skill.level}</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
