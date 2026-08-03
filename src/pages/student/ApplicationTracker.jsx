import { useAppData } from '../../context/AppDataContext';
import { Link } from 'react-router-dom';
import { Calendar, ExternalLink, MapPin, Building2, KanbanSquare, Bot } from 'lucide-react';

const CompanyAvatar = ({ name }) => {
  if (!name) return null;
  const colors = ['from-blue-500 to-cyan-500', 'from-indigo-500 to-purple-500', 'from-purple-500 to-pink-500', 'from-rose-500 to-orange-500', 'from-teal-500 to-emerald-500'];
  const index = name.charCodeAt(0) % colors.length;
  
  return (
    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[index]} flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0`}>
       {name.charAt(0).toUpperCase()}
    </div>
  )
};

export default function ApplicationTracker() {
  const { trackedApplications, opportunities, updateApplicationStatus } = useAppData();

  // Columns for the Kanban Board
  const columns = [
    { id: 'Applied', title: 'Applied', dot: 'bg-blue-500', border: 'border-blue-200', bg: 'bg-blue-50/50' },
    { id: 'Interview', title: 'Interviewing', dot: 'bg-amber-500', border: 'border-amber-200', bg: 'bg-amber-50/50' },
    { id: 'Accepted', title: 'Offers', dot: 'bg-emerald-500', border: 'border-emerald-200', bg: 'bg-emerald-50/50' },
    { id: 'Rejected', title: 'Rejected', dot: 'bg-rose-500', border: 'border-rose-200', bg: 'bg-rose-50/50' }
  ];

  // Helper to format date nicely
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-7xl mx-auto">
       <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
              Application Tracker <KanbanSquare className="w-6 h-6 text-indigo-500"/>
            </h2>
            <p className="text-slate-500 mt-2 text-lg">Manage your outbound pipeline and track interview progression.</p>
          </div>
       </div>

       {trackedApplications.length === 0 ? (
          <div className="py-20 text-center bg-white border border-slate-100 rounded-3xl shadow-sm">
             <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <KanbanSquare className="w-8 h-8 text-slate-300" />
             </div>
             <h3 className="text-lg font-bold text-slate-700">Your pipeline is empty</h3>
             <p className="text-slate-500 mt-1 max-w-md mx-auto">Apply to jobs from the Opportunity Connector. Your applications will automatically sync here.</p>
          </div>
       ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
             {columns.map(col => {
                const columnApps = trackedApplications.filter(app => app.status === col.id);
                
                return (
                  <div key={col.id} className={`bg-white rounded-3xl border ${col.border} shadow-sm overflow-hidden flex flex-col h-full min-h-[600px]`}>
                     <div className={`px-5 py-4 border-b ${col.border} ${col.bg} flex justify-between items-center`}>
                        <h3 className="font-bold text-slate-700 flex items-center gap-2 text-sm uppercase tracking-wider">
                           <div className={`w-2.5 h-2.5 rounded-full ${col.dot} shadow-sm`}></div>
                           {col.title}
                        </h3>
                        <span className="bg-white px-2 py-0.5 rounded-md text-xs font-bold text-slate-500 border border-slate-200 shadow-sm">{columnApps.length}</span>
                     </div>
                     
                     <div className="p-4 space-y-4 flex-1 bg-slate-50/30">
                        {columnApps.length === 0 ? (
                           <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl">
                              <span className="text-xs font-semibold text-slate-400">No applications</span>
                           </div>
                        ) : (
                           columnApps.map(app => {
                              // We cross-reference the local 'job' details saved in our DB
                              const job = opportunities.find(j => j.id === app.jobId) || app.job; 
                              if (!job) return null;

                              return (
                                 <div key={app.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group relative overflow-hidden">
                                    <div className="flex items-start gap-3 mb-4">
                                       <CompanyAvatar name={job.company || 'Unknown'} />
                                       <div className="flex-1 min-w-0">
                                          <h4 className="font-bold text-slate-800 text-sm truncate group-hover:text-indigo-600 transition-colors">{job.title}</h4>
                                          <p className="text-xs font-medium text-slate-500 truncate flex items-center gap-1 mt-0.5">
                                             <Building2 className="w-3 h-3" /> {job.company}
                                          </p>
                                       </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 mb-4 text-[11px] font-semibold text-slate-500">
                                       <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                          <MapPin className="w-3 h-3" /> {job.location || 'Remote'}
                                       </div>
                                       <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                          <Calendar className="w-3 h-3" /> {formatDate(app.date)}
                                       </div>
                                    </div>
                                    
                                    <div className="mb-4">
                                       <select 
                                          value={app.status}
                                          onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                                          className="w-full text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                                       >
                                          <option value="Applied">Moved to: Applied</option>
                                          <option value="Interview">Moved to: Interviewing</option>
                                          <option value="Accepted">Moved to: Offered</option>
                                          <option value="Rejected">Moved to: Rejected</option>
                                       </select>
                                    </div>

                                    {job.url ? (
                                       <a 
                                          href={job.url} 
                                          target="_blank" 
                                          rel="noreferrer"
                                          className="w-full flex items-center justify-center gap-1.5 py-2 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 rounded-xl text-xs font-bold transition-colors"
                                       >
                                          View Job Posting <ExternalLink className="w-3 h-3" />
                                       </a>
                                    ) : (
                                       <div className="w-full flex items-center justify-center py-2 bg-slate-50 text-slate-400 border border-slate-100 rounded-xl text-xs font-bold cursor-not-allowed">
                                          No External Link
                                       </div>
                                    )}

                                    {col.id === 'Interview' && (
                                       <Link 
                                          to="/mock-interview" 
                                          state={{ job }}
                                          className="w-full flex items-center justify-center gap-1.5 mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-200"
                                       >
                                          <Bot className="w-4 h-4" /> Practice Interview
                                       </Link>
                                    )}
                                 </div>
                              )
                           })
                        )}
                     </div>
                  </div>
                )
             })}
          </div>
       )}
    </div>
  )
}
