import { useAppData } from '../../context/AppDataContext';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Sparkles, Brain, Code2, Database, BookOpen, PlayCircle, Star, ShieldCheck, X, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function SkillProfile() {
  const { skills } = useAppData();
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [certId, setCertId] = useState('');
  const [verifyStatus, setVerifyStatus] = useState('idle'); // idle, verifying, success
  
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
           <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><Code2 className="w-5 h-5 text-indigo-500"/> Verified Skill Inventory</h3>
              <button 
                onClick={() => setShowVerifyModal(true)}
                className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors flex items-center gap-1"
              >
                 <ShieldCheck className="w-3.5 h-3.5" /> Verify Cert
              </button>
           </div>
           
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

      {/* AI Proficiency-Based Recommendations */}
      {skills.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -mr-20 -mt-20"></div>
           
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-indigo-500/30 rounded-xl">
                    <Star className="w-6 h-6 text-indigo-300" />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">AI Proficiency Recommendations</h3>
                    <p className="text-sm text-indigo-200">Curated advanced courses based on your existing strengths, beyond just high-demand roles.</p>
                 </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                 {skills.filter(s => s.level === 'Advanced' || s.level === 'Intermediate').slice(0, 3).map((skill, idx) => (
                    <div key={idx} className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800 transition-colors group">
                       <div className="flex justify-between items-start mb-4">
                          <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                             <BookOpen className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-md">
                             Advanced
                          </span>
                       </div>
                       <h4 className="font-bold text-white mb-2 leading-tight group-hover:text-indigo-300 transition-colors">
                          Mastering {skill.name} Architecture
                       </h4>
                       <p className="text-xs text-slate-400 mb-4 line-clamp-2">
                          Take your {skill.name} skills to the expert level with advanced patterns and performance optimization.
                       </p>
                       <div className="pt-4 border-t border-slate-700/50 flex justify-between items-center">
                          <span className="text-xs font-semibold text-slate-300">4 Weeks • Self-paced</span>
                          <button className="text-indigo-400 hover:text-indigo-300 transition-colors">
                             <PlayCircle className="w-5 h-5" />
                          </button>
                       </div>
                    </div>
                 ))}
                 
                 {skills.filter(s => s.level === 'Advanced' || s.level === 'Intermediate').length === 0 && (
                    <div className="col-span-3 text-center py-8 text-slate-400 border border-dashed border-slate-700 rounded-2xl">
                       Keep building your skills to unlock advanced AI recommendations!
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Certificate Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                 <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-indigo-600" /> Verify Certificate
                 </h3>
                 <button onClick={() => setShowVerifyModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                 </button>
              </div>
              
              <div className="p-6">
                 {verifyStatus === 'success' ? (
                    <div className="text-center py-6">
                       <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle2 className="w-8 h-8 text-green-600" />
                       </div>
                       <h4 className="font-bold text-xl text-slate-800 mb-2">Verification Successful</h4>
                       <p className="text-slate-500 text-sm mb-6">The certificate has been validated and the associated skills have been added to your profile.</p>
                       <button 
                          onClick={() => {
                             setShowVerifyModal(false);
                             setVerifyStatus('idle');
                             setCertId('');
                          }}
                          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-xl transition-colors"
                       >
                          Close
                       </button>
                    </div>
                 ) : (
                    <>
                       <p className="text-sm text-slate-500 mb-6">
                          Enter your credential ID from Coursera, Udemy, or other partnered platforms to instantly verify your skills.
                       </p>
                       <div className="space-y-4">
                          <div>
                             <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Credential ID</label>
                             <input 
                                type="text" 
                                value={certId}
                                onChange={(e) => setCertId(e.target.value)}
                                placeholder="e.g. UC-1234-5678-90AB"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                             />
                          </div>
                          <button 
                             disabled={!certId || verifyStatus === 'verifying'}
                             onClick={() => {
                                setVerifyStatus('verifying');
                                setTimeout(() => setVerifyStatus('success'), 1500);
                             }}
                             className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 rounded-xl transition-colors flex justify-center items-center gap-2"
                          >
                             {verifyStatus === 'verifying' ? (
                                <>
                                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                   Verifying...
                                </>
                             ) : 'Verify Credential'}
                          </button>
                       </div>
                    </>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
