import React, { useState } from 'react';
import { usePension } from '../context/PensionContext';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { HandCoins, Info, AlertTriangle, CheckCircle2, Clock, XCircle, IndianRupee, ArrowRight } from 'lucide-react';

export default function Loans() {
  const { loanEligibility, applyForLoan, userLoan } = usePension();
  const { t } = useLanguage();
  const [amount, setAmount] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const INTEREST_RATE = 0.08; // 8% per annum
  const REPAYMENT_MONTHS = 24;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;
    
    if (numAmount > loanEligibility) {
      setError("You can only borrow up to 90% of your invested amount.");
      return;
    }

    try {
      applyForLoan(numAmount);
      setAmount('');
      setError(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const isOverLimit = parseFloat(amount) > loanEligibility;

  const calculateEMI = (principal: number) => {
    const monthlyRate = INTEREST_RATE / 12;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, REPAYMENT_MONTHS)) / (Math.pow(1 + monthlyRate, REPAYMENT_MONTHS) - 1);
    return emi;
  };

  const numAmount = parseFloat(amount) || 0;
  const emi = numAmount > 0 ? calculateEMI(numAmount) : 0;
  const totalPayable = emi * REPAYMENT_MONTHS;
  const totalInterest = totalPayable - numAmount;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800';
      case 'Rejected': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800';
      default: return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle2 size={20} />;
      case 'Rejected': return <XCircle size={20} />;
      default: return <Clock size={20} />;
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors duration-300">{t('loanManagement')}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-300">Check your eligibility and apply for a low-interest loan.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Eligibility Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 bg-white dark:bg-[#1e1e1e] p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-[#2a2a2a] flex flex-col justify-between transition-all duration-300"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 transition-colors duration-300">
              <HandCoins size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-300">{t('loanEligibility')}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 transition-colors duration-300">Maximum Eligible Loan: {formatCurrency(loanEligibility)}</p>
            <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2 transition-colors duration-300">
              90%
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">Of Total Investment</p>
          </div>
          
          <div className="mt-6 p-4 bg-slate-50 dark:bg-[#121212] rounded-2xl border border-slate-100 dark:border-[#2a2a2a] flex items-start gap-3 transition-all duration-300">
            <Info className="text-slate-400 dark:text-slate-500 shrink-0 mt-0.5 transition-colors duration-300" size={18} />
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed transition-colors duration-300">
              Eligibility is calculated as 90% of your total invested amount across all contribution types.
            </p>
          </div>
        </motion.div>

        {/* Application Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white dark:bg-[#1e1e1e] p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-[#2a2a2a] transition-all duration-300"
        >
          {userLoan ? (
            <div className="h-full flex flex-col justify-center items-center text-center py-10">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 border-4 transition-all duration-300 ${getStatusColor(userLoan.status)}`}>
                {getStatusIcon(userLoan.status)}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-300">{t('activeApplication')}</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 transition-colors duration-300">You currently have a loan application with status: <span className="font-bold">{userLoan.status}</span></p>
              
              <div className="w-full max-w-md p-6 rounded-3xl border border-slate-100 dark:border-[#2a2a2a] bg-slate-50 dark:bg-[#121212] space-y-4 transition-all duration-300">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 transition-colors duration-300">{t('requestedAmount')}</span>
                  <span className="font-bold text-slate-900 dark:text-white transition-colors duration-300">{formatCurrency(userLoan.amount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 transition-colors duration-300">{t('date')}</span>
                  <span className="font-medium text-slate-900 dark:text-white transition-colors duration-300">{new Date(userLoan.date).toLocaleDateString()}</span>
                </div>
                <div className="pt-4 border-t border-slate-200 dark:border-[#2a2a2a] flex justify-between items-center transition-colors duration-300">
                  <span className="text-slate-500 dark:text-slate-400 transition-colors duration-300">{t('status')}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${getStatusColor(userLoan.status)}`}>
                    {userLoan.status}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 transition-colors duration-300">{t('applyLoan')}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors duration-300">{t('requestedAmount')}</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={24} />
                    <input
                      type="number"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className={`w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-[#121212] border rounded-2xl text-2xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all duration-300 ${
                        isOverLimit 
                          ? 'border-red-300 dark:border-red-800 focus:ring-red-500/20 focus:border-red-500' 
                          : 'border-slate-200 dark:border-[#2a2a2a] focus:ring-indigo-500/20 focus:border-indigo-500'
                      }`}
                    />
                  </div>
                  
                  {isOverLimit && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="flex items-center gap-2 text-red-500 dark:text-red-400 text-sm font-medium mt-2 transition-colors duration-300"
                    >
                      <AlertTriangle size={16} />
                      <span>You can only borrow up to 90% of your invested amount.</span>
                    </motion.div>
                  )}

                  {error && !isOverLimit && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="flex items-center gap-2 text-red-500 dark:text-red-400 text-sm font-medium mt-2 transition-colors duration-300"
                    >
                      <AlertTriangle size={16} />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </div>

                <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800 transition-all duration-300">
                  <h4 className="font-bold text-indigo-900 dark:text-indigo-300 mb-2 transition-colors duration-300">Loan Terms</h4>
                  <ul className="text-sm text-indigo-700 dark:text-indigo-400 space-y-2 transition-colors duration-300">
                    <li className="flex items-center gap-2">
                      <ArrowRight size={14} />
                      Interest rate: 8% per annum
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight size={14} />
                      Repayment period: Up to 24 months
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight size={14} />
                      Approval time: 1-3 business days
                    </li>
                  </ul>
                </div>

                {numAmount > 0 && !isOverLimit && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-slate-50 dark:bg-[#121212] rounded-2xl border border-slate-200 dark:border-[#2a2a2a] space-y-4"
                  >
                    <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Info size={18} className="text-indigo-500" />
                      Repayment Summary
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Monthly EMI</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(emi)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total Interest</p>
                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(totalInterest)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total Payable</p>
                        <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(totalPayable)}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <button
                  type="submit"
                  className="w-full py-5 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {t('submitApplication')}
                </button>
              </form>
            </>
          )}

          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-2xl flex items-center gap-3 border border-emerald-100 dark:border-emerald-800 transition-all duration-300"
            >
              <CheckCircle2 size={24} />
              <span className="font-semibold">Application submitted successfully!</span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
