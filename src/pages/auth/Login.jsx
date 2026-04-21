import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Brain } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const { login } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      if (err.message.includes('not verified')) {
         setError(
           <span>
             {err.message}{' '}
             <button 
               onClick={() => navigate(`/verify-otp?email=${encodeURIComponent(email)}`)}
               className="underline font-bold"
             >
               Verify now
             </button>
           </span>
         );
      } else {
         setError(err.message || 'Login failed');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-blue-600">
           <Brain className="w-12 h-12" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">Sign in to your account</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className={`text-sm text-center p-3 rounded-xl border ${
                typeof error !== 'string' 
                ? 'bg-amber-50 text-amber-700 border-amber-100 flex flex-col items-center gap-2' 
                : 'bg-red-50 text-red-500 border-red-100'
              }`}>
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <div className="mt-1">
                <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="mt-1">
                <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </div>

            <div>
               <label className="block text-sm font-medium text-slate-700">Select Role</label>
               <select value={role} onChange={e=>setRole(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  <option value="student">Student</option>
                  <option value="college">College / University</option>
                  <option value="recruiter">Recruiter</option>
               </select>
            </div>

            <div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
