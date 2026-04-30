import { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { Bookmark, MapPin, Briefcase, Search, CheckCircle2, CircleDashed, Building2, Sparkles, Filter, X, FileText, Send } from 'lucide-react';

// Circular Progress Component for Match Score
const MatchRing = ({ score }) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const colorClass = score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-rose-500';
  const bgClass = score >= 80 ? 'text-emerald-50' : score >= 50 ? 'text-amber-50' : 'text-rose-50';

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-12 h-12 transform -rotate-90 drop-shadow-sm">
        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className={bgClass} />
        <circle 
           cx="24" cy="24" r="20" 
           stroke="currentColor" strokeWidth="4" fill="transparent" 
           strokeDasharray={circumference} 
           strokeDashoffset={strokeDashoffset} 
           className={`${colorClass} transition-all duration-1000 ease-out`} 
           strokeLinecap="round" 
        />
      </svg>
      <span className="absolute text-[10px] font-black text-slate-700">{score}%</span>
    </div>
  )
};

// Generates a consistent colorful avatar based on company name
const CompanyAvatar = ({ name }) => {
  const colors = ['from-blue-500 to-cyan-500', 'from-indigo-500 to-purple-500', 'from-purple-500 to-pink-500', 'from-rose-500 to-orange-500', 'from-teal-500 to-emerald-500'];
  const index = name.charCodeAt(0) % colors.length;
  
  return (
    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[index]} flex items-center justify-center text-white font-bold text-xl shadow-md shrink-0`}>
       {name.charAt(0).toUpperCase()}
    </div>
  )
};

export default function Opportunities() {
  const { opportunities, applyForJob, trackedApplications, skills, studentProfile } = useAppData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  // Easy Apply Modal State
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  // Helper to check if user has skill
  const userSkillNames = new Set(skills.map(s => s.name.toLowerCase()));
  const hasSkill = (req) => userSkillNames.has(req.toLowerCase());

  // Filter Logic
  const filteredOpps = opportunities.filter(job => {
     const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           job.company.toLowerCase().includes(searchTerm.toLowerCase());
     const matchesFilter = filter === 'All' ? true : job.type.includes(filter);
     return matchesSearch && matchesFilter;
  });

  const handleSubmitApplication = async () => {
    setIsApplying(true);
    // Simulate AI Generation and Network transit
    setTimeout(async () => {
       await applyForJob(selectedJob);
       setIsApplying(false);
       
       // If there is an external URL, open it
       if (selectedJob.url) {
           window.open(selectedJob.url, '_blank');
       }
       
       setSelectedJob(null);
       setCoverLetter('');
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-7xl mx-auto">
      
      {/* Premium Header */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Building2 className="w-48 h-48 text-indigo-900" />
         </div>
         <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
               <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
                 Opportunity Connector <Sparkles className="w-6 h-6 text-indigo-500"/>
               </h2>
               <p className="text-slate-500 mt-2 text-lg">We automatically route your profile to high-matching roles.</p>
            </div>
            
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
               <div className="relative w-full sm:w-64">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <input 
                   type="text" 
                   placeholder="Search roles or companies..." 
                   className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
               </div>
               <div className="relative shrink-0">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select 
                     className="pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                     value={filter}
                     onChange={(e) => setFilter(e.target.value)}
                  >
                     <option value="All">All Types</option>
                     <option value="Full-Time">Full-Time</option>
                     <option value="Internship">Internship</option>
                  </select>
               </div>
            </div>
         </div>
      </div>

      {/* Grid of Opportunities */}
      {filteredOpps.length === 0 ? (
         <div className="py-20 text-center bg-white border border-slate-100 rounded-3xl shadow-sm">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700">No opportunities found</h3>
            <p className="text-slate-500 mt-1">Try adjusting your search or filters.</p>
         </div>
      ) : (
         <div className="grid lg:grid-cols-2 gap-6">
            {filteredOpps.map((job, idx) => {
               const hasApplied = trackedApplications.some(app => app.jobId === job.id);
               const matchedSkillsCount = job.requiredSkills.filter(hasSkill).length;
               
               return (
                 <div key={job.id} className="group bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col hover:shadow-xl hover:border-indigo-100 transition-all duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                    
                    {/* Top Row: Logo, Title, Bookmark */}
                    <div className="flex justify-between items-start mb-6">
                       <div className="flex gap-4">
                          <CompanyAvatar name={job.company} />
                          <div>
                             <h3 className="font-bold text-lg text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight">{job.title}</h3>
                             <p className="text-slate-500 font-medium text-sm mt-0.5">{job.company}</p>
                          </div>
                       </div>
                       <button className="text-slate-300 hover:text-indigo-500 transition-colors p-2 -mt-2 -mr-2 rounded-full hover:bg-slate-50">
                          <Bookmark className="w-5 h-5" />
                       </button>
                    </div>
                    
                    {/* Middle Row: Meta info */}
                    <div className="flex flex-wrap gap-3 mb-6">
                       <div className="flex items-center text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                          <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> {job.location}
                       </div>
                       <div className="flex items-center text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                          <Briefcase className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> {job.type}
                       </div>
                    </div>

                    <div className="w-full h-px bg-slate-100 mb-5"></div>

                    {/* Skills & Match Section */}
                    <div className="flex items-center justify-between mb-6">
                       <div className="flex-1 mr-4">
                          <div className="flex items-center gap-2 mb-2">
                             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Required Skills</span>
                             <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full">{matchedSkillsCount} / {job.requiredSkills.length} matches</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                             {job.requiredSkills.map(s => {
                                const owned = hasSkill(s);
                                return (
                                  <span key={s} className={`flex items-center px-2 py-1 text-[11px] rounded-md font-bold transition-colors ${
                                     owned ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-white text-slate-400 border border-slate-200'
                                  }`}>
                                     {owned ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <CircleDashed className="w-3 h-3 mr-1 opacity-50" />}
                                     {s}
                                  </span>
                                )
                             })}
                          </div>
                       </div>
                       
                       <div className="shrink-0 flex flex-col items-center">
                          <MatchRing score={job.matchScore} />
                       </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="mt-auto">
                       <button 
                         onClick={() => setSelectedJob(job)}
                         disabled={hasApplied}
                         className={`w-full py-3 rounded-xl font-bold flex items-center justify-center transition-all ${
                            hasApplied 
                              ? 'bg-emerald-50 text-emerald-600 cursor-not-allowed border border-emerald-100' 
                              : 'bg-slate-900 text-white shadow-md shadow-slate-200 hover:bg-indigo-600 hover:-translate-y-0.5'
                         }`}
                       >
                         {hasApplied ? (
                            <><CheckCircle2 className="w-5 h-5 mr-2" /> Application Submitted</>
                         ) : 'Easy Apply'}
                       </button>
                    </div>
                 </div>
               )
            })}
         </div>
      )}

      {/* Easy Apply Modal */}
      {selectedJob && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
               {/* Modal Header */}
               <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-3">
                     <CompanyAvatar name={selectedJob.company} />
                     <div>
                       <h3 className="font-bold text-slate-800 text-lg leading-tight">Apply to {selectedJob.company}</h3>
                       <p className="text-sm text-slate-500 font-medium">{selectedJob.title}</p>
                     </div>
                  </div>
                  <button onClick={() => setSelectedJob(null)} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 rounded-full transition-colors">
                     <X className="w-5 h-5" />
                  </button>
               </div>

               {/* Modal Body */}
               <div className="p-6 overflow-y-auto">
                  <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-start gap-3">
                     <div className="mt-0.5"><CheckCircle2 className="w-5 h-5 text-indigo-600" /></div>
                     <div>
                        <h4 className="text-sm font-bold text-indigo-900 mb-1">AI Match Verified ({selectedJob.matchScore}%)</h4>
                        <p className="text-xs text-indigo-700 leading-relaxed">Your SkillSync AI profile automatically matches the requirements for this role. The recruiter will see your verified skills.</p>
                     </div>
                  </div>

                  <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Applicant Details</label>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex justify-between items-center">
                           <div>
                              <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                              <p className="text-xs text-slate-500">{user?.email}</p>
                           </div>
                           <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-100 px-2 py-1 rounded">Verified</span>
                        </div>
                     </div>

                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Resume Attachment</label>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-3">
                           <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><FileText className="w-4 h-4" /></div>
                           <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-700 truncate max-w-[200px] sm:max-w-xs">
                                 {studentProfile?.resume_path ? studentProfile.resume_path.split('\\').pop().split('/').pop() : 'skillsync_profile.pdf'}
                              </p>
                              <p className="text-xs text-slate-400">Auto-attached from your profile</p>
                           </div>
                        </div>
                     </div>

                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                           <Sparkles className="w-4 h-4 text-indigo-500" /> AI-Generated Cover Letter
                        </label>
                        <div className="text-xs text-slate-400 mb-2 font-medium">We've auto-drafted a pitch based on your profile and this specific role. Feel free to copy or edit it.</div>
                        <textarea 
                           className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow min-h-[140px] resize-none font-medium text-slate-700"
                           value={coverLetter || `Hi Hiring Team,\n\nI am extremely interested in the ${selectedJob.title} position at ${selectedJob.company}. Based on my verified SkillSync profile, I am a ${selectedJob.matchScore}% match for your required technical stack.\n\nI have attached my resume via the platform and would love the opportunity to interview.\n\nBest,\n${user?.name || 'Applicant'}`}
                           onChange={(e) => setCoverLetter(e.target.value)}
                        ></textarea>
                     </div>
                  </form>
               </div>

               {/* Modal Footer */}
               <div className="p-6 border-t border-slate-100 bg-white shrink-0">
                  <button 
                     onClick={handleSubmitApplication}
                     disabled={isApplying}
                     className="w-full bg-indigo-600 text-white rounded-xl py-3.5 font-bold flex items-center justify-center hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 disabled:opacity-70"
                  >
                     {isApplying ? (
                        <div className="flex items-center gap-2">
                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> 
                           Processing...
                        </div>
                     ) : (
                        <><Send className="w-4 h-4 mr-2" /> {selectedJob.url ? "Copy Cover Letter & Continue to Application" : "Submit Application"}</>
                     )}
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  )
}
