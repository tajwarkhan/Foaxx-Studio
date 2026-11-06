import React, { useState, useEffect } from 'react';
import {
  Lock,
  Mail,
  Phone,
  User,
  X,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, setUser, openAuth, showToast, setCurrentView } = useStore();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [method, setMethod] = useState<'email' | 'phone'>('email');

  // Fields
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');

  // Phone OTP
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(30);
  const [demoOtp, setDemoOtp] = useState('4826');

  useEffect(() => {
    let interval: any = null;
    if (otpSent && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, otpTimer]);

  if (!isAuthModalOpen) return null;

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    if (!password || password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    const userName = name.trim() || email.split('@')[0];
    setUser({
      name: userName.charAt(0).toUpperCase() + userName.slice(1),
      email: email.trim(),
      phone: phone.trim() || '+91 98765 43210',
    });
    setIsAuthModalOpen(false);
    showToast(mode === 'login' ? `Welcome back, ${userName}!` : `Welcome to FOAXX, ${userName}!`);
  };

  const handleSendPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      showToast('Please enter a valid 10-digit phone number', 'error');
      return;
    }
    const generated = Math.floor(1000 + Math.random() * 9000).toString();
    setDemoOtp(generated);
    setOtpSent(true);
    setOtpTimer(30);
    showToast(`Demo code sent to +91 ${cleanPhone.slice(-10)} (Code: ${generated})`);
  };

  const handleVerifyPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpCode.join('');
    if (code.length < 4) {
      showToast('Please enter the 4-digit OTP', 'error');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    const userName = name.trim() || `Muse ${cleanPhone.slice(-4)}`;
    setUser({
      name: userName,
      email: `${cleanPhone.slice(-10)}@mobile.foaxx.com`,
      phone: `+91 ${cleanPhone.slice(-10)}`,
    });
    setIsAuthModalOpen(false);
    showToast(`Signed in successfully as ${userName}!`);
  };

  const handleGoogleSignIn = () => {
    setUser({
      name: name.trim() || 'Priya Sharma',
      email: email.trim() || 'priya.sharma@gmail.com',
      phone: phone.trim() || '+91 98765 43210',
    });
    setIsAuthModalOpen(false);
    showToast('Signed in securely with Google');
  };

  const switchToFullPage = () => {
    setIsAuthModalOpen(false);
    openAuth(mode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-stone-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 p-1 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand header */}
        <div className="text-center pb-3">
          <span className="font-serif-luxury text-2xl tracking-[0.25em] text-stone-900 block font-normal">
            FOAXX
          </span>
          <span className="text-[8px] tracking-[0.35em] text-[#E07A5F] uppercase font-bold">
            MEMBER AUTHENTICATION
          </span>
        </div>

        {/* Tab switch: Sign In vs Create Account */}
        <div className="flex border-b border-stone-200 text-xs font-semibold mb-4">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 pb-2.5 transition-colors border-b-2 cursor-pointer ${
              mode === 'login'
                ? 'border-[#E07A5F] text-stone-900'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 pb-2.5 transition-colors border-b-2 cursor-pointer ${
              mode === 'signup'
                ? 'border-[#E07A5F] text-stone-900'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Create Account (10% Off)
          </button>
        </div>

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors text-xs font-semibold text-stone-700 cursor-pointer shadow-2xs"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Gmail / Google</span>
        </button>

        {/* Method switcher */}
        <div className="flex items-center justify-center my-3">
          <div className="flex bg-stone-100 rounded-lg p-1 text-[11px] font-medium border border-stone-200">
            <button
              type="button"
              onClick={() => setMethod('email')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                method === 'email' ? 'bg-white shadow-xs text-stone-900 font-semibold' : 'text-stone-500'
              }`}
            >
              <Mail className="w-3 h-3" />
              <span>Email & Password</span>
            </button>
            <button
              type="button"
              onClick={() => setMethod('phone')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                method === 'phone' ? 'bg-white shadow-xs text-stone-900 font-semibold' : 'text-stone-500'
              }`}
            >
              <Phone className="w-3 h-3" />
              <span>Phone OTP</span>
            </button>
          </div>
        </div>

        {/* Email form */}
        {method === 'email' && (
          <form onSubmit={handleEmailAuth} className="space-y-3 text-xs">
            {mode === 'signup' && (
              <div>
                <label className="block text-stone-600 font-medium mb-1">Your Full Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Radhika Kapoor"
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-9 pr-3 py-2 text-xs focus:border-[#E07A5F] focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-stone-600 font-medium mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-9 pr-3 py-2 text-xs focus:border-[#E07A5F] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-600 font-medium mb-1">Password</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-9 pr-9 py-2 text-xs focus:border-[#E07A5F] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-stone-900 hover:bg-black text-white font-semibold py-2.5 rounded-lg transition-colors uppercase tracking-wider text-xs mt-2 cursor-pointer shadow-xs"
            >
              {mode === 'login' ? 'Sign In' : 'Create Free Account'}
            </button>
          </form>
        )}

        {/* Phone form */}
        {method === 'phone' && (
          <div className="space-y-3 text-xs">
            {!otpSent ? (
              <form onSubmit={handleSendPhoneOtp} className="space-y-3">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Your Full Name</label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Radhika Kapoor"
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-9 pr-3 py-2 text-xs focus:border-[#E07A5F] focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-stone-600 font-medium mb-1">Mobile Phone Number</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-stone-300 bg-stone-100 text-stone-600 text-xs font-medium">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="98765 43210"
                      className="flex-1 bg-stone-50 border border-stone-300 rounded-r-lg px-3 py-2 text-xs focus:border-[#E07A5F] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-stone-900 hover:bg-black text-white font-semibold py-2.5 rounded-lg transition-colors uppercase tracking-wider text-xs mt-2 cursor-pointer"
                >
                  Send OTP Code
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyPhoneOtp} className="space-y-3">
                <div className="text-center text-xs text-stone-500">
                  Enter 4-digit code sent to +91 {phone.slice(-10)}
                </div>

                <div className="flex justify-center gap-2">
                  {otpCode.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`modal-otp-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const clean = e.target.value.replace(/\D/g, '').slice(-1);
                        const copy = [...otpCode];
                        copy[idx] = clean;
                        setOtpCode(copy);
                        if (clean && idx < 3) {
                          document.getElementById(`modal-otp-${idx + 1}`)?.focus();
                        }
                      }}
                      className="w-10 h-10 text-center text-base font-bold bg-stone-50 border border-stone-300 rounded-lg focus:border-[#E07A5F] focus:outline-none"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpCode(demoOtp.split(''));
                      showToast(`Autofilled demo code: ${demoOtp}`);
                    }}
                    className="text-[#E07A5F] hover:underline cursor-pointer flex items-center gap-0.5"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Autofill ({demoOtp})</span>
                  </button>

                  {otpTimer > 0 ? (
                    <span>Resend in {otpTimer}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
                        setDemoOtp(newOtp);
                        setOtpTimer(30);
                        showToast(`New OTP: ${newOtp}`);
                      }}
                      className="text-stone-700 hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Resend</span>
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-stone-900 hover:bg-black text-white font-semibold py-2.5 rounded-lg transition-colors uppercase tracking-wider text-xs mt-2 cursor-pointer"
                >
                  Verify & Sign In
                </button>
              </form>
            )}
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px]">
          <button
            type="button"
            onClick={switchToFullPage}
            className="text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Open Dedicated Auth Page</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAuthModalOpen(false);
              setCurrentView('manager');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-amber-700 hover:text-amber-900 font-bold cursor-pointer"
          >
            Manager Portal →
          </button>
        </div>
      </div>
    </div>
  );
};
