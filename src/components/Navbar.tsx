import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { usePension } from '../context/PensionContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Settings, 
  LogOut, 
  User as UserIcon,
  Menu,
  X,
  HandCoins,
  ShieldCheck,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { user, logout } = usePension();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const navItems = [
    { path: '/', label: t('dashboard'), icon: LayoutDashboard },
    { path: '/invest', label: t('invest'), icon: TrendingUp },
    { path: '/loans', label: t('loans'), icon: HandCoins },
    { path: '/policies', label: t('policies'), icon: BookOpen },
    { path: '/ai', label: t('ai'), icon: Sparkles },
    { path: '/settings', label: t('settings'), icon: Settings },
    ...(user?.isAdmin ? [{ path: '/admin', label: t('adminSettings'), icon: ShieldCheck }] : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#121212] border-b border-slate-200 dark:border-[#2a2a2a] shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg fintech-gradient flex items-center justify-center text-white shadow-md">
                <TrendingUp size={18} />
              </div>
              <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight transition-colors duration-300">{t('appName')}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
            
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-4 transition-colors duration-300" />
            
            <div className="flex items-center gap-3 pl-2">
              <div className="flex flex-col items-end mr-2">
                <span className="text-sm font-semibold text-slate-900 dark:text-white leading-none transition-colors duration-300">{user?.name}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1 transition-colors duration-300">
                  {user?.isAdmin ? 'Admin' : 'Member'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300"
                title={t('logout')}
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-300"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-[#121212] border-t border-slate-100 dark:border-[#2a2a2a] overflow-hidden transition-all duration-300"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                    location.pathname === item.path
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
                <div className="flex items-center px-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 mr-3 transition-colors duration-300">
                    <UserIcon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white transition-colors duration-300">{user?.name}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 transition-colors duration-300">{user?.isAdmin ? 'Administrator' : 'Member'}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-red-500 dark:text-red-400 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300"
                >
                  <LogOut size={20} />
                  {t('logout')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
