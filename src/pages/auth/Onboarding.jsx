import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (user && !user.needsOnboarding) {
      const fetchProfile = async () => {
        try {
          const token = localStorage.getItem('skillsync_token');
          const response = await fetch('http://localhost:8000/api/users/me/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setFormData(prev => ({
              ...prev,
              ...(data.education || {}),
              ...(data.preferences || {}),
              knownSkills: data.skills ? data.skills.map(s => s.name).join(', ') : ''
            }));
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchProfile();
    }
  }, [user]);

  const handleSubmit = async () => {
    try {
      const skillsList = formData.knownSkills.split(',').map(s => ({ name: s.trim(), level: 'Beginner' })).filter(s => s.name);
      
      const payload = {
        skills: skillsList,
        education: {
          educationLevel: formData.educationLevel,
          department: formData.department,
          collegeName: formData.collegeName,
          currentYear: formData.currentYear,
          institutionName: formData.institutionName,
          institutionType: formData.institutionType,
        },
        preferences: {
          careerGoal: formData.careerGoal,
          companyName: formData.companyName,
          industry: formData.industry,
          targetRoles: formData.targetRoles,
          studentCount: formData.studentCount,
        },
        resume_path: formData.resume_path
      };

      const token = localStorage.getItem('skillsync_token');
      const isUpdating = user && !user.needsOnboarding;
      const url = isUpdating 
        ? 'http://localhost:8000/api/users/me/profile' 
        : 'http://localhost:8000/api/users/me/onboarding';
      const method = isUpdating ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save profile');
      }

      await completeOnboarding();
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataObj = new FormData();
    formDataObj.append('file', file);
    
    try {
      const token = localStorage.getItem('skillsync_token');
      const response = await fetch('http://localhost:8000/api/users/me/resume', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataObj
      });
      if (response.ok) {
        const data = await response.json();
        if (data.skills && data.skills.length > 0) {
          const newSkills = data.skills.map(s => s.name).join(', ');
          setFormData(prev => ({
            ...prev,
            knownSkills: prev.knownSkills ? `${prev.knownSkills}, ${newSkills}` : newSkills,
            resume_path: data.resume_path
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            resume_path: data.resume_path
          }));
        }
        alert('Resume uploaded and parsed successfully!');
      } else {
        alert('Failed to upload resume');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading resume');
    }
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
            <input type="file" onChange={handleFileUpload} accept=".pdf,.doc,.docx" className="text-sm mx-auto" />
            {formData.resume_path && <p className="text-green-600 text-sm mt-2">File uploaded successfully!</p>}
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
