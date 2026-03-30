import React, { useState } from 'react';
import { usePension } from '../context/PensionContext';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { Plus, Calendar, Clock, IndianRupee, CheckCircle2, TrendingUp, History } from 'lucide-react';

export default function Invest() {
  const [amount, setAmount] = useState<string>('');
  const [type, setType] = useState<'Daily' | 'Monthly'>('Daily');
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { addContribution, contributions } = usePension();
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    addContribution(numAmount, type);
    setAmount('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors duration-300">{t('invest')}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-300">Add to your pension fund and watch your future grow.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contribution Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-[#1e1e1e] p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-[#2a2a2a] transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-colors duration-300">
              <Plus size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white transition-colors duration-300">{t('newContribution')}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors duration-300">{t('contributionType')}</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setType('Daily')}
                  className={`flex items-center justify-center gap-2 py-4 rounded-2xl border-2 transition-all duration-300 ${
                    type === 'Daily' 
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-bold' 
                      : 'border-slate-100 dark:border-[#2a2a2a] bg-slate-50 dark:bg-[#121212] text-slate-500 dark:text-slate-400 hover:border-slate-200 dark:hover:border-[#3a3a3a]'
                  }`}
                >
                  <Clock size={20} />
                  {t('daily')}
                </button>
                <button
                  type="button"
                  onClick={() => setType('Monthly')}
                  className={`flex items-center justify-center gap-2 py-4 rounded-2xl border-2 transition-all duration-300 ${
                    type === 'Monthly' 
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-bold' 
                      : 'border-slate-100 dark:border-[#2a2a2a] bg-slate-50 dark:bg-[#121212] text-slate-500 dark:text-slate-400 hover:border-slate-200 dark:hover:border-[#3a3a3a]'
                  }`}
                >
                  <Calendar size={20} />
                  {t('monthly')}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors duration-300">{t('amount')}</label>
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
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#2a2a2a] rounded-2xl text-2xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-5 fintech-gradient text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Confirm Investment
            </button>
          </form>

          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-2xl flex items-center gap-3 border border-emerald-100 dark:border-emerald-800 transition-all duration-300"
            >
              <CheckCircle2 size={24} />
              <span className="font-semibold">{t('contributionAdded')}</span>
            </motion.div>
          )}
        </motion.div>

        {/* History List */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-sm border border-slate-100 dark:border-[#2a2a2a] overflow-hidden flex flex-col transition-all duration-300"
        >
          <div className="p-8 border-b border-slate-50 dark:border-[#2a2a2a] flex items-center gap-3 transition-colors duration-300">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center transition-colors duration-300">
              <History size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white transition-colors duration-300">{t('contributionHistory')}</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto max-h-[500px] divide-y divide-slate-50 dark:divide-[#2a2a2a] transition-colors duration-300">
            {contributions.length === 0 ? (
              <div className="p-12 text-center text-slate-400 dark:text-slate-500">
                <p>No history found.</p>
              </div>
            ) : (
              contributions.map((c) => (
                <div key={c.id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-300">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${c.type === 'Monthly' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'} transition-colors duration-300`}>
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white transition-colors duration-300">{c.type} Payment</p>
                      <p className="text-sm text-slate-400 dark:text-slate-500 transition-colors duration-300">{new Date(c.date).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-900 dark:text-white transition-colors duration-300">{formatCurrency(c.amount)}</p>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full uppercase tracking-wider transition-colors duration-300">Success</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
