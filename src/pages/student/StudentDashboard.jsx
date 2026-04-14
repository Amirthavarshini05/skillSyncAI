import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { roles } = useAppData();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Welcome back, {user?.name}!</h2>
           <p className="text-slate-500">Here's your career intelligence overview.</p>
        </div>
        <div className="text-right">
           <div className="text-3xl font-bold text-blue-600">82%</div>
           <div className="text-sm text-slate-500">Overall Readiness</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
         {/* Top Recommended Roles */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 col-span-2">
            <h3 className="font-bold text-slate-800 mb-4">Top Career Matches</h3>
            <div className="space-y-4">
              {roles.map(role => (
                 <div key={role.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition">
                    <div>
                      <div className="font-medium text-slate-800">{role.title}</div>
                      <div className="text-sm text-slate-500">{role.category}</div>
                    </div>
                    <div className="flex items-center space-x-4">
                       <span className="text-sm font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">{role.matchScore}% Match</span>
                       <button className="text-blue-600 text-sm hover:underline">View Roadmap</button>
                    </div>
                 </div>
              ))}
            </div>
         </div>

         {/* Skill Summary */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">Skill Summary</h3>
            <div className="space-y-3">
               <div>
                 <div className="flex justify-between text-sm mb-1"><span>Technical</span><span>Advanced</span></div>
                 <div className="h-2 bg-slate-100 rounded overflow-hidden"><div className="w-[85%] bg-blue-500"></div></div>
               </div>
               <div>
                 <div className="flex justify-between text-sm mb-1"><span>Soft Skills</span><span>Intermediate</span></div>
                 <div className="h-2 bg-slate-100 rounded overflow-hidden"><div className="w-[60%] bg-purple-500"></div></div>
               </div>
               <div>
                 <div className="flex justify-between text-sm mb-1"><span>Domain</span><span>Beginner</span></div>
                 <div className="h-2 bg-slate-100 rounded overflow-hidden"><div className="w-[30%] bg-teal-500"></div></div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
