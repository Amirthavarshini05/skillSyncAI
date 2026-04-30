import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { useNavigate } from 'react-router-dom';

// ── Institution & Department Data ─────────────────────────────────────────────

const HIGH_SCHOOLS = [
  'Delhi Public School (DPS)',
  'Kendriya Vidyalaya (KV)',
  'Jawahar Navodaya Vidyalaya',
  'Army Public School',
  'DAV Public School',
  'Ryan International School',
  "St. Xavier's High School",
  "St. Mary's High School",
  'Sacred Heart School',
  'Holy Cross School',
  'Lawrence School',
  'The Doon School',
  'Atomic Energy Central School',
  'Amity International School',
  'Birla High School',
  'Chinmaya Vidyalaya',
  "Bhavan's Vidya Mandir",
  'Loyola School',
  'Don Bosco School',
  'Maharishi Vidya Mandir',
  'Sishya School',
  'PSBB Senior Secondary School',
  'Chettinad Vidyashram',
  'Padma Seshadri Bala Bhavan (PSBB)',
  'Sri Chaitanya School',
  'Narayana E-Techno School',
  'Other',
];

const COLLEGES = [
  'IIT Bombay',
  'IIT Delhi',
  'IIT Madras',
  'IIT Kharagpur',
  'IIT Kanpur',
  'IIT Roorkee',
  'IIT Hyderabad',
  'IIT Guwahati',
  'NIT Trichy',
  'NIT Warangal',
  'NIT Surathkal',
  'NIT Calicut',
  'BITS Pilani',
  'BITS Hyderabad',
  'VIT University, Vellore',
  'VIT University, Chennai',
  'SRM Institute of Science and Technology',
  'Manipal Institute of Technology',
  'Amrita Vishwa Vidyapeetham',
  'Anna University',
  'PSG College of Technology',
  'Coimbatore Institute of Technology',
  'Bannari Amman Institute of Technology',
  'Thiagarajar College of Engineering',
  'SSN College of Engineering',
  'Rajalakshmi Engineering College',
  'Saveetha Engineering College',
  'Jadavpur University',
  'Christ University',
  'Symbiosis International University',
  'Pune Institute of Computer Technology',
  'Ramaiah Institute of Technology',
  'PES University',
  'RV College of Engineering',
  'BMS College of Engineering',
  'Delhi University (DU)',
  'Mumbai University',
  'Pune University (SPPU)',
  'Bangalore University',
  'Osmania University',
  'Hyderabad Central University',
  'Tezpur University',
  'Calcutta University',
  'Madurai Kamaraj University',
  'Other',
];

const HIGH_SCHOOL_STREAMS = [
  'Science – PCM (Physics, Chemistry, Maths)',
  'Science – PCB (Physics, Chemistry, Biology)',
  'Science – PCMB (Physics, Chemistry, Maths & Biology)',
  'Commerce',
  'Arts / Humanities',
  'Vocational',
];

const COLLEGE_DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Artificial Intelligence & Machine Learning',
  'Data Science & Analytics',
  'Electronics & Communication Engineering',
  'Electrical & Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Aerospace Engineering',
  'Biotechnology',
  'Chemical Engineering',
  'Computer Applications (BCA / MCA)',
  'Business Administration (BBA / MBA)',
  'Commerce (B.Com / M.Com)',
  'Economics',
  'Mathematics & Statistics',
  'Physics',
  'Chemistry',
  'Psychology',
  'Media & Communication',
  'Architecture',
  'Law',
  'Other',
];

// ── Career Goals ──────────────────────────────────────────────────────────────

const CAREER_GOALS = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Mobile App Developer (Android)',
  'Mobile App Developer (iOS)',
  'Flutter Developer',
  'Data Scientist',
  'Data Analyst',
  'Machine Learning Engineer',
  'AI / ML Researcher',
  'DevOps Engineer',
  'Cloud Engineer',
  'Cybersecurity Analyst',
  'UI / UX Designer',
  'Product Manager',
  'Business Analyst',
  'Software Engineer',
  'Embedded Systems Engineer',
  'Blockchain Developer',
  'Game Developer',
  'Database Administrator',
  'Site Reliability Engineer (SRE)',
  'QA / Test Engineer',
  'Technical Writer',
  'IT Consultant',
  'Network Engineer',
  'AR / VR Developer',
  'Research Scientist',
  'Other',
];

// ── Skills Chip List ──────────────────────────────────────────────────────────

const SKILLS_LIST = [
  // Languages
  'Python', 'Java', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#',
  'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'R',
  // Web Frontend
  'HTML', 'CSS', 'React', 'Angular', 'Vue.js', 'Next.js', 'Tailwind CSS', 'Bootstrap',
  // Web Backend
  'Node.js', 'Express.js', 'Django', 'Flask', 'FastAPI', 'Spring Boot',
  // Mobile
  'Flutter', 'React Native',
  // Database
  'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Firebase',
  // Cloud & DevOps
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Linux', 'Git & GitHub', 'CI/CD',
  // AI / Data
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch',
  'Data Analysis', 'Pandas', 'NumPy', 'Power BI', 'Tableau',
  // Design & Tools
  'Figma', 'Photoshop', 'Excel',
  // Soft Skills
  'Communication', 'Leadership', 'Teamwork', 'Problem Solving',
];

// ── Shared class helpers ──────────────────────────────────────────────────────

const selectClass =
  'mt-1 block w-full px-3 py-2 border border-slate-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm';

const inputClass =
  'mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm';

// ─────────────────────────────────────────────────────────────────────────────

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const { user, completeOnboarding } = useAuth();
  const { saveProfileProfile } = useAppData();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Student fields
    educationLevel: 'Undergraduate',
    collegeName: '',
    department: '',
    currentYear: '3',
    careerGoal: '',
    knownSkills: [],          // ← array of selected skill strings
    // Recruiter fields
    companyName: '',
    industry: 'Technology',
    targetRoles: [],
    // College admin fields
    institutionName: '',
    institutionType: 'University',
    studentCount: '',
    collegeDepartments: [],
  });

  // Toggle a skill chip on / off
  const toggleSkill = (skill) => {
    setFormData((prev) => {
      const current = prev.knownSkills;
      return {
        ...prev,
        knownSkills: current.includes(skill)
          ? current.filter((s) => s !== skill)
          : [...current, skill],
      };
    });
  };

  const toggleTargetRole = (role) => {
    setFormData((prev) => {
      const current = Array.isArray(prev.targetRoles) ? prev.targetRoles : [];
      return {
        ...prev,
        targetRoles: current.includes(role)
          ? current.filter((r) => r !== role)
          : [...current, role],
      };
    });
  };

  const toggleCollegeDepartment = (dept) => {
    setFormData((prev) => {
      const current = Array.isArray(prev.collegeDepartments) ? prev.collegeDepartments : [];
      return {
        ...prev,
        collegeDepartments: current.includes(dept)
          ? current.filter((d) => d !== dept)
          : [...current, dept],
      };
    });
  };

  // When education level changes, reset institution & department
  const handleEducationChange = (level) => {
    setFormData((prev) => ({
      ...prev,
      educationLevel: level,
      collegeName: '',
      department: '',
    }));
  };

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  useEffect(() => {
    if (user && !user.needsOnboarding) {
      const fetchProfile = async () => {
        try {
          const token = localStorage.getItem('skillsync_token');
          const response = await fetch('http://localhost:8000/api/users/me/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();
            setFormData((prev) => ({
              ...prev,
              ...(data.education || {}),
              ...(data.preferences || {}),
              // Re-hydrate saved skills as an array
              knownSkills: data.skills ? data.skills.map((s) => s.name) : [],
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
      const token = localStorage.getItem('skillsync_token');
      const isUpdating = user && !user.needsOnboarding;
      const method = isUpdating ? 'PUT' : 'POST';
      let url = '';
      let payload = {};

      if (user?.role === 'recruiter') {
        payload = {
          company_name: formData.companyName,
          industry: formData.industry,
          target_roles: Array.isArray(formData.targetRoles) ? formData.targetRoles.join(', ') : formData.targetRoles,
          required_skills: Array.isArray(formData.knownSkills) ? formData.knownSkills : formData.knownSkills.split(',').map(s=>s.trim()).filter(Boolean),
          logo_path: formData.resume_path,
        };
        url = isUpdating
          ? 'http://localhost:8000/api/users/me/recruiter-profile'
          : 'http://localhost:8000/api/users/me/recruiter-onboarding';
      } else if (user?.role === 'college') {
        payload = {
          institution_name: formData.institutionName,
          institution_type: formData.institutionType,
          student_count: parseInt(formData.studentCount, 10) || 0,
          departments: Array.isArray(formData.collegeDepartments) ? formData.collegeDepartments.join(', ') : formData.collegeDepartments,
          logo_path: formData.resume_path,
        };
        url = isUpdating
          ? 'http://localhost:8000/api/users/me/college-profile'
          : 'http://localhost:8000/api/users/me/college-onboarding';
      } else {
        // knownSkills is an array — convert to [{name, level}] for backend
        const skillsList = formData.knownSkills
          .map((name) => ({ name: name.trim(), level: 'Beginner' }))
          .filter((s) => s.name);

        payload = {
          skills: skillsList,
          education: {
            educationLevel: formData.educationLevel,
            collegeName: formData.collegeName,
            department: formData.department,
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
          resume_path: formData.resume_path,
        };
        url = isUpdating
          ? 'http://localhost:8000/api/users/me/profile'
          : 'http://localhost:8000/api/users/me/onboarding';
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save profile');
      }

      await completeOnboarding();
      if (user?.role === 'recruiter') {
        navigate('/recruiter-dashboard');
      } else if (user?.role === 'college') {
        navigate('/college-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // ── Student Steps ─────────────────────────────────────────────────────────

  const renderStudentSteps = () => {
    const eduLevel = formData.educationLevel;
    const isHighSchool = eduLevel === 'High School';

    if (step === 1) {
      const institutionList = isHighSchool ? HIGH_SCHOOLS : COLLEGES;
      const streamList = isHighSchool ? HIGH_SCHOOL_STREAMS : COLLEGE_DEPARTMENTS;
      const institutionLabel = isHighSchool ? 'School Name' : 'College / University';
      const streamLabel = isHighSchool ? 'Stream' : 'Department';

      return (
        <div className="space-y-5">
          {/* Education Level */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Education Level</label>
            <select
              value={eduLevel}
              onChange={(e) => handleEducationChange(e.target.value)}
              className={selectClass}
            >
              <option value="Undergraduate">Undergraduate</option>
              <option value="Postgraduate">Postgraduate</option>
              <option value="High School">High School</option>
            </select>
          </div>

          {/* Institution Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700">{institutionLabel}</label>
            <select
              value={formData.collegeName}
              onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
              className={selectClass}
            >
              <option value="">— Select {institutionLabel} —</option>
              {institutionList.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          {/* Stream / Department */}
          <div>
            <label className="block text-sm font-medium text-slate-700">{streamLabel}</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className={selectClass}
            >
              <option value="">— Select {streamLabel} —</option>
              {streamList.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="space-y-5">
          {/* Career Goal — dropdown */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Career Goal</label>
            <select
              value={formData.careerGoal}
              onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
              className={selectClass}
            >
              <option value="">— Select Target Role —</option>
              {CAREER_GOALS.map((goal) => (
                <option key={goal} value={goal}>{goal}</option>
              ))}
            </select>
          </div>

          {/* Known Skills — chip picker */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Current Known Skills
              <span className="ml-2 text-xs font-normal text-slate-400">
                ({formData.knownSkills.length} selected — click to toggle)
              </span>
            </label>
            <div className="border border-slate-200 rounded-xl bg-slate-50 p-3 max-h-52 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {SKILLS_LIST.map((skill) => {
                  const selected = formData.knownSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150 ${
                        selected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400 hover:text-blue-600'
                      }`}
                    >
                      {selected && <span className="mr-1">✓</span>}
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>
            {formData.knownSkills.length > 0 && (
              <p className="mt-2 text-xs text-slate-500">
                Selected: <span className="font-medium text-slate-700">{formData.knownSkills.join(', ')}</span>
              </p>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  // ── Recruiter Steps ───────────────────────────────────────────────────────

  const renderRecruiterSteps = () => {
    if (step === 1) return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Company Name</label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Industry</label>
          <select
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            className={selectClass}
          >
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
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Hiring Needs (Target Roles)
            <span className="ml-2 text-xs font-normal text-slate-400">
              ({Array.isArray(formData.targetRoles) ? formData.targetRoles.length : 0} selected)
            </span>
          </label>
          <div className="border border-slate-200 rounded-xl bg-slate-50 p-3 max-h-40 overflow-y-auto">
            <div className="flex flex-wrap gap-2">
              {CAREER_GOALS.map((goal) => {
                const selected = Array.isArray(formData.targetRoles) && formData.targetRoles.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleTargetRole(goal)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150 ${
                      selected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400 hover:text-blue-600'
                    }`}
                  >
                    {selected && <span className="mr-1">✓</span>}
                    {goal}
                  </button>
                );
              })}
            </div>
          </div>
          {Array.isArray(formData.targetRoles) && formData.targetRoles.length > 0 && (
            <p className="mt-2 text-xs text-slate-500">
              Selected: <span className="font-medium text-slate-700">{formData.targetRoles.join(', ')}</span>
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Required Skills
            <span className="ml-2 text-xs font-normal text-slate-400">
              ({formData.knownSkills.length} selected — click to toggle)
            </span>
          </label>
          <div className="border border-slate-200 rounded-xl bg-slate-50 p-3 max-h-52 overflow-y-auto">
            <div className="flex flex-wrap gap-2">
              {SKILLS_LIST.map((skill) => {
                const selected = formData.knownSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150 ${
                      selected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400 hover:text-blue-600'
                    }`}
                  >
                    {selected && <span className="mr-1">✓</span>}
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>
          {formData.knownSkills.length > 0 && (
            <p className="mt-2 text-xs text-slate-500">
              Selected: <span className="font-medium text-slate-700">{formData.knownSkills.join(', ')}</span>
            </p>
          )}
        </div>
      </div>
    );

    return null;
  };

  // ── College Admin Steps ───────────────────────────────────────────────────

  const renderCollegeSteps = () => {
    if (step === 1) return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Institution Name</label>
          <select
            value={formData.institutionName}
            onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
            className={selectClass}
          >
            <option value="">— Select Institution —</option>
            {COLLEGES.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Institution Type</label>
          <select
            value={formData.institutionType}
            onChange={(e) => setFormData({ ...formData, institutionType: e.target.value })}
            className={selectClass}
          >
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
          <input
            type="number"
            placeholder="e.g. 5000"
            value={formData.studentCount}
            onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Top Departments / Streams
            <span className="ml-2 text-xs font-normal text-slate-400">
              ({Array.isArray(formData.collegeDepartments) ? formData.collegeDepartments.length : 0} selected)
            </span>
          </label>
          <div className="border border-slate-200 rounded-xl bg-slate-50 p-3 max-h-40 overflow-y-auto">
            <div className="flex flex-wrap gap-2">
              {COLLEGE_DEPARTMENTS.map((dept) => {
                const selected = Array.isArray(formData.collegeDepartments) && formData.collegeDepartments.includes(dept);
                return (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => toggleCollegeDepartment(dept)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150 ${
                      selected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400 hover:text-blue-600'
                    }`}
                  >
                    {selected && <span className="mr-1">✓</span>}
                    {dept}
                  </button>
                );
              })}
            </div>
          </div>
          {Array.isArray(formData.collegeDepartments) && formData.collegeDepartments.length > 0 && (
            <p className="mt-2 text-xs text-slate-500">
              Selected: <span className="font-medium text-slate-700">{formData.collegeDepartments.join(', ')}</span>
            </p>
          )}
        </div>
      </div>
    );

    return null;
  };

  // ── File Upload (Step 3) ──────────────────────────────────────────────────

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataObj = new FormData();
    formDataObj.append('file', file);

    try {
      const token = localStorage.getItem('skillsync_token');
      const response = await fetch('http://localhost:8000/api/users/me/resume', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataObj,
      });
      if (response.ok) {
        const data = await response.json();
        if (data.skills && data.skills.length > 0) {
          const newSkillNames = data.skills.map((s) => s.name);
          setFormData((prev) => ({
            ...prev,
            // Merge extracted skills with already-selected chips (no duplicates)
            knownSkills: [...new Set([...prev.knownSkills, ...newSkillNames])],
            resume_path: data.resume_path,
          }));
        } else {
          setFormData((prev) => ({ ...prev, resume_path: data.resume_path }));
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
      student: 'Upload Resume (Optional)',
      recruiter: 'Upload Company Logo / Guidelines (Optional)',
      college: 'Upload Institutional Accreditation / Logo (Optional)',
    };

    return (
      <div className="space-y-4 text-center">
        <div className="p-6 bg-blue-50 border border-blue-100 rounded-lg">
          <h3 className="font-bold text-blue-800 mb-2">
            {roleBasedText[user?.role] || roleBasedText.student}
          </h3>
          <p className="text-sm text-blue-600 mb-4">Let our AI extract details automatically.</p>
          <input
            type="file"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx"
            className="text-sm mx-auto"
          />
          {formData.resume_path && (
            <p className="text-green-600 text-sm mt-2">File uploaded successfully!</p>
          )}
        </div>
        <p className="text-slate-500 text-sm mt-4">You're all set! Let's generate your dashboard.</p>
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────

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
            <button
              onClick={handlePrev}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
            >
              Back
            </button>
          ) : (
            <div />
          )}
          {step < 3 ? (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700"
            >
              Complete &amp; Connect
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
