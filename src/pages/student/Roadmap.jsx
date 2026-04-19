import { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { CheckCircle2, Circle } from 'lucide-react';

export default function Roadmap() {
  const { roadmap } = useAppData();
  const stages = roadmap["role_1"];
  const [completed, setCompleted] = useState(['t1']);

  const toggleTask = (id) => {
    if (completed.includes(id)) {
      setCompleted(completed.filter(t => t !== id));
    } else {
      setCompleted([...completed, id]);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
       <div>
         <h2 className="text-2xl font-bold text-slate-800">Career Roadmap: Frontend Developer</h2>
         <p className="text-slate-600">Your personalized learning path to hit 100% job readiness.</p>
       </div>

       <div className="space-y-8">
         {stages && stages.map((stage, idx) => (
           <div key={idx} className="relative pl-8">
              <div className="absolute left-0 top-0 bottom-0 w-px bg-blue-200"></div>
              <div className="absolute left-[-4px] top-6 w-2 h-2 rounded-full bg-blue-500"></div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 ml-4 hover:border-blue-200 transition relative">
                 <h3 className="font-bold text-lg text-slate-800">{stage.stage} Stage</h3>
                 <p className="text-sm text-slate-500 mb-4">Estimated completion: {stage.estimatedCompletion}</p>
                 
                 <div className="space-y-3">
                   {stage.tasks.map(task => {
                     const isDone = completed.includes(task.id);
                     return (
                       <div key={task.id} className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded group cursor-pointer" onClick={() => toggleTask(task.id)}>
                         {isDone ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-slate-300 group-hover:text-blue-400" />}
                         <div>
                            <p className={`font-medium ${isDone ? 'text-slate-500 line-through' : 'text-slate-800'}`}>{task.title}</p>
                            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">{task.type}</span>
                         </div>
                       </div>
                     )
                   })}
                 </div>
              </div>
           </div>
         ))}
       </div>
    </div>
  )
}
