import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Link } from 'react-router-dom';
import { Briefcase, Target, TrendingUp, Award, ChevronRight, Star } from 'lucide-react';

const TECHNICAL_SKILLS = new Set([
  'Python', 'Java', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'R',
  'HTML', 'CSS', 'React', 'Angular', 'Vue.js', 'Next.js', 'Tailwind CSS', 'Bootstrap',
  'Node.js', 'Express.js', 'Django', 'Flask', 'FastAPI', 'Spring Boot',
  'Flutter', 'React Native',
  'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Firebase',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Linux', 'Git & GitHub', 'CI/CD',
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch',
  'Data Analysis', 'Pandas', 'NumPy'
]);

const DOMAIN_SKILLS = new Set(['Figma', 'Photoshop', 'Excel', 'Power BI', 'Tableau', 'Agile']);
const SOFT_SKILLS = new Set(['Communication', 'Leadership', 'Teamwork', 'Problem Solving']);

export default function StudentDashboard() {
  const { user } = useAuth();
  const { roles, studentProfile, trackedApplications } = useAppData();

  const skills = studentProfile?.skills || [];
  
  // Compute skill category averages based on level (Beginner=33, Intermediate=66, Advanced=100)
  const calculateCategoryScore = (categorySet) => {
    const categorySkills = skills.filter(s => categorySet.has(s.name));
    if (categorySkills.length === 0) return 0;
    
    const total = categorySkills.reduce((acc, curr) => {
       if (curr.level === 'Advanced') return acc + 100;
       if (curr.level === 'Intermediate') return acc + 66;
       return acc + 33;
    }, 0);
    // Average against the skills they have
    return Math.min(100, Math.round(total / categorySkills.length)); 
  };

  const techScore = calculateCategoryScore(TECHNICAL_SKILLS);
  const softScore = calculateCategoryScore(SOFT_SKILLS);
  const domainScore = calculateCategoryScore(DOMAIN_SKILLS);
  
  // Overall readiness based on top 3 roles match score
  const topRoles = [...roles].sort((a,b) => (b.matchScore || 0) - (a.matchScore || 0)).slice(0, 3);
  const overallReadiness = topRoles.length > 0 
    ? Math.round(topRoles.reduce((acc, curr) => acc + (curr.matchScore || 0), 0) / topRoles.length)
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Widget */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-2xl shadow-lg text-white flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
           <h2 className="text-3xl font-extrabold mb-2 text-white/95 tracking-tight">Welcome back, {user?.name}!</h2>
           <p className="text-blue-100 text-lg">Your personalized career intelligence overview is ready.</p>
        </div>
        <div className="flex items-center space-x-6 bg-white/10 px-6 py-4 rounded-xl backdrop-blur-sm border border-white/20">
           <div className="text-center">
              <div className="text-4xl font-black text-white">{overallReadiness}%</div>
              <div className="text-sm font-medium text-blue-200 mt-1 uppercase tracking-wider">Overall Readiness</div>
           </div>
           <Target className="w-12 h-12 text-blue-200 opacity-80" />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center space-x-4">
           <div className="bg-blue-50 p-3 rounded-lg"><Briefcase className="w-6 h-6 text-blue-600"/></div>
           <div><div className="text-2xl font-bold text-slate-800">{roles.length}</div><div className="text-xs text-slate-500 font-medium">Matched Roles</div></div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center space-x-4">
           <div className="bg-green-50 p-3 rounded-lg"><Star className="w-6 h-6 text-green-600"/></div>
           <div><div className="text-2xl font-bold text-slate-800">{skills.length}</div><div className="text-xs text-slate-500 font-medium">Known Skills</div></div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center space-x-4">
           <div className="bg-purple-50 p-3 rounded-lg"><TrendingUp className="w-6 h-6 text-purple-600"/></div>
           <div><div className="text-2xl font-bold text-slate-800">{Object.keys(studentProfile?.roadmap_progress || {}).length}</div><div className="text-xs text-slate-500 font-medium">Roadmap Tasks</div></div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center space-x-4">
           <div className="bg-orange-50 p-3 rounded-lg"><Award className="w-6 h-6 text-orange-600"/></div>
           <div><div className="text-2xl font-bold text-slate-800">{trackedApplications?.length || 0}</div><div className="text-xs text-slate-500 font-medium">Applications</div></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
         {/* Top Recommended Roles */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">Top Career Matches</h3>
              <Link to="/career-matches" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center">View All <ChevronRight className="w-4 h-4 ml-1"/></Link>
            </div>
            
            {topRoles.length === 0 ? (
               <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No career matches found yet. Keep learning to see updates!
               </div>
            ) : (
               <div className="space-y-4">
                 {topRoles.map(role => (
                    <div key={role.id} className="group flex justify-between items-center p-4 hover:bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-100 transition-all">
                       <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-base border-4 ${role.matchScore >= 80 ? 'border-green-100 text-green-600 bg-green-50' : role.matchScore >= 50 ? 'border-yellow-100 text-yellow-600 bg-yellow-50' : 'border-red-100 text-red-600 bg-red-50'}`}>
                             {role.matchScore}%
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{role.title}</div>
                            <div className="text-sm text-slate-500 flex items-center gap-2">
                               <span className="px-2 py-0.5 bg-slate-100 rounded text-xs">{role.category}</span>
                               <span className="hidden sm:inline text-slate-400">•</span>
                               <span className="hidden sm:inline">{role.avgSalary || 'Competitive'}</span>
                            </div>
                          </div>
                       </div>
                       <div>
                          <Link to={`/roadmap?role=${role.id}`} className="px-3 sm:px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white font-medium text-xs sm:text-sm rounded-lg transition-colors inline-block text-center">
                             View Roadmap
                          </Link>
                       </div>
                    </div>
                 ))}
               </div>
            )}
         </div>

         {/* Skill Summary */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Skill Analytics</h3>
            <div className="space-y-6">
               <div>
                 <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-slate-700">Technical Skills</span>
                    <span className="text-blue-600">{techScore}%</span>
                 </div>
                 <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${techScore}%` }}></div>
                 </div>
                 <p className="text-xs text-slate-400 mt-1">Core programming & tools</p>
               </div>
               
               <div>
                 <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-slate-700">Soft Skills</span>
                    <span className="text-purple-600">{softScore}%</span>
                 </div>
                 <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${softScore}%` }}></div>
                 </div>
                 <p className="text-xs text-slate-400 mt-1">Communication & teamwork</p>
               </div>
               
               <div>
                 <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-slate-700">Domain Knowledge</span>
                    <span className="text-teal-600">{domainScore}%</span>
                 </div>
                 <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${domainScore}%` }}></div>
                 </div>
                 <p className="text-xs text-slate-400 mt-1">Design & specialized tools</p>
               </div>
            </div>

            <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
               <h4 className="text-sm font-bold text-slate-700 mb-2">Recent Skills</h4>
               <div className="flex flex-wrap gap-2">
                  {skills.slice(-4).map((s, idx) => (
                     <span key={idx} className={`px-2 py-1 bg-white border border-slate-200 text-xs font-medium rounded shadow-sm ${s.level === 'Advanced' ? 'text-blue-600' : s.level === 'Intermediate' ? 'text-indigo-600' : 'text-slate-600'}`}>
                        {s.name}
                     </span>
                  ))}
                  {skills.length === 0 && <span className="text-xs text-slate-400">No skills added yet.</span>}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
