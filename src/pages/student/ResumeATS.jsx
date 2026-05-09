import { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertTriangle, Search, Activity, Target } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';

export default function ResumeATS() {
  const { roles } = useAppData();
  const [file, setFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState(null);

  const topRole = roles?.[0] || { title: "Software Engineer", requiredSkills: ["React", "Node.js", "Python"] };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setResults(null);
    }
  };

  const simulateScan = () => {
    if (!file) return;
    setIsScanning(true);
    
    setTimeout(() => {
      setIsScanning(false);
      setResults({
        score: 78,
        foundKeywords: ["React", "JavaScript", "HTML", "CSS", "Git"],
        missingKeywords: ["Node.js", "Docker", "AWS", "TypeScript"],
        tips: [
          "Quantify your achievements using metrics (e.g., 'Improved performance by 20%').",
          "Include a dedicated section for technical skills.",
          "Ensure your contact information is easily parsable."
        ]
      });
    }, 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Resume ATS Checker</h2>
          <p className="text-slate-500 mt-1 text-lg">See how your resume passes through an Applicant Tracking System for your target role.</p>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl flex items-center gap-2 text-indigo-700 font-semibold shadow-sm">
           <Target className="w-5 h-5" /> Target Role: {topRole.title}
        </div>
      </div>

      {!results && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-16 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
            <UploadCloud className="w-12 h-12 text-indigo-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Upload your resume</h3>
          <p className="text-slate-500 mb-8 max-w-md">Upload a PDF or Word document to instantly analyze its compatibility with top ATS systems.</p>
          
          <label className="relative cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md flex items-center gap-2">
             <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileUpload} />
             <FileText className="w-5 h-5" /> Select File
          </label>
          
          {file && (
             <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-4 w-full max-w-md justify-between">
                <div className="flex items-center gap-3">
                   <FileText className="w-6 h-6 text-indigo-500" />
                   <div className="text-left">
                      <p className="text-sm font-bold text-slate-800 truncate w-48">{file.name}</p>
                      <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                   </div>
                </div>
                <button 
                  onClick={simulateScan}
                  disabled={isScanning}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isScanning ? (
                     <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Scanning...</>
                  ) : (
                     <><Search className="w-4 h-4" /> Scan Now</>
                  )}
                </button>
             </div>
          )}
        </div>
      )}

      {results && (
        <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-500">
           {/* Score Header */}
           <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
              <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -mr-20 -mt-20"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
                 <div className="flex items-center gap-8">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                       <svg className="w-full h-full transform -rotate-90">
                          <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="none" />
                          <circle cx="64" cy="64" r="56" stroke={results.score > 75 ? "#10b981" : "#f59e0b"} strokeWidth="12" fill="none" strokeDasharray="351" strokeDashoffset={351 - (351 * results.score) / 100} className="transition-all duration-1000 ease-out" />
                       </svg>
                       <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-black">{results.score}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">/ 100</span>
                       </div>
                    </div>
                    <div>
                       <h3 className="text-2xl font-bold mb-1">
                          {results.score >= 80 ? 'Excellent Match!' : results.score >= 60 ? 'Good, but needs work.' : 'Poor Match.'}
                       </h3>
                       <p className="text-slate-400 text-sm">Your resume passes the basic ATS checks but lacks some crucial keywords for <strong className="text-white">{topRole.title}</strong>.</p>
                    </div>
                 </div>
                 <button onClick={() => setResults(null)} className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl text-sm font-bold transition-colors backdrop-blur-sm border border-white/10">
                    Scan Another Resume
                 </button>
              </div>
           </div>

           <div className="grid md:grid-cols-2 gap-6">
              {/* Keyword Analysis */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                 <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><Activity className="w-5 h-5 text-indigo-500" /> Keyword Analysis</h4>
                 
                 <div className="mb-6">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Found Keywords</h5>
                    <div className="flex flex-wrap gap-2">
                       {results.foundKeywords.map(kw => (
                          <span key={kw} className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-lg text-sm font-semibold">{kw}</span>
                       ))}
                    </div>
                 </div>
                 
                 <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1"><AlertTriangle className="w-4 h-4 text-orange-500"/> Missing Keywords</h5>
                    <div className="flex flex-wrap gap-2">
                       {results.missingKeywords.map(kw => (
                          <span key={kw} className="bg-orange-50 text-orange-700 border border-orange-100 px-3 py-1 rounded-lg text-sm font-semibold">{kw}</span>
                       ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-3 italic">Adding these will significantly boost your ATS score.</p>
                 </div>
              </div>

              {/* Actionable Tips */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                 <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><FileText className="w-5 h-5 text-indigo-500" /> AI Formatting Tips</h4>
                 <ul className="space-y-4">
                    {results.tips.map((tip, i) => (
                       <li key={i} className="flex gap-3 items-start bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0 mt-0.5">{i+1}</div>
                          <p className="text-slate-600 text-sm leading-relaxed">{tip}</p>
                       </li>
                    ))}
                 </ul>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
