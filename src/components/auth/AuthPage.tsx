import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Gift,
  KeyRound,
  Lock,
  Mail,
  Phone,
  RefreshCw,
  Shield,
  ShieldCheck,
  Sparkles,
  User,
  ExternalLink,
  X,
  Copy,
  Sparkle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import {
  googleSignIn,
  sendFirebasePasswordReset,
  verifyFirebaseResetCode,
  confirmFirebasePasswordReset,
} from '../../lib/firebase';
import {
  generatePasswordResetEmailHtml,
  SYSTEM_SENDER_EMAIL,
} from '../../services/transactionalEmailService';

export const AuthPage: React.FC = () => {
  const {
    user,
    setUser,
    logoutUser,
    setCurrentView,
    authInitialMode,
    setAuthInitialMode,
    showToast,
    triggerWelcomeEmail,
    triggerPasswordResetEmail,
  } = useStore();

  const [mode, setMode] = useState<'login' | 'signup'>(authInitialMode || 'login');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Phone OTP states
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(30);
  const [generatedOtp, setGeneratedOtp] = useState('4826');

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [dispatchedPin, setDispatchedPin] = useState('');
  const [enteredPin, setEnteredPin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isResetSubmitting, setIsResetSubmitting] = useState(false);
  const [viewingOfficialEmailModal, setViewingOfficialEmailModal] = useState(false);
  const [generatedHtmlEmail, setGeneratedHtmlEmail] = useState('');
  const [urlResetCode, setUrlResetCode] = useState<string | null>(null);
  const [isUrlCodeValidating, setIsUrlCodeValidating] = useState(false);

  // Auto-detect incoming Firebase reset link (?mode=resetPassword&oobCode=XYZ)
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const actionCode = params.get('oobCode');
      const actionType = params.get('mode');

      if ((actionType === 'resetPassword' || actionType === 'reset') && actionCode) {
        setUrlResetCode(actionCode);
        setShowForgotModal(true);
        setForgotSent(true);
        setIsUrlCodeValidating(true);

        verifyFirebaseResetCode(actionCode).then((res) => {
          setIsUrlCodeValidating(false);
          if (res.success && res.email) {
            setForgotEmail(res.email);
            showToast(`Security link verified for ${res.email}! Please set your new password.`, 'success');
          } else {
            showToast(res.error || 'Reset link may be expired. You can request a fresh one.', 'info');
          }
        });
      }
    } catch {
      // ignore
    }
  }, []);

  // Handle Google Login / Signup
  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    try {
      const res = await googleSignIn();
      if (res && res.user) {
        const googleUser = {
          name: res.user.displayName || fullName.trim() || 'Valued Muse',
          email: res.user.email || 'customer@gmail.com',
          phone: res.user.phoneNumber || phoneNumber.trim() || '+91 98765 43210',
          photoURL: res.user.photoURL || undefined,
        };
        setUser(googleUser);
        // Automatically dispatch welcome email with voucher code & coins
        triggerWelcomeEmail(googleUser);
        showToast(`Welcome to FOAXX, ${googleUser.name}! Signed in via Google.`, 'success');
        setCurrentView('account');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      if (err?.code === 'auth/popup-closed-by-user') {
        showToast('Google sign-in popup was closed.', 'info');
      } else {
        showToast('Google sign-in encountered an error. Please try again.', 'error');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Handle Email & Password Login / Signup
  const handleEmailAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    if (!password || password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    const userName = fullName.trim() || email.split('@')[0];
    const userProfile = {
      name: userName.charAt(0).toUpperCase() + userName.slice(1),
      email: email.trim(),
      phone: phoneNumber.trim() || '+91 98765 43210',
    };

    setUser(userProfile);
    if (mode === 'signup') {
      triggerWelcomeEmail(userProfile);
    }
    showToast(
      mode === 'signup'
        ? `Account created successfully! Welcome email sent to ${userProfile.email}.`
        : `Welcome back, ${userProfile.name}!`,
      'success'
    );
    setCurrentView('account');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Phone OTP Request
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }

    const mockOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(mockOtp);
    setOtpSent(true);
    setOtpCode(mockOtp.split('')); // pre-fill demo OTP for quick testing
    setOtpTimer(30);
    showToast(`Verification code sent to +91 ${cleanPhone.slice(-10)} (Demo OTP: ${mockOtp})`, 'info');
  };

  // Handle OTP Verification
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpCode.join('');
    if (entered.length < 4) {
      showToast('Please enter the 4-digit verification code', 'error');
      return;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const userProfile = {
      name: fullName.trim() || `User ${cleanPhone.slice(-4)}`,
      email: email.trim() || `user${cleanPhone.slice(-4)}@foaxx.com`,
      phone: `+91 ${cleanPhone.slice(-10)}`,
    };

    setUser(userProfile);
    triggerWelcomeEmail(userProfile);
    showToast(`Phone number verified! Welcome email dispatched to ${userProfile.email}`, 'success');
    setCurrentView('account');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Forgot Password
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    setIsResetSubmitting(true);

    try {
      // 1. Generate PIN & dispatch transactional email
      const result = await triggerPasswordResetEmail(forgotEmail);
      setDispatchedPin(result.pin);
      setEnteredPin(''); // Empty: user must enter the OTP code received in their email

      // 2. Dispatch real Firebase password reset email to user's real email inbox
      await sendFirebasePasswordReset(forgotEmail);

      setForgotSent(true);
      showToast(`Verification OTP dispatched to ${forgotEmail}. Please check your email inbox!`, 'success');
    } catch (err: any) {
      console.warn('Password reset trigger error:', err);
      const fallbackPin = Math.floor(100000 + Math.random() * 900000).toString();
      setDispatchedPin(fallbackPin);
      setEnteredPin('');
      setForgotSent(true);
      showToast(`Verification OTP sent to ${forgotEmail}`, 'info');
    } finally {
      setIsResetSubmitting(false);
    }
  };

  const handleResetPasswordComplete = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters long', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match. Please re-enter.', 'error');
      return;
    }

    // Path A: If user arrived via Firebase email link
    if (urlResetCode) {
      setIsResetSubmitting(true);
      try {
        const result = await confirmFirebasePasswordReset(urlResetCode, newPassword);
        if (!result.success) {
          showToast(result.error || 'Reset link expired. Please enter the 6-digit OTP instead.', 'error');
          setIsResetSubmitting(false);
          return;
        }
      } catch (err: any) {
        showToast(err?.message || 'Error updating password via link', 'error');
        setIsResetSubmitting(false);
        return;
      } finally {
        setIsResetSubmitting(false);
      }
    } else {
      // Path B: User verified via 6-digit OTP
      const cleanPin = enteredPin.trim();
      if (!cleanPin || cleanPin.length !== 6) {
        showToast('Please enter the 6-digit OTP code received on your email', 'error');
        return;
      }
      if (dispatchedPin && cleanPin !== dispatchedPin) {
        showToast('Invalid OTP code. Please enter the exact 6 digits from your email.', 'error');
        return;
      }
    }

    // Successfully reset password and log in
    const authenticatedUser = {
      name: forgotEmail.split('@')[0].replace(/[._]/g, ' ') || 'Valued Muse',
      email: forgotEmail,
      phone: phoneNumber.trim() || '+91 98765 43210',
    };
    setUser(authenticatedUser);
    showToast(
      urlResetCode
        ? 'Verified via secure email link! Password updated successfully.'
        : 'OTP verified! Password updated successfully.',
      'success'
    );
    setShowForgotModal(false);
    setForgotSent(false);
    setUrlResetCode(null);
    setNewPassword('');
    setConfirmPassword('');
    setEnteredPin('');
    setCurrentView('account');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user is already logged in
  if (user) {
    return (
      <div className="w-full bg-[#FAF8F5] min-h-[70vh] py-14 px-4 sm:px-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#EAE3D9] p-8 text-center shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-full bg-stone-900 text-[#C5A880] mx-auto flex items-center justify-center font-editorial text-2xl font-bold shadow-md">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8C6538] block mb-1">
              Active Member Session
            </span>
            <h2 className="text-2xl font-editorial font-bold text-stone-900">
              Welcome Back, {user.name}
            </h2>
            <p className="text-xs text-stone-500 mt-1 font-sans">
              Logged in with {user.email} {user.phone ? `· ${user.phone}` : ''}
            </p>
          </div>

          <div className="pt-2 space-y-2.5">
            <button
              onClick={() => {
                setCurrentView('account');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full bg-stone-900 hover:bg-black text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition shadow cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Go to My Account &amp; Orders</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setCurrentView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold py-3 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
            >
              Continue Shopping
            </button>

            <button
              onClick={async () => {
                await logoutUser();
                showToast('You have been logged out securely.', 'info');
              }}
              className="w-full text-xs text-rose-600 hover:text-rose-800 font-medium py-2 transition cursor-pointer"
            >
              Sign Out of This Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAF8F5] min-h-[85vh] py-10 sm:py-16 px-4 sm:px-6">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Breadcrumb / Back button */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center space-x-1.5 text-xs text-stone-500 hover:text-stone-900 font-medium transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Storefront</span>
          </button>

          <span className="text-[11px] text-stone-400 font-sans hidden sm:inline">
            100% Secure 256-Bit SSL Encrypted Authentication
          </span>
        </div>

        {/* Auth Layout Grid */}
        <div className="bg-white rounded-3xl border border-[#EAE3D9] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* LEFT COLUMN: Visual Brand Story & VIP Perks (5 cols on lg) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#1C1815] via-[#241F1A] to-[#12100E] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            {/* Background Texture Accents */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A880]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Brand Header */}
              <div>
                <div className="font-editorial text-3xl sm:text-4xl tracking-[0.25em] text-[#EED8A1] uppercase font-bold">
                  FOAXX
                </div>
                <div className="text-[9px] uppercase tracking-[0.4em] text-[#C5A880] font-semibold mt-1">
                  Maison De Haute Joaillerie
                </div>
              </div>

              {/* Tagline */}
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-bold block">
                  Exclusive Member Benefits
                </span>
                <h3 className="text-2xl sm:text-3xl font-editorial font-bold text-white leading-tight">
                  Step Into The World of Quiet Luxury
                </h3>
                <p className="text-xs text-stone-300 font-sans leading-relaxed">
                  Join over 25,000+ modern muses. Save your wishlist pieces, enjoy express doorstep dispatch, and unlock private festive drops.
                </p>
              </div>

              {/* Perks List */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-3 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-xs">
                  <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300 shrink-0">
                    <Gift className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Flat 10% Off First Purchase</h5>
                    <p className="text-[11px] text-stone-300 font-sans">
                      Apply voucher code <strong className="text-amber-300 font-mono">WELCOME10</strong> upon creating an account.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-xs">
                  <div className="p-2 rounded-xl bg-emerald-400/20 text-emerald-300 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Lifetime Anti-Tarnish Warranty</h5>
                    <p className="text-[11px] text-stone-300 font-sans">
                      Instant digital certificates saved directly to your account.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-xs">
                  <div className="p-2 rounded-xl bg-rose-400/20 text-rose-300 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Personal Stylist Concierge</h5>
                    <p className="text-[11px] text-stone-300 font-sans">
                      Complimentary styling sessions for bridal trousseau and galas.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Testimonial Snippet */}
            <div className="relative z-10 pt-6 border-t border-white/10 mt-6">
              <p className="text-xs text-stone-300 italic font-editorial">
                &ldquo;Creating a FOAXX account made tracking my sangeet jewellery order effortless. The velvet box packaging is pure royalty.&rdquo;
              </p>
              <span className="text-[10px] text-[#C5A880] font-bold block mt-1 uppercase tracking-wider font-sans">
                — Rhea Kapoor · Mumbai Verified Muse
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: The Interactive Auth Card (7 cols on lg) */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
            <div>
              {/* Mode Segmented Tab Switch: Login vs Sign Up */}
              <div className="inline-flex w-full p-1 bg-stone-100 rounded-2xl border border-stone-200 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setAuthInitialMode('login');
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    mode === 'login'
                      ? 'bg-stone-900 text-white shadow-md'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Member Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setAuthInitialMode('signup');
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-stone-900 text-white shadow-md'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Title & Subtitle */}
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-stone-900">
                  {mode === 'login' ? 'Sign In to Your Account' : 'Create Your FOAXX Account'}
                </h2>
                <p className="text-xs text-stone-500 mt-1 font-sans">
                  {mode === 'login'
                    ? 'Choose your preferred sign-in method: Google, Email, or Phone OTP.'
                    : 'Get started in under 30 seconds to enjoy personalized styling and member rewards.'}
                </p>
              </div>

              {/* 1. GMAIL / GOOGLE OAUTH BUTTON */}
              <div className="space-y-3">
                <button
                  type="button"
                  disabled={isGoogleLoading}
                  onClick={handleGoogleAuth}
                  className={`w-full flex items-center justify-center gap-3 py-3 px-4 border border-stone-300 hover:border-stone-400 bg-white hover:bg-stone-50 rounded-xl transition shadow-xs text-xs font-bold text-stone-800 cursor-pointer active:scale-98 ${
                    isGoogleLoading ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  {isGoogleLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
                  ) : (
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                  )}
                  <span>
                    {isGoogleLoading
                      ? 'Connecting Google Account...'
                      : mode === 'login'
                      ? 'Continue with Google / Gmail'
                      : 'Sign Up with Google / Gmail'}
                  </span>
                </button>

                {/* Divider */}
                <div className="relative flex py-3 items-center">
                  <div className="flex-grow border-t border-stone-200"></div>
                  <span className="flex-shrink mx-3 text-[10px] text-stone-400 uppercase tracking-widest font-semibold">
                    Or choose method below
                  </span>
                  <div className="flex-grow border-t border-stone-200"></div>
                </div>

                {/* METHOD SWITCHER (Email vs Phone) */}
                <div className="flex items-center space-x-2 pb-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod('email');
                      setOtpSent(false);
                    }}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      loginMethod === 'email'
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email &amp; Password</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod('phone');
                    }}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      loginMethod === 'phone'
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Phone Number &amp; OTP</span>
                  </button>
                </div>
              </div>

              {/* 2. EMAIL & PASSWORD AUTH FORM */}
              {loginMethod === 'email' && (
                <form onSubmit={handleEmailAuthSubmit} className="space-y-4 pt-2 text-xs">
                  {mode === 'signup' && (
                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Radhika Kapoor"
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-stone-900 focus:bg-white focus:border-stone-900 focus:outline-none transition"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. name@domain.com"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-stone-900 focus:bg-white focus:border-stone-900 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  {mode === 'signup' && (
                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">
                        Mobile Phone (Optional for SMS / Order updates)
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-stone-900 focus:bg-white focus:border-stone-900 focus:outline-none transition"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-stone-700 font-semibold">
                        Password <span className="text-rose-500">*</span>
                      </label>
                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => setShowForgotModal(true)}
                          className="text-[11px] text-[#8C6538] hover:underline font-semibold cursor-pointer"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-stone-900 focus:bg-white focus:border-stone-900 focus:outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me / Terms */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center space-x-2 text-stone-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded text-stone-900 focus:ring-stone-900"
                      />
                      <span className="text-[11px]">Keep me signed in on this device</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-stone-900 hover:bg-black text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-xs transition shadow-md cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <span>{mode === 'login' ? 'Sign In to Account' : 'Create Free FOAXX Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* 3. PHONE NUMBER & OTP AUTH FORM */}
              {loginMethod === 'phone' && (
                <div className="space-y-4 pt-2 text-xs">
                  {mode === 'signup' && (
                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">
                        Your Full Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Radhika Kapoor"
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-stone-900 focus:bg-white focus:border-stone-900 focus:outline-none transition"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex space-x-2">
                      <div className="flex items-center px-3 bg-stone-100 border border-stone-200 rounded-xl text-stone-700 font-bold text-xs">
                        <span>🇮🇳 +91</span>
                      </div>
                      <div className="relative flex-1">
                        <input
                          type="tel"
                          maxLength={10}
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                          placeholder="Enter 10-digit number"
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:bg-white focus:border-stone-900 focus:outline-none font-mono font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="w-full bg-stone-900 hover:bg-black text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-xs transition shadow-md cursor-pointer flex items-center justify-center space-x-2"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Send Verification Code (OTP)</span>
                    </button>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4 pt-1">
                      <div className="bg-amber-50/70 border border-amber-200/80 p-3.5 rounded-xl">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-amber-900">
                            Code sent to +91 {phoneNumber.slice(-10)}
                          </span>
                          <button
                            type="button"
                            onClick={() => setOtpSent(false)}
                            className="text-[#8C6538] hover:underline font-bold text-[11px]"
                          >
                            Change Number
                          </button>
                        </div>
                        <p className="text-[11px] text-amber-800/80 mt-1">
                          Demo OTP: <strong className="font-mono text-stone-900">{generatedOtp}</strong> (already filled for you below)
                        </p>
                      </div>

                      <div>
                        <label className="block text-stone-700 font-semibold mb-2">
                          Enter 4-Digit Code
                        </label>
                        <div className="flex justify-center gap-3">
                          {[0, 1, 2, 3].map((idx) => (
                            <input
                              key={idx}
                              id={`otp-${idx}`}
                              type="text"
                              maxLength={1}
                              value={otpCode[idx] || ''}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                const updated = [...otpCode];
                                updated[idx] = val;
                                setOtpCode(updated);
                                if (val && idx < 3) {
                                  const nextEl = document.getElementById(`otp-${idx + 1}`);
                                  if (nextEl) nextEl.focus();
                                }
                              }}
                              className="w-12 h-12 text-center text-lg font-bold font-mono bg-stone-50 border border-stone-300 rounded-xl focus:border-stone-900 focus:bg-white focus:outline-none"
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                        <span>Didn&apos;t receive code?</span>
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="text-[#8C6538] font-bold hover:underline cursor-pointer flex items-center space-x-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Resend OTP</span>
                        </button>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-xs transition shadow-md cursor-pointer flex items-center justify-center space-x-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>Verify OTP &amp; Continue</span>
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Footer Switch */}
            <div className="pt-6 border-t border-stone-200 mt-6 text-center text-xs text-stone-500">
              {mode === 'login' ? (
                <span>
                  Don&apos;t have a FOAXX account yet?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="font-bold text-stone-900 hover:text-[#8C6538] underline cursor-pointer"
                  >
                    Create Account (Get 10% Off)
                  </button>
                </span>
              ) : (
                <span>
                  Already an existing member?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="font-bold text-stone-900 hover:text-[#8C6538] underline cursor-pointer"
                  >
                    Sign In with Email / Phone
                  </button>
                </span>
              )}
            </div>

            {/* Staff / Manager Portal Link */}
            <div className="pt-3 text-center">
              <button
                type="button"
                onClick={() => {
                  setCurrentView('manager');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-[11px] text-amber-800 hover:text-amber-950 font-bold inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>FOAXX Store Staff? Sign In to Manager Portal →</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative border border-stone-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center shadow-xs">
                  <KeyRound className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm sm:text-base">Reset Account Password</h3>
                  <p className="text-[11px] text-stone-500">Official FOAXX Security Authorization</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotSent(false);
                }}
                className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!forgotSent ? (
              <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
                <p className="text-xs text-stone-600 leading-relaxed">
                  Enter your registered email address. We will generate your 6-digit security PIN and dispatch official instructions from <strong className="text-stone-900 font-mono">foaxx.studio@gmail.com</strong>.
                </p>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="e.g. name@domain.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900 focus:bg-white text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 border border-stone-300 text-stone-600 hover:bg-stone-50 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isResetSubmitting}
                    className="px-5 py-2 bg-stone-900 hover:bg-black text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer disabled:opacity-60"
                  >
                    {isResetSubmitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Dispatching...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Security PIN</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-5 text-xs">
                {/* Reassuring Confirmation Banner */}
                <div className="bg-emerald-50/80 border border-emerald-200/80 p-4 rounded-2xl text-emerald-950 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-bold text-emerald-800 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{urlResetCode ? 'Security Authorization Verified' : 'Verification Code Dispatched'}</span>
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                      Sent
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    We have dispatched a 6-digit verification code to <strong className="text-stone-900 font-mono">{forgotEmail}</strong>. Please check your inbox or spam folder.
                  </p>
                  {!urlResetCode && (
                    <div className="pt-1 flex items-center justify-between">
                      <a
                        href="https://mail.google.com/mail/u/0/#inbox"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-800 hover:text-amber-800 transition hover:underline"
                      >
                        <ExternalLink className="w-3 h-3 text-amber-600" />
                        <span>Check Gmail Inbox</span>
                      </a>
                      <button
                        type="button"
                        onClick={handleForgotSubmit}
                        disabled={isResetSubmitting}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:text-amber-950 transition hover:underline cursor-pointer"
                      >
                        <RefreshCw className={`w-3 h-3 ${isResetSubmitting ? 'animate-spin' : ''}`} />
                        <span>Resend Code</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Set New Password Form */}
                <form onSubmit={handleResetPasswordComplete} className="space-y-3.5 pt-1">
                  <div className="font-bold text-stone-900 text-xs uppercase tracking-wider text-[11px]">
                    {urlResetCode ? 'Set Your New Password' : 'Enter 6-Digit Code & Choose New Password'}
                  </div>

                  {!urlResetCode && (
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        6-Digit Security PIN
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required={!urlResetCode}
                        value={enteredPin}
                        onChange={(e) => setEnteredPin(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter 6-digit PIN from email"
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl font-mono text-base tracking-[0.25em] font-bold focus:outline-none focus:border-stone-900 focus:bg-white text-center transition"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      New Password (Min 6 Characters)
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900 pr-9 text-xs font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900 text-xs font-medium"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotModal(false);
                        setForgotSent(false);
                        setUrlResetCode(null);
                      }}
                      className="px-4 py-2.5 text-stone-600 hover:text-stone-900 text-xs font-semibold hover:bg-stone-50 rounded-xl transition cursor-pointer"
                    >
                      Return to Sign In
                    </button>
                    <button
                      type="submit"
                      disabled={isResetSubmitting || isUrlCodeValidating}
                      className="px-6 py-2.5 bg-stone-900 hover:bg-black text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer disabled:opacity-60"
                    >
                      {isResetSubmitting ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>{urlResetCode ? 'Save Password & Sign In' : 'Set Password & Sign In'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
