import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const { user, completeOnboarding } = useAuth();
  const { saveProfileProfile } = useAppData();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Student fields
    educationLevel: 'Undergraduate',
    department: '',
    collegeName: '',
    currentYear: '3',
    careerGoal: '',
    knownSkills: '',
    // Recruiter fields
    companyName: '',
    industry: 'Technology',
    targetRoles: '',
    // College fields
    institutionName: '',
    institutionType: 'University',
    studentCount: ''
  });

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const handleSubmit = () => {
    saveProfileProfile(formData);
    completeOnboarding();
    navigate('/dashboard');
  };

  const renderStudentSteps = () => {
    if (step === 1) return (
      <div className="space-y-4">
         <div>
            <label className="block text-sm font-medium text-slate-700">Education Level</label>
            <select value={formData.educationLevel} onChange={e=>setFormData({...formData, educationLevel: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-slate-300 bg-white rounded-md">
               <option>Undergraduate</option>
               <option>Postgraduate</option>
               <option>High School</option>
            </select>
         </div>
         <div>
            <label className="block text-sm font-medium text-slate-700">College Name</label>
            <input type="text" value={formData.collegeName} onChange={e=>setFormData({...formData, collegeName: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md" />
         </div>
         <div>
            <label className="block text-sm font-medium text-slate-700">Department / Stream</label>
            <input type="text" value={formData.department} onChange={e=>setFormData({...formData, department: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md" />
         </div>
      </div>
    );
    if (step === 2) return (
      <div className="space-y-4">
         <div>
            <label className="block text-sm font-medium text-slate-700">Career Goal (Target Role)</label>
            <input type="text" placeholder="e.g. Data Scientist, Frontend Dev" value={formData.careerGoal} onChange={e=>setFormData({...formData, careerGoal: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md" />
         </div>
         <div>
            <label className="block text-sm font-medium text-slate-700">Current Known Skills (Comma separated)</label>
            <textarea rows={3} value={formData.knownSkills} onChange={e=>setFormData({...formData, knownSkills: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md" />
         </div>
      </div>
    );
    return null;
  };

  const renderRecruiterSteps = () => {
    if (step === 1) return (
      <div className="space-y-4">
         <div>
            <label className="block text-sm font-medium text-slate-700">Company Name</label>
            <input type="text" value={formData.companyName} onChange={e=>setFormData({...formData, companyName: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md" />
         </div>
         <div>
            <label className="block text-sm font-medium text-slate-700">Industry</label>
            <select value={formData.industry} onChange={e=>setFormData({...formData, industry: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-slate-300 bg-white rounded-md">
               <option>Technology</option>
               <option>Finance</option>
               <option>Healthcare</option>
               <option>Education</option>
               <option>Manufacturing</option>
               <option>Other</option>
            </select>
         </div>
      </div>
    );
    if (step === 2) return (
      <div className="space-y-4">
         <div>
            <label className="block text-sm font-medium text-slate-700">Hiring Needs (Target Roles)</label>
            <input type="text" placeholder="e.g. Software Engineer, Product Manager" value={formData.targetRoles} onChange={e=>setFormData({...formData, targetRoles: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md" />
         </div>
         <div>
            <label className="block text-sm font-medium text-slate-700">Required Skills (Comma separated)</label>
            <textarea rows={3} value={formData.knownSkills} onChange={e=>setFormData({...formData, knownSkills: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md" />
         </div>
      </div>
    );
    return null;
  };

  const renderCollegeSteps = () => {
    if (step === 1) return (
      <div className="space-y-4">
         <div>
            <label className="block text-sm font-medium text-slate-700">Institution Name</label>
            <input type="text" value={formData.institutionName} onChange={e=>setFormData({...formData, institutionName: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md" />
         </div>
         <div>
            <label className="block text-sm font-medium text-slate-700">Institution Type</label>
            <select value={formData.institutionType} onChange={e=>setFormData({...formData, institutionType: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-slate-300 bg-white rounded-md">
               <option>University</option>
               <option>Engineering College</option>
               <option>Management Institute</option>
               <option>Vocational</option>
            </select>
         </div>
      </div>
    );
    if (step === 2) return (
      <div className="space-y-4">
         <div>
            <label className="block text-sm font-medium text-slate-700">Total Student Count</label>
            <input type="number" placeholder="e.g. 5000" value={formData.studentCount} onChange={e=>setFormData({...formData, studentCount: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md" />
         </div>
         <div>
            <label className="block text-sm font-medium text-slate-700">Top Departments / Streams</label>
            <textarea rows={3} placeholder="Computer Science, Electronics, etc." value={formData.department} onChange={e=>setFormData({...formData, department: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md" />
         </div>
      </div>
    );
    return null;
  };

  const renderStep3 = () => {
    const roleBasedText = {
      student: "Upload Resume (Optional)",
      recruiter: "Upload Company Logo / Guidelines (Optional)",
      college: "Upload Institutional Accreditation / Logo (Optional)"
    };
    
    return (
      <div className="space-y-4 text-center">
         <div className="p-6 bg-blue-50 border border-blue-100 rounded-lg">
            <h3 className="font-bold text-blue-800 mb-2">{roleBasedText[user?.role] || roleBasedText.student}</h3>
            <p className="text-sm text-blue-600 mb-4">Let our AI extract details automatically.</p>
            <input type="file" className="text-sm mx-auto" />
         </div>
         <p className="text-slate-500 text-sm mt-4">You're all set! Let's generate your dashboard.</p>
      </div>
    )
  }

  const role = user?.role || 'student';

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-lg border border-slate-100">
        <h2 className="text-2xl font-bold text-center mb-2">Complete Your Profile</h2>
        <p className="text-slate-500 text-center mb-8">Step {step} of 3</p>
        
        {role === 'student' && step < 3 && renderStudentSteps()}
        {role === 'recruiter' && step < 3 && renderRecruiterSteps()}
        {role === 'college' && step < 3 && renderCollegeSteps()}
        {step === 3 && renderStep3()}

        <div className="mt-8 flex justify-between">
           {step > 1 ? (
             <button onClick={handlePrev} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50">Back</button>
           ) : <div/>}
           {step < 3 ? (
             <button onClick={handleNext} className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700">Next</button>
           ) : (
             <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700">Complete & Connect</button>
           )}
        </div>
      </div>
    </div>
  )
}
