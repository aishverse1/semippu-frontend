import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePension } from '../context/PensionContext';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  Key, 
  ShieldCheck, 
  ArrowLeft, 
  Loader2, 
  AlertCircle, 
  Lock, 
  Eye, 
  EyeOff,
  User,
  Users,
  CreditCard,
  PiggyBank,
  Hourglass,
  Wallet,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function Auth() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [step, setStep] = useState<'form' | 'otp' | 'onboarding'>('form');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Member onboarding state
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({
    age: '',
    dependents: '',
    monthlyExpenses: '',
    existingSavings: '',
    yearsToRetire: '38',
    minWage: '',
    maxWage: '',
    minWorkingDays: '',
    maxWorkingDays: '',
  });
  // Admin onboarding state (org, role, branch, code)
  const [adminOnboardingStep, setAdminOnboardingStep] = useState(0);
  const [adminOnboardingData, setAdminOnboardingData] = useState({
    organisation: '',
    role: '',
    branch: '',
    code: '',
  });
  
  const { login } = usePension();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleToggleView = () => {
    setIsLoginView(!isLoginView);
    setStep('form');
    setError(null);
    setPassword('');
    setConfirmPassword('');
    setOtp('');
  };

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!/^\+?[1-9]\d{1,14}$/.test(phoneNumber)) {
      setError('Invalid phone number format');
      return;
    }

    if (password.length < 6) {
      setError(t('passwordTooShort'));
      return;
    }

    if (isLoginView) {
      // --- LOGIN FLOW ---
      setIsLoading(true);
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || t('invalidCredentials'));

        // Success - admin goes straight to dashboard, no onboarding
        localStorage.setItem('auth_token', data.token);
        const adminName = data.user.isAdmin ? `Admin ${data.user.phoneNumber.slice(-4)}` : `User ${data.user.phoneNumber.slice(-4)}`;
        login(data.user.phoneNumber, adminName, data.user.isAdmin);
        navigate('/');
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      // --- REGISTRATION FLOW (Step 1: Send OTP) ---
      if (password !== confirmPassword) {
        setError(t('passwordsDoNotMatch'));
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch('/api/auth/register-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to send OTP');

        setStep('otp');
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Connect real OTP verification later
    // Temporary bypass for development
    setIsLoading(true);
    
    // Simulate a brief delay for realistic feel
    setTimeout(() => {
      setStep('onboarding');
      setIsLoading(false);
      if (isAdmin) {
        setAdminOnboardingStep(0);
        setAdminOnboardingData({ organisation: '', role: '', branch: '', code: '' });
      } else {
        setOnboardingStep(0);
        setOnboardingData(prev => ({ ...prev, yearsToRetire: '38' }));
      }
    }, 800);
  };

  const adminOnboardingSteps = [
    { id: 'organisation', title: 'Organisation', icon: Users, description: 'What organisation do you represent?' },
    { id: 'role', title: 'Role', icon: User, description: 'What is your role?' },
    { id: 'branch', title: 'Branch', icon: CreditCard, description: 'Which branch?' },
    { id: 'code', title: 'Code', icon: PiggyBank, description: 'Branch/Employee code?' },
  ];

  const onboardingSteps = [
    { id: 'age', title: 'Age', icon: User, description: 'How old are you?' },
    { id: 'dependents', title: 'Dependents', icon: Users, description: 'How many dependents do you have?' },
    { id: 'expenses', title: 'Monthly Expenses', icon: CreditCard, description: 'What are your total monthly expenses?' },
    { id: 'savings', title: 'Existing Savings', icon: PiggyBank, description: 'How much have you saved so far?' },
    { id: 'retirement', title: 'Years to Retire', icon: Hourglass, description: 'In how many years do you plan to retire?' },
    { id: 'wage', title: 'Expected Wage', icon: Wallet, description: 'What is your expected daily wage range?' },
    { id: 'workingDays', title: 'Working Days', icon: Calendar, description: 'How many days are you willing to work per month?' },
  ];

  const handleOnboardingChange = (field: string, value: string) => {
    setOnboardingData(prev => ({ ...prev, [field]: value }));
  };

  const handleAdminOnboardingChange = (field: string, value: string) => {
    setAdminOnboardingData(prev => ({ ...prev, [field]: value }));
  };

  const handleOnboardingNext = () => {
    if (isAdmin) {
      if (adminOnboardingStep < adminOnboardingSteps.length - 1) {
        setAdminOnboardingStep(adminOnboardingStep + 1);
      } else {
        const profileData = {
          organisation: adminOnboardingData.organisation,
          role: adminOnboardingData.role,
          branch: adminOnboardingData.branch,
          code: adminOnboardingData.code,
        };
        login(phoneNumber, `Admin ${phoneNumber.slice(-4)}`, true, profileData);
        navigate('/');
      }
    } else {
      if (onboardingStep < onboardingSteps.length - 1) {
        setOnboardingStep(onboardingStep + 1);
      } else {
        const profileData = {
          age: parseInt(onboardingData.age) || 0,
          dependents: parseInt(onboardingData.dependents) || 0,
          monthlyExpenses: parseFloat(onboardingData.monthlyExpenses) || 0,
          existingSavings: parseFloat(onboardingData.existingSavings) || 0,
          yearsToRetire: parseInt(onboardingData.yearsToRetire) || 38,
          minWage: parseFloat(onboardingData.minWage) || 0,
          maxWage: parseFloat(onboardingData.maxWage) || 0,
          minWorkingDays: parseInt(onboardingData.minWorkingDays) || 0,
          maxWorkingDays: parseInt(onboardingData.maxWorkingDays) || 0,
        };
        login(phoneNumber, `User ${phoneNumber.slice(-4)}`, false, profileData);
        navigate('/');
      }
    }
  };

  const renderOnboardingStep = () => {
    if (isAdmin) {
      const currentStep = adminOnboardingSteps[adminOnboardingStep];
      switch (currentStep.id) {
        case 'organisation':
          return (
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Organisation</label>
              <input
                type="text"
                value={adminOnboardingData.organisation}
                onChange={(e) => handleAdminOnboardingChange('organisation', e.target.value)}
                placeholder="e.g. State Pension Board"
                className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all"
              />
            </div>
          );
        case 'role':
          return (
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Role</label>
              <input
                type="text"
                value={adminOnboardingData.role}
                onChange={(e) => handleAdminOnboardingChange('role', e.target.value)}
                placeholder="e.g. Branch Manager"
                className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all"
              />
            </div>
          );
        case 'branch':
          return (
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Branch</label>
              <input
                type="text"
                value={adminOnboardingData.branch}
                onChange={(e) => handleAdminOnboardingChange('branch', e.target.value)}
                placeholder="e.g. Chennai Central"
                className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all"
              />
            </div>
          );
        case 'code':
          return (
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Branch / Employee Code</label>
              <input
                type="text"
                value={adminOnboardingData.code}
                onChange={(e) => handleAdminOnboardingChange('code', e.target.value)}
                placeholder="e.g. BR001 or EMP12345"
                className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all"
              />
            </div>
          );
        default:
          return null;
      }
    }

    const currentOnboardingStep = onboardingSteps[onboardingStep];
    
    switch (currentOnboardingStep.id) {
      case 'age':
        return (
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Your Age</label>
            <input
              type="number"
              value={onboardingData.age}
              onChange={(e) => handleOnboardingChange('age', e.target.value)}
              placeholder="e.g. 25"
              className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-2xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all"
            />
          </div>
        );
      case 'dependents':
        return (
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Number of Dependents</label>
            <input
              type="number"
              value={onboardingData.dependents}
              onChange={(e) => handleOnboardingChange('dependents', e.target.value)}
              placeholder="e.g. 2"
              className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-2xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all"
            />
          </div>
        );
      case 'expenses':
        return (
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Monthly Expenses (₹)</label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400 dark:text-slate-600">₹</span>
              <input
                type="number"
                value={onboardingData.monthlyExpenses}
                onChange={(e) => handleOnboardingChange('monthlyExpenses', e.target.value)}
                placeholder="0"
                className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-2xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all"
              />
            </div>
          </div>
        );
      case 'savings':
        return (
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Current Savings (₹)</label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400 dark:text-slate-600">₹</span>
              <input
                type="number"
                value={onboardingData.existingSavings}
                onChange={(e) => handleOnboardingChange('existingSavings', e.target.value)}
                placeholder="0"
                className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-2xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all"
              />
            </div>
          </div>
        );
      case 'retirement':
        return (
          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Years to Retirement</label>
              <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{onboardingData.yearsToRetire} Years</span>
            </div>
            <input
              type="range"
              min="1"
              max="58"
              value={onboardingData.yearsToRetire}
              onChange={(e) => handleOnboardingChange('yearsToRetire', e.target.value)}
              className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest">
              <span>1 Year</span>
              <span>58 Years</span>
            </div>
          </div>
        );
      case 'wage':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Minimum Expected Daily Wage (₹)</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400 dark:text-slate-600">₹</span>
                <input
                  type="number"
                  value={onboardingData.minWage}
                  onChange={(e) => handleOnboardingChange('minWage', e.target.value)}
                  placeholder="Min"
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-2xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all"
                />
              </div>
            </div>
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Maximum Expected Daily Wage (₹)</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400 dark:text-slate-600">₹</span>
                <input
                  type="number"
                  value={onboardingData.maxWage}
                  onChange={(e) => handleOnboardingChange('maxWage', e.target.value)}
                  placeholder="Max"
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-2xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all"
                />
              </div>
            </div>
          </div>
        );
      case 'workingDays':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Min Working Days / Month</label>
              <input
                type="number"
                value={onboardingData.minWorkingDays}
                onChange={(e) => handleOnboardingChange('minWorkingDays', e.target.value)}
                placeholder="Min Days"
                className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-2xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Max Working Days / Month</label>
              <input
                type="number"
                value={onboardingData.maxWorkingDays}
                onChange={(e) => handleOnboardingChange('maxWorkingDays', e.target.value)}
                placeholder="Max Days"
                className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-2xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-[#0a0a0a] transition-colors duration-500 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[440px] z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-[24px] fintech-gradient text-white mb-6 shadow-2xl shadow-emerald-500/20"
          >
            <ShieldCheck size={40} strokeWidth={1.5} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2"
          >
            {t('appName')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-500 dark:text-slate-400 font-medium"
          >
            {t('tagline')}
          </motion.p>
        </div>

        <div className="bg-white dark:bg-[#161616] p-8 md:p-10 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-white/5 transition-all duration-300 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 'form' ? (
              <motion.div
                key="form-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                {/* Stylish Toggle */}
                <div className="flex mb-10 bg-slate-100 dark:bg-white/5 p-1.5 rounded-2xl relative">
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-y-1.5 rounded-xl bg-white dark:bg-[#2a2a2a] shadow-sm z-0"
                    initial={false}
                    animate={{ 
                      left: isLoginView ? "6px" : "50%",
                      right: isLoginView ? "50%" : "6px"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                  <button 
                    onClick={() => !isLoginView && handleToggleView()}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 relative z-10 ${isLoginView ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}
                  >
                    {t('login')}
                  </button>
                  <button 
                    onClick={() => isLoginView && handleToggleView()}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 relative z-10 ${!isLoginView ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}
                  >
                    {t('register')}
                  </button>
                </div>

                <form onSubmit={handleInitialSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em] ml-1">
                      {t('phoneNumber')}
                    </label>
                    <div className="group relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors duration-300" size={18} />
                      <input 
                        type="tel" 
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em] ml-1">
                      {t('password')}
                    </label>
                    <div className="group relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors duration-300" size={18} />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all duration-300"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {!isLoginView && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-2"
                    >
                      <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em] ml-1">
                        {t('confirmPassword')}
                      </label>
                      <div className="group relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors duration-300" size={18} />
                        <input 
                          type={showPassword ? "text" : "password"} 
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all duration-300"
                        />
                      </div>
                    </motion.div>
                  )}

                  {!isLoginView && (
                    <div className="flex items-center gap-3 py-2">
                      <input 
                        type="checkbox" 
                        id="admin-check"
                        checked={isAdmin}
                        onChange={(e) => setIsAdmin(e.target.checked)}
                        className="w-5 h-5 text-emerald-600 dark:text-emerald-500 border-slate-300 dark:border-white/10 rounded-lg focus:ring-emerald-500 transition-all cursor-pointer"
                      />
                      <label htmlFor="admin-check" className="text-sm font-medium text-slate-600 dark:text-slate-400 cursor-pointer hover:text-emerald-500 transition-colors">
                        {t('adminLogin')}
                      </label>
                    </div>
                  )}

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-3 text-red-500 text-sm bg-red-50 dark:bg-red-500/10 p-4 rounded-2xl border border-red-100 dark:border-red-500/20"
                    >
                      <AlertCircle size={18} className="shrink-0" />
                      <span className="font-medium">{error}</span>
                    </motion.div>
                  )}

                  <motion.button 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 fintech-gradient text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100 mt-4"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isLoginView ? t('signIn') : t('sendOtp'))}
                  </motion.button>
                </form>
              </motion.div>
            ) : step === 'otp' ? (
              <motion.div
                key="otp-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <button 
                  onClick={() => setStep('form')}
                  className="flex items-center gap-2 text-slate-400 hover:text-emerald-500 text-sm font-bold mb-8 transition-colors group"
                >
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  {t('changeNumber')}
                </button>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {t('verifyOtp')}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-10">
                  {t('otpSent')}: <span className="font-bold text-slate-900 dark:text-slate-200">{phoneNumber}</span>
                </p>
                
                <form onSubmit={handleVerifyAndRegister} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em] ml-1">
                      {t('enterOtp')}
                    </label>
                    <div className="group relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors duration-300" size={18} />
                      <input 
                        type="text" 
                        maxLength={6}
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="000000"
                        className="w-full pl-12 pr-4 py-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white font-mono text-3xl tracking-[0.4em] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all duration-300"
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-3 text-red-500 text-sm bg-red-50 dark:bg-red-500/10 p-4 rounded-2xl border border-red-100 dark:border-red-500/20"
                    >
                      <AlertCircle size={18} className="shrink-0" />
                      <span className="font-medium">{error}</span>
                    </motion.div>
                  )}

                  <div className="space-y-4">
                    <motion.button 
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 fintech-gradient text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100"
                    >
                      {isLoading ? <Loader2 className="animate-spin" size={20} /> : t('verifyOtp')}
                    </motion.button>
                    
                    <button 
                      type="button"
                      className="w-full py-2 text-emerald-600 dark:text-emerald-400 text-sm font-bold hover:text-emerald-500 transition-colors"
                    >
                      {t('resendOtp')}
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="onboarding-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="space-y-8"
              >
                {(() => {
                  const steps = isAdmin ? adminOnboardingSteps : onboardingSteps;
                  const stepIndex = isAdmin ? adminOnboardingStep : onboardingStep;
                  return (
                    <>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                          <span>{isAdmin ? 'Admin Setup' : 'Onboarding'} Step {stepIndex + 1} of {steps.length}</span>
                          <span>{Math.round(((stepIndex + 1) / steps.length) * 100)}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-emerald-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            {React.createElement(steps[stepIndex].icon, { size: 20 })}
                          </div>
                          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            {steps[stepIndex].title}
                          </h2>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {steps[stepIndex].description}
                        </p>
                      </div>

                      <div className="min-h-[120px]">
                        {renderOnboardingStep()}
                      </div>

                      <div className="flex gap-4">
                        {stepIndex > 0 && (
                          <button
                            type="button"
                            onClick={() => isAdmin ? setAdminOnboardingStep(stepIndex - 1) : setOnboardingStep(stepIndex - 1)}
                            className="flex-1 py-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                          >
                            <ChevronLeft size={20} />
                            Back
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handleOnboardingNext}
                          className="flex-[2] py-4 fintech-gradient text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-2"
                        >
                          {stepIndex === steps.length - 1 ? 'Complete' : 'Continue'}
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-10 text-slate-400 dark:text-slate-600 text-xs font-medium"
        >
          &copy; {new Date().getFullYear()} {t('appName')} Inc. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  );
}
