import { useAppData } from '../../context/AppDataContext';

export default function CareerMatches() {
  const { roles } = useAppData();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Career Match Recommendations</h2>
      <p className="text-slate-600">Based on your skills and interests, here are the top roles that align with your profile.</p>

      <div className="grid md:grid-cols-2 gap-6">
        {roles.map(role => (
          <div key={role.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
             <div className="flex justify-between items-start mb-4">
                <div>
                   <h3 className="text-lg font-bold text-slate-800">{role.title}</h3>
                   <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md mt-1">{role.category}</span>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-blue-100 flex items-center justify-center font-bold text-blue-600">
                   {role.matchScore}
                </div>
             </div>
             
             <div className="mb-4 flex-1">
                <p className="text-sm text-slate-600 mb-2"><strong>Why it matches:</strong> {role.whyMatches}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                   {role.requiredSkills.map(skill => (
                      <span key={skill} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">{skill}</span>
                   ))}
                </div>
             </div>
             
             <div className="mt-auto border-t border-slate-100 pt-4 flex justify-between items-center">
                <span className="text-sm text-slate-500 text-slate-600">Demand: <strong className="text-slate-800">{role.demandLevel}</strong></span>
                <span className="text-sm text-slate-500 text-slate-600">Salary: <strong className="text-slate-800">{role.avgSalary}</strong></span>
             </div>
             <button className="mt-4 w-full py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition text-sm">View Learning Roadmap</button>
          </div>
        ))}
      </div>
    </div>
  );
}
