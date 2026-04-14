import { TrendingUp, Award, Briefcase } from 'lucide-react';

export default function MarketInsights() {
  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-slate-800">Labor Market Insights</h2>
       
       <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4"><TrendingUp className="w-5 h-5" /></div>
             <h3 className="text-sm font-medium text-slate-500">Trending Role</h3>
             <p className="text-xl font-bold text-slate-800">AI / ML Engineer</p>
             <p className="text-sm text-green-600 mt-2">+24% YoY Demand</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-4"><Briefcase className="w-5 h-5" /></div>
             <h3 className="text-sm font-medium text-slate-500">Top Hub</h3>
             <p className="text-xl font-bold text-slate-800">Bangalore, India</p>
             <p className="text-sm text-slate-600 mt-2">12,000+ open roles</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mb-4"><Award className="w-5 h-5" /></div>
             <h3 className="text-sm font-medium text-slate-500">Most Demanded Skill</h3>
             <p className="text-xl font-bold text-slate-800">React & Next.js</p>
             <p className="text-sm text-slate-600 mt-2">Found in 45% of frontend JDs</p>
          </div>
       </div>
       
       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">Skill Demand Forecast</h3>
          <div className="h-64 flex items-end space-x-2">
             {[40, 60, 55, 80, 95, 85].map((h, i) => (
               <div key={i} className="flex-1 bg-blue-100 rounded-t-sm relative group">
                 <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-sm transition-all duration-500 hover:bg-blue-600" style={{ height: `${h}%` }}></div>
               </div>
             ))}
          </div>
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
  )
}
