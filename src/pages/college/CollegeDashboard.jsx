import { useAuth } from '../../context/AuthContext';
import { Users, BookOpen, AlertTriangle } from 'lucide-react';

export default function CollegeDashboard() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">College Administration</h2>
           <p className="text-slate-500">Welcome back, {user?.name}. Placement metrics overview.</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <div className="flex items-center text-blue-600 mb-4"><Users className="w-5 h-5 mr-2" />Total Students</div>
             <p className="text-3xl font-bold text-slate-800">1,204</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <div className="flex items-center text-green-600 mb-4"><BookOpen className="w-5 h-5 mr-2" />Placement Readiness</div>
             <p className="text-3xl font-bold text-slate-800">68%</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100 bg-orange-50/30">
             <div className="flex items-center text-orange-600 mb-4"><AlertTriangle className="w-5 h-5 mr-2" />Critical Curriculum Gap</div>
             <p className="text-lg font-bold text-slate-800">Cloud Computing</p>
             <p className="text-sm text-slate-600">High industry demand vs low student mastery.</p>
          </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mt-8">
         <div className="px-6 py-4 border-b border-slate-100 font-bold text-slate-800">Department Readiness</div>
         <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Avg Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Top Skill</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
               <tr>
                 <td className="px-6 py-4 font-medium text-slate-900">Computer Science</td>
                 <td className="px-6 py-4 text-slate-600">76%</td>
                 <td className="px-6 py-4 text-slate-600">Data Structures</td>
               </tr>
               <tr>
                 <td className="px-6 py-4 font-medium text-slate-900">Information Technology</td>
                 <td className="px-6 py-4 text-slate-600">71%</td>
                 <td className="px-6 py-4 text-slate-600">Web Development</td>
               </tr>
            </tbody>
         </table>
      </div>
    </div>
  );
}
