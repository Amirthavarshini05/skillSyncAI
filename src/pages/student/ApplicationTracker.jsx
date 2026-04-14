import { useAppData } from '../../context/AppDataContext';

export default function ApplicationTracker() {
  const { trackedApplications, opportunities } = useAppData();

  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-slate-800">Application Tracker</h2>
       <p className="text-slate-600">Track your saved and applied opportunities.</p>

       <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date Applied</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {trackedApplications.map((app, idx) => {
                 const job = opportunities.find(j => j.id === app.jobId);
                 if (!job) return null;
                 return (
                   <tr key={idx} className="hover:bg-slate-50">
                     <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{job.company}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-slate-600">{job.title}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-slate-500">{new Date(app.date).toLocaleDateString()}</td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                         {app.status}
                       </span>
                     </td>
                   </tr>
                 )
              })}
              {trackedApplications.length === 0 && (
                <tr>
                   <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      No applications tracked yet. Start applying from the Opportunities tab!
                   </td>
                </tr>
              )}
            </tbody>
          </table>
       </div>
    </div>
  )
}
