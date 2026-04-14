import { useAuth } from '../../context/AuthContext';
import { Search, Filter, UserPlus } from 'lucide-react';

export default function RecruiterDashboard() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Recruiter Portal</h2>
           <p className="text-slate-500">Welcome, {user?.name}. Source pre-screened talent.</p>
        </div>
      </div>
      
      <div className="flex space-x-4 mb-6">
        <div className="flex-1 relative">
           <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
           <input type="text" placeholder="Search skills, roles, or locations..." className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg" />
        </div>
        <button className="flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"><Filter className="w-4 h-4 mr-2" /> Filters</button>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
         {[1,2,3,4].map(idx => (
           <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-slate-200 rounded-full mb-4 flex items-center justify-center font-bold text-slate-500">
                {idx}
              </div>
              <h3 className="font-bold text-slate-800">Candidate #{8930 + idx}</h3>
              <p className="text-sm text-slate-500">Frontend Developer</p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                 <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">React</span>
                 <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">JavaScript</span>
              </div>
              <div className="mt-6 w-full flex justify-between items-center pt-4 border-t border-slate-100">
                 <span className="text-sm font-bold text-green-600">92% Match</span>
                 <button className="text-slate-500 hover:text-blue-600"><UserPlus className="w-5 h-5" /></button>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}
