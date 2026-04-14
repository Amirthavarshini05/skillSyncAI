import { useAppData } from '../../context/AppDataContext';
import { Bookmark, MapPin, Briefcase } from 'lucide-react';

export default function Opportunities() {
  const { opportunities, applyForJob, trackedApplications } = useAppData();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Opportunity Connector</h2>
      <p className="text-slate-600">Matched jobs and internships based on your skill graph.</p>

      <div className="grid lg:grid-cols-2 gap-6">
         {opportunities.map(job => {
            const hasApplied = trackedApplications.some(app => app.jobId === job.id);
            return (
              <div key={job.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition">
                 <div className="flex justify-between items-start mb-4">
                    <div>
                       <h3 className="font-bold text-lg text-slate-800">{job.title}</h3>
                       <p className="text-slate-600">{job.company}</p>
                    </div>
                    <button className="text-slate-400 hover:text-blue-600"><Bookmark className="w-5 h-5" /></button>
                 </div>
                 
                 <div className="flex space-x-4 mb-4 text-sm text-slate-500">
                    <div className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {job.location}</div>
                    <div className="flex items-center"><Briefcase className="w-4 h-4 mr-1" /> {job.type}</div>
                 </div>

                 <div className="flex flex-wrap gap-2 mb-6">
                    {job.requiredSkills.map(s => <span key={s} className="px-2 py-1 bg-slate-50 text-slate-600 text-xs rounded border border-slate-200">{s}</span>)}
                 </div>

                 <div className="mt-auto flex items-center justify-between">
                    <span className="font-medium text-green-600 text-sm">{job.matchScore}% skill match</span>
                    <button 
                      onClick={() => applyForJob(job.id)}
                      disabled={hasApplied}
                      className={`px-4 py-2 rounded-lg font-medium transition ${hasApplied ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                      {hasApplied ? 'Applied' : 'Apply Now'}
                    </button>
                 </div>
              </div>
            )
         })}
      </div>
    </div>
  )
}
