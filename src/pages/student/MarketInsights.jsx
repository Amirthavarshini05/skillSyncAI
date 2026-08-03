import { TrendingUp, Award, Briefcase, Activity, Code2, Globe2, BookOpen } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAppData } from '../../context/AppDataContext';

export default function MarketInsights() {
  const { insights } = useAppData();

  if (!insights) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-7xl mx-auto">
       <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Labor Market Insights</h2>
            <p className="text-slate-500 mt-1 text-lg">Real-time intelligence computed directly from your database and global APIs.</p>
          </div>
          <div className="hidden sm:flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl border border-indigo-100 font-bold text-sm">
             <Activity className="w-4 h-4 animate-pulse"/>
             <span>Live Data Source</span>
          </div>
       </div>
       
       {/* Top Metrics Row */}
       <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-lg text-white relative overflow-hidden group">
             <div className="absolute right-0 top-0 w-48 h-48 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-125"></div>
             <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white mb-6 relative z-10"><TrendingUp className="w-7 h-7" /></div>
             <h3 className="text-sm font-bold text-blue-100 tracking-wider uppercase relative z-10">Trending Role</h3>
             <p className="text-3xl font-black text-white mt-1 leading-tight relative z-10">{insights.trendingRole.title}</p>
             <p className="text-sm text-blue-200 mt-2 font-medium relative z-10">{insights.trendingRole.stat}</p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-purple-200 transition-colors group">
             <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform"><Briefcase className="w-7 h-7" /></div>
             <h3 className="text-sm font-bold text-slate-400 tracking-wider uppercase">Top Hiring Hub</h3>
             <p className="text-3xl font-black text-slate-800 mt-1 leading-tight">{insights.topHub.title}</p>
             <p className="text-sm text-slate-500 mt-2 font-medium">{insights.topHub.stat}</p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-orange-200 transition-colors group">
             <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform"><Award className="w-7 h-7" /></div>
             <h3 className="text-sm font-bold text-slate-400 tracking-wider uppercase">Most Demanded Skill</h3>
             <p className="text-3xl font-black text-slate-800 mt-1 leading-tight capitalize">{insights.topSkill.title}</p>
             <p className="text-sm text-slate-500 mt-2 font-medium">{insights.topSkill.stat}</p>
          </div>
       </div>
       
        
       <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Skill Demand Forecast</h3>
                <p className="text-sm text-slate-500 mt-1">Multi-year adoption trajectory of core tech categories.</p>
              </div>
              <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 focus:ring-indigo-500 font-medium cursor-pointer outline-none">
                <option value="global">Global Trend</option>
              </select>
            </div>
            <div className="flex-1 min-h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={insights.forecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorCloud" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorWeb" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13, fontWeight: 500}} dy={15} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13, fontWeight: 500}} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <Tooltip 
                       contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                       itemStyle={{ fontWeight: 700, padding: '4px 0' }}
                       labelStyle={{ color: '#64748b', fontWeight: 600, marginBottom: '8px' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '30px' }}/>
                    <Area type="monotone" dataKey="AI_ML" name="AI & Machine Learning" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorAI)" />
                    <Area type="monotone" dataKey="Cloud" name="Cloud & DevOps" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorCloud)" />
                    <Area type="monotone" dataKey="Web" name="Web Development" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorWeb)" />
                 </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6 flex flex-col">
              {/* GitHub Trending */}
              <div className="bg-slate-900 p-8 rounded-3xl shadow-lg border border-slate-800 flex-1 flex flex-col relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                    <Code2 className="w-40 h-40 text-white" />
                 </div>
                 <div className="flex items-center justify-between mb-8 relative z-10">
                    <h3 className="font-bold text-white tracking-wide flex items-center gap-3">
                       <div className="p-2 bg-indigo-500/20 rounded-lg"><Code2 className="w-5 h-5 text-indigo-400" /></div>
                       Trending Repos
                    </h3>
                    <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
                 </div>
                 <div className="space-y-5 flex-1 relative z-10">
                    {insights.github?.map((repo, i) => (
                      <a key={i} href={repo.url} target="_blank" rel="noreferrer" className="block group/repo border-l-2 border-slate-700 hover:border-indigo-500 pl-4 py-1 transition-colors">
                        <div className="flex justify-between items-start mb-1">
                           <h4 className="text-indigo-300 font-bold group-hover/repo:text-indigo-200 transition-colors text-sm">{repo.name}</h4>
                           <span className="text-xs font-mono text-slate-400 bg-slate-800/50 px-2 py-0.5 rounded-md border border-slate-700">⭐ {(repo.stars / 1000).toFixed(1)}k</span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-2.5">{repo.description}</p>
                        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                           <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div> {repo.language}
                        </div>
                      </a>
                    ))}
                 </div>
              </div>

              {/* Live News */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex-1 flex flex-col">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-800 flex items-center gap-3">
                       <div className="p-2 bg-blue-50 rounded-lg"><Globe2 className="w-5 h-5 text-blue-600"/></div>
                       Tech News
                    </h3>
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                    </span>
                 </div>
                 <div className="space-y-5 flex-1">
                    {insights.news?.map((item, i) => (
                      <a key={i} href={item.link} target="_blank" rel="noreferrer" className="block group border-b border-slate-50 pb-5 last:border-0 last:pb-0">
                        <h4 className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors line-clamp-2 leading-relaxed mb-2.5">
                          {item.title}
                        </h4>
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] uppercase tracking-wider font-bold text-blue-500 flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5"/> {item.source || "News"}</span>
                           <span className="text-[11px] text-slate-400 font-medium">{item.pubDate}</span>
                        </div>
                      </a>
                    ))}
                 </div>
              </div>
          </div>
       </div>
    </div>
  )
}
