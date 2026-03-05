import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'motion/react';
import { Globe, Check, Moon, Sun, Monitor } from 'lucide-react';

export default function Settings() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  const languages = [
    { id: 'en', label: 'English', sub: 'English' },
    { id: 'ta', label: 'தமிழ்', sub: 'Tamil' }
  ];

  const themes = [
    { id: 'light', label: t('lightMode'), icon: Sun },
    { id: 'dark', label: t('darkMode'), icon: Moon }
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors duration-300">{t('settings')}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-300">Manage your account preferences and application settings.</p>
      </header>

      <div className="max-w-2xl space-y-6">
        {/* Appearance Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-sm border border-slate-100 dark:border-[#2a2a2a] overflow-hidden transition-all duration-300"
        >
          <div className="p-6 border-b border-slate-50 dark:border-[#2a2a2a] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center transition-colors duration-300">
              <Monitor size={20} />
            </div>
            <h2 className="font-bold text-slate-900 dark:text-white transition-colors duration-300">{t('appearance')}</h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {themes.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTheme(item.id as 'light' | 'dark')}
                  className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-300 ${
                    theme === item.id 
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' 
                      : 'border-slate-100 dark:border-[#2a2a2a] bg-white dark:bg-[#1e1e1e] text-slate-600 dark:text-slate-400 hover:border-slate-200 dark:hover:border-[#3a3a3a]'
                  }`}
                >
                  <item.icon size={24} />
                  <span className="font-bold">{item.label}</span>
                  {theme === item.id && (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center mt-1">
                      <Check size={14} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Language Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-sm border border-slate-100 dark:border-[#2a2a2a] overflow-hidden transition-all duration-300"
        >
          <div className="p-6 border-b border-slate-50 dark:border-[#2a2a2a] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-colors duration-300">
              <Globe size={20} />
            </div>
            <h2 className="font-bold text-slate-900 dark:text-white transition-colors duration-300">{t('language')}</h2>
          </div>

          <div className="p-6 space-y-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 transition-colors duration-300">
              {t('selectLanguageDesc')}
            </p>
            
            <div className="grid grid-cols-1 gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setLanguage(lang.id as 'en' | 'ta')}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 ${
                    language === lang.id 
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' 
                      : 'border-slate-100 dark:border-[#2a2a2a] bg-white dark:bg-[#1e1e1e] text-slate-600 dark:text-slate-400 hover:border-slate-200 dark:hover:border-[#3a3a3a]'
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-lg">{lang.label}</span>
                    <span className="text-xs opacity-60">{lang.sub}</span>
                  </div>
                  {language === lang.id && (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <Check size={14} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
