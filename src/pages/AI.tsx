import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { usePension } from '../context/PensionContext';
import { 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle,
  Target,
  ArrowUpRight,
  PieChart,
  Activity,
  Coins,
  Wallet,
  Calendar,
  Award,
  Loader2,
} from 'lucide-react';

export default function AI() {
  const { user, totalInvested, aiPlan, aiLoading, aiError, fetchAIPlan } = usePension();

  useEffect(() => {
    fetchAIPlan();
  }, []);

  if (!user) return null;

  // ── Loading State ─────────────────────────────────────────────────────────
  if (aiLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-slate-400">
        <Loader2 size={40} className="animate-spin text-[#00C896]" />
        <p className="text-lg font-semibold">Generating your AI plan...</p>
      </div>
    );
  }

  // ── Error State ───────────────────────────────────────────────────────────
  if (aiError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <AlertCircle size={48} className="text-red-400" />
        <p className="text-xl font-bold text-white">Could not load AI plan</p>
        <p className="text-slate-400 max-w-md">{aiError}</p>
        <button
          onClick={fetchAIPlan}
          className="mt-4 px-6 py-3 bg-[#00C896] text-white font-bold rounded-2xl hover:bg-[#00b589] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const corpus = aiPlan?.retirement_corpus ?? 0;
  const pensionPerMonth = aiPlan?.pension_per_month ?? (corpus ? Math.round((corpus * 0.06) / 12) : 0);

  const aiResults = {
    daily_savings:      aiPlan?.daily_savings      ?? '...',
    monthly_savings:    aiPlan?.monthly_savings     ?? '...',
    best_scheme:        aiPlan?.best_scheme         ?? 'Loading...',
    retirement_corpus:  corpus,
    pension_per_month:  pensionPerMonth,
    warning:            aiPlan?.warning             ?? '',
    retirement_outlook: aiPlan
      ? `In ${aiPlan.years_to_retire} years you'll have ₹${corpus?.toLocaleString()}`
      : user.yearsToRetire && user.yearsToRetire > 20
        ? "You have a long horizon. Consider aggressive growth investments."
        : "Horizon is narrowing. Focus on capital preservation and steady contributions.",
  };

  const insights = [
    {
      title: "Save Per Day",
      description: `Recommended daily savings: ₹${aiResults.daily_savings}`,
      icon: Coins,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      value: `₹${aiResults.daily_savings}`,
    },
    {
      title: "Save Per Month",
      description: `Recommended monthly savings: ₹${aiResults.monthly_savings}`,
      icon: Wallet,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      value: `₹${aiResults.monthly_savings}`,
    },
    {
      title: "Retirement Outlook",
      description: aiResults.retirement_outlook,
      icon: Target,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      title: "Pension per Month",
      description: `Estimated monthly pension (6% of corpus): ₹${pensionPerMonth.toLocaleString()}/month`,
      icon: Calendar,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      value: `₹${pensionPerMonth.toLocaleString()}`,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-8">

      <header className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00C896]/10 text-[#00C896] rounded-full text-xs font-bold uppercase tracking-widest mb-2">
          <Sparkles size={14} />
          AI Financial Intelligence
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight">Personalized Insights</h1>
        <p className="text-slate-400">Analysis based on your profile and investment history.</p>
      </header>

      {/* Warning Banner */}
      {aiResults.warning && (
        <div className={`px-6 py-4 rounded-2xl text-sm font-semibold border flex items-center gap-3 ${
          aiResults.warning.startsWith('✅')
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : aiResults.warning.startsWith('⚠️')
            ? 'bg-red-500/10 border-red-500/20 text-red-400'
            : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
        }`}>
          {aiResults.warning}
        </div>
      )}

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <div className="lg:col-span-1 bg-[#1e1e1e] border border-slate-800 rounded-[32px] p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00C896]/30 to-transparent" />
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <PieChart size={20} className="text-[#00C896]" />
            Profile Summary
          </h2>

          <div className="space-y-4">
            {[
              { label: 'Age',               value: user.age                ? `${user.age} Years`                        : 'Not set' },
              { label: 'Dependents',         value: user.dependents != null  ? `${user.dependents}`                       : 'Not set' },
              { label: 'Monthly Expenses',   value: user.monthlyExpenses    ? `₹${user.monthlyExpenses.toLocaleString()}` : 'Not set' },
              { label: 'Current Savings',    value: user.existingSavings    ? `₹${user.existingSavings.toLocaleString()}` : 'Not set' },
              { label: 'Min Wage / Day',     value: user.minWage            ? `₹${user.minWage}`                         : 'Not set' },
              { label: 'Max Wage / Day',     value: user.maxWage            ? `₹${user.maxWage}`                         : 'Not set' },
              { label: 'Min Working Days',   value: user.minWorkingDays     ? `${user.minWorkingDays} days`               : 'Not set' },
              { label: 'Max Working Days',   value: user.maxWorkingDays     ? `${user.maxWorkingDays} days`               : 'Not set' },
              { label: 'Retirement In',      value: user.yearsToRetire      ? `${user.yearsToRetire} Years`               : 'Not set' },
              { label: 'Total Invested',     value: `₹${totalInvested.toLocaleString()}` },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b border-slate-800 last:border-0">
                <span className="text-sm text-slate-500 font-medium">{item.label}</span>
                <span className="text-sm font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {insights.map((insight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#1e1e1e] border border-slate-800 rounded-[32px] p-6 space-y-4 hover:border-[#00C896]/30 transition-all group"
              >
                <div className="flex justify-between items-start">
                  <div className={`w-12 h-12 rounded-2xl ${insight.bg} ${insight.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <insight.icon size={24} />
                  </div>
                  {insight.value && (
                    <span className={`text-2xl font-bold ${insight.color}`}>{insight.value}</span>
                  )}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">{insight.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{insight.description}</p>
                </div>
              </motion.div>
            ))}

            {/* Best Scheme Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="md:col-span-2 bg-gradient-to-br from-indigo-900/20 to-slate-900/40 border border-indigo-500/20 rounded-[32px] p-8 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Award size={120} />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <Award size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-white">Best Scheme</h3>
                  </div>
                  <p className="text-slate-400 max-w-md">
                    Based on your risk profile and retirement horizon, this scheme offers the best tax-adjusted returns.
                  </p>
                </div>
                <div className="shrink-0">
                  <div className="px-6 py-4 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl">
                    <span className="text-2xl font-bold text-indigo-400">{aiResults.best_scheme}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            

            {/* Retirement Corpus Card */}
            {aiPlan && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="md:col-span-2 bg-gradient-to-br from-emerald-900/20 to-slate-900/40 border border-emerald-500/20 rounded-[32px] p-8"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Estimated Retirement Corpus</p>
                    <p className="text-4xl font-bold text-emerald-400">
                      ₹{aiPlan?.retirement_corpus?.toLocaleString()}
                    </p>
                    <p className="text-slate-500 text-sm mt-2">
                      Worst case: ₹{aiPlan?.worst_income?.toLocaleString()} / month &nbsp;·&nbsp;
                      Best case: ₹{aiPlan?.best_income?.toLocaleString()} / month
                    </p>
                  </div>
                  <button
                    onClick={fetchAIPlan}
                    className="px-5 py-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold rounded-2xl hover:bg-emerald-500/20 transition-colors text-sm"
                  >
                    Refresh Plan
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}