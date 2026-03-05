import { usePension } from '../context/PensionContext';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Wallet, TrendingUp, ArrowUpRight, History, Info, ChevronRight, HandCoins, ShieldAlert } from 'lucide-react';


export default function Dashboard() {
  const { totalInvested, inflationRate, adjustedReturns, contributions, user, userLoan } = usePension();
  const { t } = useLanguage();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      label: t('totalInvested'),
      value: formatCurrency(totalInvested),
      icon: Wallet,
      color: 'bg-blue-500',
      description: 'Your lifetime contributions'
    },
    {
      label: t('inflationRate'),
      value: `${inflationRate}%`,
      icon: Info,
      color: 'bg-amber-500',
      description: 'Current yearly rate'
    },
    {
      label: t('adjustedReturns'),
      value: formatCurrency(adjustedReturns),
      icon: TrendingUp,
      color: 'bg-emerald-500',
      description: 'Projected value with inflation'
    }
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors duration-300">{t('welcome')}, {user?.name}!</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-300">Here's an overview of your pension performance.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-[#1e1e1e] p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-[#2a2a2a] hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.color} text-white shadow-lg shadow-${stat.color.split('-')[1]}-500/20`}>
                <stat.icon size={24} />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full transition-colors duration-300">
                <ArrowUpRight size={14} />
                <span>Active</span>
              </div>
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium transition-colors duration-300">{stat.label}</h3>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1 transition-colors duration-300">{stat.value}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 transition-colors duration-300">{stat.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Loan Summary Section */}
      {userLoan && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-indigo-600 p-6 rounded-3xl text-white shadow-xl shadow-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
              <HandCoins size={28} />
            </div>
            <div>
              <h3 className="font-bold text-lg">{t('loanStatus')}: {userLoan.status}</h3>
              <p className="text-indigo-100 text-sm">
                {userLoan.status === 'Approved' 
                  ? `Your approved loan (90% of requested) of ${formatCurrency(userLoan.amount)} is active.` 
                  : userLoan.status === 'Pending' 
                  ? `Your approved amount of ${formatCurrency(userLoan.amount)} (90% of requested) is being reviewed.`
                  : `Your request for ${formatCurrency(userLoan.amount)} was rejected.`}
              </p>
            </div>
          </div>
          <Link 
            to="/loans" 
            className="px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors whitespace-nowrap"
          >
            {t('loans')}
          </Link>
        </motion.div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-sm border border-slate-100 dark:border-[#2a2a2a] overflow-hidden transition-all duration-300">
            <div className="p-6 border-b border-slate-50 dark:border-[#2a2a2a] flex items-center justify-between transition-colors duration-300">
              <div className="flex items-center gap-2">
                <History className="text-slate-400 dark:text-slate-500" size={20} />
                <h2 className="font-bold text-slate-900 dark:text-white transition-colors duration-300">{t('recentContributions')}</h2>
              </div>
              <button className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold hover:underline transition-colors duration-300">{t('viewAll')}</button>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-[#2a2a2a] transition-colors duration-300">
              {contributions.length === 0 ? (
                <div className="p-10 text-center text-slate-400 dark:text-slate-500">
                  <p>No contributions yet. Start investing today!</p>
                </div>
              ) : (
                contributions.slice(0, 5).map((c) => (
                  <div key={c.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.type === 'Monthly' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'} transition-colors duration-300`}>
                        <TrendingUp size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white transition-colors duration-300">{c.type === 'Monthly' ? t('monthly') : t('daily')} Contribution</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 transition-colors duration-300">{new Date(c.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 dark:text-white transition-colors duration-300">+{formatCurrency(c.amount)}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider transition-colors duration-300">Confirmed</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

          {/* Quick Actions / Info */}
          <div className="space-y-6">
            {/* Grow Your Pension */}
            <div className="fintech-gradient p-6 rounded-3xl text-white shadow-xl shadow-emerald-500/20">
              <h3 className="font-bold text-lg mb-2">{t('growPension')}</h3>
              <p className="text-emerald-100 text-sm mb-6">
                Consistent contributions are the key to a comfortable retirement. Start small, think big.
              </p>
              <Link
                to="/invest"
                className="w-full py-3 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
              >
                {t('investNow')}
                <ChevronRight size={18} />
              </Link>
            </div>

            {/* Calculation Logic */}
            <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-[#2a2a2a] transition-all duration-300">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 transition-colors duration-300">
                {t('calculationLogic')}
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400 transition-colors duration-300">
                    {t('baseInvestment')}
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white transition-colors duration-300">
                    {formatCurrency(totalInvested)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400 transition-colors duration-300">
                    {t('inflationImpact')}
                  </span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400 transition-colors duration-300">
                    +{formatCurrency(adjustedReturns - totalInvested)}
                  </span>
                </div>
                <div className="pt-4 border-t border-slate-50 dark:border-[#2a2a2a] flex justify-between transition-colors duration-300">
                  <span className="font-bold text-slate-900 dark:text-white transition-colors duration-300">
                    {t('adjustedTotal')}
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 transition-colors duration-300">
                    {formatCurrency(adjustedReturns)}
                  </span>
                </div>
              </div>
            </div>

            {/* Awareness / Scam Education */}
            <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-3xl shadow-sm border border-amber-200 dark:border-amber-600/40 transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <ShieldAlert size={18} />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">Awareness: Loan Scams in India</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Genuine banks and cooperative societies will never ask for large “processing fees” in advance to a personal account.
              </p>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-disc pl-5">
                <li>Never share OTP, Aadhaar or PAN on unknown links or WhatsApp groups.</li>
                <li>Do not pay “file opening” or “insurance” fees to individuals.</li>
                <li>Verify new loan apps with RBI / government sites or your society branch.</li>
              </ul>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-3">
                If you suspect fraud, contact your cooperative society branch or bank helpline immediately.
              </p>
            </div>
          </div>
      </div>
    </div>
  );
}

