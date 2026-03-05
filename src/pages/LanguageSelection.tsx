import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { Languages, Globe } from 'lucide-react';

export default function LanguageSelection() {
  const { setLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleSelect = (lang: 'en' | 'ta') => {
    setLanguage(lang);
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-[#121212] transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl fintech-gradient text-white mb-6 shadow-xl">
            <Languages size={40} />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 transition-colors duration-300">Select Language / மொழியைத் தேர்ந்தெடுக்கவும்</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg transition-colors duration-300">Please choose your preferred language to continue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect('en')}
            className="group bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center transition-all duration-300 hover:border-emerald-500/30 hover:shadow-emerald-500/10"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
              <Globe size={32} />
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-300">English</span>
            <span className="text-slate-400 dark:text-slate-500 transition-colors duration-300">Continue in English</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect('ta')}
            className="group bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center transition-all duration-300 hover:border-emerald-500/30 hover:shadow-emerald-500/10"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
              <Globe size={32} />
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-300">தமிழ்</span>
            <span className="text-slate-400 dark:text-slate-500 transition-colors duration-300">தமிழில் தொடரவும்</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
