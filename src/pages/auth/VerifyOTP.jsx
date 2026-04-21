import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Clock, CheckCircle2 } from 'lucide-react';

export default function VerifyOTP() {
  const { verifyOTP, resendOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email') || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  
  // Countdown for the 5-second buffer (per user request)
  const [bufferCountdown, setBufferCountdown] = useState(5);
  const [bufferComplete, setBufferComplete] = useState(false);

  useEffect(() => {
    if (bufferCountdown > 0) {
      const timer = setTimeout(() => setBufferCountdown(bufferCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setBufferComplete(true);
    }
  }, [bufferCountdown]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setError('');
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter the full 6-digit code');
      return;
    }

    setLoading(true);
    try {
      await verifyOTP(email, otpValue);
      setSuccess('Email verified successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    setSuccess('');
    try {
      await resendOTP(email);
      setSuccess('A new OTP has been sent to your email.');
      setBufferCountdown(5);
      setBufferComplete(false);
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center text-blue-600 mb-4">
           <Mail className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900">Verify Your Email</h2>
        <p className="mt-2 text-sm text-slate-600">
          We've sent a 6-digit code to <span className="font-semibold text-slate-900">{email}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-slate-100">
          
          {!bufferComplete ? (
            <div className="flex flex-col items-center justify-center p-6 bg-blue-50 rounded-xl mb-6">
              <Clock className="w-8 h-8 text-blue-500 animate-pulse mb-2" />
              <p className="text-blue-700 font-medium">Sending your code...</p>
              <div className="text-2xl font-bold text-blue-600 mt-1">{bufferCountdown}s</div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-xl mb-6 border border-emerald-100">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">OTP sent! Please check your inbox.</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleVerify}>
            {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-100">{error}</div>}
            {success && <div className="text-emerald-500 text-sm text-center bg-emerald-50 p-2 rounded-lg border border-emerald-100">{success}</div>}
            
            <div className="flex justify-between gap-2">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className="w-12 h-14 text-center text-2xl font-bold border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={data}
                  onChange={e => handleChange(e.target, index)}
                  onFocus={e => e.target.select()}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || !bufferComplete}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white transition-all ${
                loading || !bufferComplete ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading || !bufferComplete}
                className={`font-semibold text-blue-600 hover:text-blue-500 ${
                  resendLoading || !bufferComplete ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {resendLoading ? 'Sending...' : 'Resend Code'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
