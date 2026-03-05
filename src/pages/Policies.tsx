import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Heart, 
  UserCheck, 
  Sprout, 
  Home, 
  ChevronRight, 
  Info,
  BadgeCheck,
  TrendingUp
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const policies = [
  {
    id: 1,
    name: "Pension Scheme for Daily Wage Labourers",
    icon: Users,
    description: "A secure retirement plan specifically designed for unorganized sector workers and daily wage earners.",
    eligibility: "Age 18-40, Monthly income < ₹15,000",
    benefit: "₹3,000 Monthly Pension after age 60",
    color: "from-emerald-500 to-teal-600"
  },
  {
    id: 2,
    name: "Women Financial Support Scheme",
    icon: Heart,
    description: "Empowering women through direct financial assistance for self-employment and skill development.",
    eligibility: "Women aged 21-55, Resident of the state",
    benefit: "₹1,500 Monthly + Low-interest business loans",
    color: "from-pink-500 to-rose-600"
  },
  {
    id: 3,
    name: "Senior Citizen Monthly Pension",
    icon: UserCheck,
    description: "Ensuring dignity and financial independence for our elders through regular monthly support.",
    eligibility: "Age 60+, No other pension source",
    benefit: "₹2,000 - ₹2,500 Monthly based on age",
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: 4,
    name: "Farmer Investment Subsidy Program",
    icon: Sprout,
    description: "Direct investment support to farmers for seeds, fertilizers, and modern equipment.",
    eligibility: "Land-owning farmers, Small & Marginal category",
    benefit: "₹10,000 per acre per year",
    color: "from-amber-500 to-orange-600"
  },
  {
    id: 5,
    name: "Low Income Family Welfare Fund",
    icon: Home,
    description: "Comprehensive welfare support for families below the poverty line for health and education.",
    eligibility: "BPL Card holders, Annual income < ₹72,000",
    benefit: "₹5,00,000 Health Cover + Education grants",
    color: "from-purple-500 to-violet-600"
  }
];

export default function Policies() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Government Policies</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Explore available welfare schemes and benefits</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
          <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={20} />
          <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">5 Active Schemes</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {policies.map((policy, index) => (
          <motion.div
            key={policy.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="group relative bg-white dark:bg-[#161616] rounded-[32px] p-8 border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 overflow-hidden"
          >
            {/* Decorative background glow */}
            <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${policy.color} opacity-0 group-hover:opacity-10 blur-[60px] transition-opacity duration-500`} />
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-start justify-between">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${policy.color} text-white shadow-lg`}>
                  <policy.icon size={28} strokeWidth={1.5} />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <BadgeCheck size={12} className="text-emerald-500" />
                  Verified
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors duration-300">
                  {policy.name}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm leading-relaxed">
                  {policy.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Info size={12} />
                    Eligibility
                  </span>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {policy.eligibility}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp size={12} />
                    Benefit
                  </span>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {policy.benefit}
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <button className="w-full py-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 transition-all duration-300 group/btn">
                  Learn More
                  <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
