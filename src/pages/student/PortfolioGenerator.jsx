import { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { LayoutTemplate, ExternalLink, Download, Code2, Briefcase, Mail, Globe, User, Eye } from 'lucide-react';

export default function PortfolioGenerator() {
  const { user } = useAuth();
  const { skills, studentProfile, roadmap } = useAppData();
  const [theme, setTheme] = useState('dark'); // 'dark', 'light', 'minimal'
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowPreview(true);
    }, 1500);
  };

  const topSkills = skills.slice(0, 6);

  const getCompletedProjects = () => {
    if (!studentProfile?.roadmap_progress || !roadmap) return [];
    const progress = studentProfile.roadmap_progress;
    const completed = [];
    
    Object.values(roadmap).forEach(stages => {
      if (!Array.isArray(stages)) return;
      stages.forEach(stage => {
        if (!Array.isArray(stage.tasks)) return;
        stage.tasks.forEach(task => {
          if (task && task.type === 'project' && progress[task.id]?.completed) {
            completed.push({
              id: task.id,
              title: task.title,
              link: progress[task.id].link,
              stage: stage.stage
            });
          }
        });
      });
    });
    return completed;
  };

  const completedProjects = getCompletedProjects();
  const displayProjects = completedProjects.length > 0 ? completedProjects : [
    { id: 'mock-1', title: 'Personal Finance Dashboard', link: 'https://github.com', stage: 'Intermediate' },
    { id: 'mock-2', title: 'AI-Powered Search Engine', link: 'https://github.com', stage: 'Advanced' }
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">AI Portfolio Generator</h2>
          <p className="text-slate-500 mt-1 text-lg">Instantly generate a beautiful personal website based on your verified skills and roadmap progress.</p>
        </div>
      </div>

      {!showPreview ? (
        <div className="grid md:grid-cols-2 gap-8">
           {/* Setup Form */}
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                 <LayoutTemplate className="w-5 h-5 text-indigo-500" /> Customize Your Site
              </h3>
              
              <div className="space-y-6">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Select Theme</label>
                    <div className="grid grid-cols-3 gap-3">
                       <button onClick={() => setTheme('dark')} className={`p-4 rounded-xl border-2 text-sm font-bold transition-all ${theme === 'dark' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}>
                          Developer Dark
                       </button>
                       <button onClick={() => setTheme('light')} className={`p-4 rounded-xl border-2 text-sm font-bold transition-all ${theme === 'light' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}>
                          Creative Light
                       </button>
                       <button onClick={() => setTheme('minimal')} className={`p-4 rounded-xl border-2 text-sm font-bold transition-all ${theme === 'minimal' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}>
                          Minimalist
                       </button>
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Sections to Include</label>
                    <div className="space-y-2">
                       <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer">
                          <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                          <span className="text-sm font-medium text-slate-700">Verified Skills Graph</span>
                       </label>
                       <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer">
                          <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                          <span className="text-sm font-medium text-slate-700">Recent Projects</span>
                       </label>
                       <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer">
                          <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                          <span className="text-sm font-medium text-slate-700">Contact Form</span>
                       </label>
                    </div>
                 </div>

                 <button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-md flex justify-center items-center gap-2"
                 >
                    {isGenerating ? (
                       <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Generating Code...</>
                    ) : (
                       <><LayoutTemplate className="w-5 h-5" /> Generate Portfolio</>
                    )}
                 </button>
              </div>
           </div>

           {/* Info / Value Prop */}
           <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -mr-20 -mt-20"></div>
              <div className="relative z-10">
                 <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/5 backdrop-blur-md">
                    <Code2 className="w-8 h-8 text-indigo-400" />
                 </div>
                 <h3 className="text-2xl font-bold mb-4">No code required.</h3>
                 <p className="text-slate-400 mb-8 leading-relaxed">
                    Our AI reads your profile, aggregates your verified skills, and writes a fully responsive React + Tailwind website for you. You can download the source code or deploy it directly to Vercel/GitHub Pages with one click.
                 </p>
                 <ul className="space-y-3 text-sm font-semibold text-slate-300">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div> 100% Mobile Responsive</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div> SEO Optimized</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div> Clean React Source Code</li>
                 </ul>
              </div>
           </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-500">
           {/* Action Bar */}
           <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold border border-emerald-100">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Live Preview
              </div>
              <div className="flex gap-3">
                 <button onClick={() => setShowPreview(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-50 rounded-lg transition-colors text-sm">
                    Back to Editor
                 </button>
                 <button className="px-4 py-2 bg-slate-900 text-white font-bold hover:bg-slate-800 rounded-lg transition-colors text-sm flex items-center gap-2">
                    <Download className="w-4 h-4" /> Download ZIP
                 </button>
                 <button className="px-4 py-2 bg-indigo-600 text-white font-bold hover:bg-indigo-700 rounded-lg transition-colors text-sm flex items-center gap-2 shadow-md">
                    <ExternalLink className="w-4 h-4" /> Deploy to Vercel
                 </button>
              </div>
           </div>

           {/* The Mock Portfolio Preview */}
           <div className={`w-full h-[600px] rounded-3xl border-4 border-slate-200 overflow-y-auto ${theme === 'dark' ? 'bg-slate-950 text-white' : theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-white text-slate-800'}`}>
              <div className="max-w-4xl mx-auto p-8 md:p-16">
                 
                 {/* Navbar Mock */}
                 <nav className="flex justify-between items-center mb-24">
                    <div className="font-black text-2xl tracking-tighter">{user?.name || "Portfolio"}.</div>
                    <div className="flex gap-6 text-sm font-bold opacity-70">
                       <button 
                          onClick={() => document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' })}
                          className="hover:opacity-100 transition-opacity cursor-pointer focus:outline-none"
                       >
                          About
                       </button>
                       <button 
                          onClick={() => document.getElementById('skills-section')?.scrollIntoView({ behavior: 'smooth' })}
                          className="hover:opacity-100 transition-opacity cursor-pointer focus:outline-none"
                       >
                          Skills
                       </button>
                       <button 
                          onClick={() => document.getElementById('projects-section')?.scrollIntoView({ behavior: 'smooth' })}
                          className="hover:opacity-100 transition-opacity cursor-pointer focus:outline-none"
                       >
                          Projects
                       </button>
                       <button 
                          onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })}
                          className="hover:opacity-100 transition-opacity cursor-pointer focus:outline-none"
                       >
                          Contact
                       </button>
                    </div>
                 </nav>

                 {/* Hero Mock */}
                 <div id="about-section" className="mb-32">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
                       Building digital <br/> experiences.
                    </h1>
                    <p className={`text-xl max-w-xl mb-10 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                       Hi, I'm {user?.name || 'a Developer'}. I specialize in building exceptional websites, applications, and everything in between.
                    </p>
                    <div className="flex gap-4">
                       <button 
                          onClick={() => document.getElementById('projects-section')?.scrollIntoView({ behavior: 'smooth' })}
                          className={`px-8 py-4 rounded-full font-bold flex items-center gap-2 cursor-pointer transition-transform active:scale-95 focus:outline-none ${theme === 'dark' ? 'bg-white text-black hover:bg-slate-200' : 'bg-black text-white hover:bg-slate-800'}`}
                       >
                          View Projects
                       </button>
                    </div>
                 </div>

                 {/* Skills Mock */}
                 <div id="skills-section" className="mb-32">
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                       <Code2 className="w-6 h-6" /> Technologies I use
                    </h2>
                    <div className="flex flex-wrap gap-3">
                       {topSkills.map((skill, i) => (
                          <span key={i} className={`px-4 py-2 rounded-lg text-sm font-bold border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                             {skill.name}
                          </span>
                       ))}
                       {topSkills.length === 0 && (
                          <span className={`px-4 py-2 rounded-lg text-sm font-bold border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                             React
                          </span>
                       )}
                    </div>
                 </div>

                 {/* Projects Mock */}
                 <div id="projects-section" className="mb-32">
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                       <Briefcase className="w-6 h-6" /> Completed Projects
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                       {displayProjects.map((project, i) => (
                          <a 
                             key={project.id || i} 
                             href={project.link} 
                             target="_blank" 
                             rel="noopener noreferrer" 
                             className={`p-6 rounded-2xl border transition-all hover:scale-[1.01] block group ${theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:border-indigo-500/50' : 'bg-white border-slate-200 hover:border-indigo-500/50 shadow-sm hover:shadow-md'}`}
                          >
                             <div className="flex justify-between items-start gap-4 mb-3">
                                <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-500">
                                   {project.stage} Stage
                                </span>
                                <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity text-indigo-500" />
                             </div>
                             <h3 className="font-bold text-lg mb-2 group-hover:text-indigo-500 transition-colors">
                                {project.title}
                             </h3>
                             <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                Completed and verified via SkillSync. Click to view repository or live demo.
                             </p>
                          </a>
                       ))}
                    </div>
                 </div>

                 {/* Contact Mock */}
                 <div id="contact-section" className="mb-32">
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                       <Mail className="w-6 h-6" /> Get in touch
                    </h2>
                    <p className={`text-lg mb-6 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                       Have a project in mind or want to collaborate? Feel free to reach out.
                    </p>
                    <a 
                       href={`mailto:${user?.email || 'hello@skillsync.ai'}`} 
                       className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold border transition-colors ${theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-white' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm'}`}
                    >
                       <Mail className="w-4 h-4" /> {user?.email || 'hello@skillsync.ai'}
                    </a>
                 </div>

                 {/* Footer Mock */}
                 <div className={`pt-8 border-t flex justify-between items-center ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
                    <p className="text-sm font-bold opacity-50">© 2026 {user?.name || 'Developer'}</p>
                    <div className="flex gap-4 opacity-50">
                       <Globe className="w-5 h-5" />
                       <User className="w-5 h-5" />
                       <Mail className="w-5 h-5" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
