import { useAppData } from '../../context/AppDataContext';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Sparkles, Brain, Code2, Database } from 'lucide-react';

export default function SkillProfile() {
  const { skills } = useAppData();
  
  const getSkillScore = (level) => {
    if (level === 'Advanced') return 90;
    if (level === 'Intermediate') return 60;
    return 30; // Beginner
  };

  const radarData = [
    { subject: 'Frontend', tags: ['HTML', 'CSS', 'React', 'Angular', 'Vue.js', 'Next.js', 'Tailwind CSS', 'Bootstrap'] },
    { subject: 'Backend & Mobile', tags: ['Node.js', 'Express.js', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'PHP', 'Ruby', 'Java', 'C#', 'C++', 'C', 'Go', 'Rust', 'Flutter', 'React Native', 'Swift', 'Kotlin'] },
    { subject: 'Data & DBs', tags: ['Python', 'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Data Analysis', 'Pandas', 'NumPy', 'R'] },
    { subject: 'Cloud & DevOps', tags: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Linux', 'Git & GitHub', 'CI/CD'] },
    { subject: 'Soft Skills', tags: ['Communication', 'Leadership', 'Teamwork', 'Problem Solving'] },
    { subject: 'Design & Tools', tags: ['Figma', 'Photoshop', 'Excel', 'Power BI', 'Tableau', 'Agile'] },
  ].map(cat => {
    const matchedSkills = skills.filter(s => cat.tags.includes(s.name));
    let score = 10; // minimum outline to keep the shape visible
    if (matchedSkills.length > 0) {
       const maxScore = Math.max(...matchedSkills.map(s => getSkillScore(s.level)));
       score = Math.min(100, maxScore + (matchedSkills.length - 1) * 8); // Add slight bonus for breadth
    }
    return { subject: cat.subject, A: score, fullMark: 100 };
  });

  // Calculate top strength
  const topStrength = [...radarData].sort((a,b) => b.A - a.A)[0];
  const aiSummary = topStrength.A > 10 
    ? `Your AI-mapped skill graph indicates your strongest competency is in ${topStrength.subject}. Continuing to build out your secondary skills will drastically increase your match score for full-stack and hybrid roles.`
    : `Your skill graph is currently empty. Start completing Roadmap tasks or upload a resume to map your competencies!`;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-slate-800">AI Skill Profiling</h2>
         <div className="flex items-center space-x-2 text-sm text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full font-medium border border-indigo-100">
           <Brain className="w-4 h-4"/> <span>{skills.length} Validated Skills</span>
         </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Radar Chart Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-3">
           <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><Sparkles className="w-5 h-5 text-blue-500"/> Competency Radar</h3>
           </div>
           <p className="text-sm text-slate-500 mb-6">A multi-dimensional view of your technical and professional capabilities.</p>
           
           <div className="h-80 w-full bg-slate-50/50 rounded-xl border border-slate-50 flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Tooltip 
                     formatter={(value) => [`${value}% Mastery`, 'Competency']}
                     contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Radar name="Competency" dataKey="A" stroke="#4f46e5" strokeWidth={2} fill="#6366f1" fillOpacity={0.4} />
                </RadarChart>
             </ResponsiveContainer>
           </div>
           
           <div className="mt-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h4 className="text-sm font-bold text-blue-800 mb-1">AI Insights</h4>
              <p className="text-sm text-blue-700 leading-relaxed">{aiSummary}</p>
           </div>
        </div>

        {/* List of Skills */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2 flex flex-col">
           <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Code2 className="w-5 h-5 text-indigo-500"/> Verified Skill Inventory</h3>
           
           {skills.length === 0 ? (
             <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
                <Database className="w-12 h-12 mb-3 text-slate-300"/>
                <p>No skills detected yet.</p>
                <p className="text-xs mt-1">Upload a resume to map your competencies.</p>
             </div>
           ) : (
             <div className="space-y-3 overflow-y-auto pr-2" style={{ maxHeight: '420px' }}>
                {skills.map((skill, i) => (
                  <div key={i} className="group flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors">
                     <div>
                       <div className="font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">{skill.name}</div>
                       <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mt-0.5">{skill.type}</div>
                     </div>
                     <div className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                         skill.level === 'Advanced' ? 'bg-green-50 text-green-700 border-green-200' : 
                         skill.level === 'Intermediate' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                         'bg-orange-50 text-orange-700 border-orange-200'
                     }`}>
                       {skill.level}
                     </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
