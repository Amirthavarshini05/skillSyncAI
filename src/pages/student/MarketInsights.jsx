import { TrendingUp, Award, Briefcase, ExternalLink } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAppData } from '../../context/AppDataContext';

export default function MarketInsights() {
  const { insights } = useAppData();

  if (!insights) return <div className="p-4 text-slate-500">Loading insights...</div>;

  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-slate-800">Labor Market Insights</h2>
       
       <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4"><TrendingUp className="w-5 h-5" /></div>
             <h3 className="text-sm font-medium text-slate-500">Trending Role</h3>
             <p className="text-xl font-bold text-slate-800">{insights.trendingRole.title}</p>
             <p className="text-sm text-green-600 mt-2">{insights.trendingRole.stat}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-4"><Briefcase className="w-5 h-5" /></div>
             <h3 className="text-sm font-medium text-slate-500">Top Hub</h3>
             <p className="text-xl font-bold text-slate-800">{insights.topHub.title}</p>
             <p className="text-sm text-slate-600 mt-2">{insights.topHub.stat}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mb-4"><Award className="w-5 h-5" /></div>
             <h3 className="text-sm font-medium text-slate-500">Most Demanded Skill</h3>
             <p className="text-xl font-bold text-slate-800">{insights.topSkill.title}</p>
             <p className="text-sm text-slate-600 mt-2">{insights.topSkill.stat}</p>
          </div>
       </div>
       
        
       <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
            <h3 className="font-bold text-slate-800 mb-6">Skill Demand Forecast</h3>
            <div className="flex-1 min-h-[300px]">
              <div className="flex justify-between mt-2 text-sm text-slate-500">
             <span>2020</span>
             <span>2021</span>
             <span>2022</span>
             <span>2023</span>
             <span>2024</span>
             <span>2025</span>
             </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
             <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800">Live Tech News</h3>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
             </div>
             <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar max-h-[300px]">
                {insights.news?.map((item, i) => (
                  <a key={i} href={item.link} target="_blank" rel="noreferrer" className="block p-3 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-slate-50 transition group">
                    <h4 className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 line-clamp-2 leading-snug mb-1">
                      {item.title}
                    </h4>
                    <div className="flex items-center justify-between mt-2">
                       <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-500">{item.source || "News"}</span>
                       <span className="text-[11px] text-slate-400">{item.pubDate}</span>
                    </div>
                  </a>
                ))}
                {!insights.news?.length && (
                  <p className="text-sm text-slate-500 text-center py-4">No recent news found.</p>
                )}
             </div>
          </div>
       </div>
    </div>
  )
}
