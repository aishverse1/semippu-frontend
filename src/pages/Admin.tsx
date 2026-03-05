import React, { useState } from 'react';
import { usePension } from '../context/PensionContext';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { 
  Settings, 
  Percent, 
  Save, 
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  XCircle,
  Database,
  Users as UsersIcon,
  Download,
  Upload,
  Trash2,
  Edit,
  Plus,
  CheckCircle2
} from 'lucide-react';

export default function Admin() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const { 
    inflationRate, 
    updateInflationRate, 
    user, 
    loans, 
    updateLoanStatus, 
    deleteLoan,
    contributions,
    deleteContribution,
    updateContribution,
    addContribution,
    exportData,
    importData
  } = usePension();
  const { t } = useLanguage();
  const [rate, setRate] = useState<string>(inflationRate.toString());
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'loans' | 'data' | 'users'>('settings');
  
  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<string>('');
  const [editType, setEditType] = useState<'Daily' | 'Monthly'>('Monthly');

  // Import state
  const [importJson, setImportJson] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importStatus, setImportStatus] = useState<{type: 'success' | 'error', msg: string} | null>(null);

  if (!user?.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={40} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
        <p className="text-slate-500 mt-2 max-w-md">You do not have the necessary permissions to view this page. Please contact your system administrator.</p>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API delay
    setTimeout(() => {
      updateInflationRate(parseFloat(rate));
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  const totalOutstanding = loans
    .filter(l => l.status === 'Approved')
    .reduce((sum, l) => sum + l.amount, 0);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors duration-300">{t('adminPanel')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-300">Manage system settings and member applications.</p>
        </div>
        
        <div className="flex bg-white dark:bg-[#1e1e1e] p-1 rounded-2xl border border-slate-100 dark:border-[#2a2a2a] shadow-sm self-start transition-all duration-300 overflow-x-auto max-w-full">
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === 'settings' ? 'bg-slate-900 dark:bg-[#3a3a3a] text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            {t('settings')}
          </button>
          <button 
            onClick={() => setActiveTab('loans')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === 'loans' ? 'bg-slate-900 dark:bg-[#3a3a3a] text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            {t('loanRequests')}
          </button>
          <button 
            onClick={() => setActiveTab('data')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === 'data' ? 'bg-slate-900 dark:bg-[#3a3a3a] text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            {t('dataManagement')}
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === 'users' ? 'bg-slate-900 dark:bg-[#3a3a3a] text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            {t('userManagement')}
          </button>
        </div>
      </header>

      {activeTab === 'settings' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#1e1e1e] p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-[#2a2a2a] transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center transition-colors duration-300">
                <Percent size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white transition-colors duration-300">{t('inflationControl')}</h2>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors duration-300">{t('inflationRate')} (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full px-4 py-4 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#2a2a2a] rounded-2xl text-2xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-bold text-xl transition-colors duration-300">%</div>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 transition-colors duration-300">This rate is used to calculate inflation-adjusted returns for all members across the platform.</p>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className={`w-full py-5 font-bold rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  isSaving 
                    ? 'bg-slate-100 dark:bg-[#2a2a2a] text-slate-400 dark:text-slate-500 cursor-not-allowed' 
                    : 'bg-amber-500 text-white shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="animate-spin" size={20} />
                    {t('saveChanges')}...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    {t('updateGlobalRate')}
                  </>
                )}
              </button>
            </form>

            {showSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-2xl flex items-center gap-3 border border-emerald-100 dark:border-emerald-800 transition-all duration-300"
              >
                <ShieldCheck size={24} />
                <span className="font-semibold">Settings updated successfully!</span>
              </motion.div>
            )}
          </motion.div>

          <div className="space-y-6">
            <div className="bg-slate-900 dark:bg-[#121212] p-8 rounded-3xl text-white border border-slate-800 dark:border-[#2a2a2a] transition-all duration-300">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Database className="text-emerald-400" size={20} />
                {t('dataManagement')}
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                Export your current application state to a JSON file or import a previously saved state.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => {
                    const data = exportData();
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `semippu-backup-${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                  }}
                  className="flex items-center justify-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all"
                >
                  <Download size={18} />
                  {t('exportData')}
                </button>
                <button 
                  onClick={() => setShowImportModal(true)}
                  className="flex items-center justify-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all"
                >
                  <Upload size={18} />
                  {t('importData')}
                </button>
              </div>
            </div>

            <div className="bg-slate-900 dark:bg-[#121212] p-8 rounded-3xl text-white border border-slate-800 dark:border-[#2a2a2a] transition-all duration-300">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <ShieldCheck className="text-emerald-400" size={20} />
                Admin Security
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                Changes made here are applied instantly to all user dashboards. Ensure the inflation rate is verified with official central bank data before updating.
              </p>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Current Session</p>
                <p className="text-sm font-mono">ADMIN_AUTH_TOKEN: {Math.random().toString(36).substr(2, 12).toUpperCase()}</p>
              </div>
            </div>
          </div>

          {/* Import Modal */}
          {showImportModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-[#1e1e1e] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-slate-100 dark:border-[#2a2a2a] flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('importData')}</h3>
                  <button onClick={() => { setShowImportModal(false); setImportStatus(null); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <XCircle size={24} />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Paste your JSON data below to restore the application state.</p>
                  <textarea 
                    value={importJson}
                    onChange={(e) => setImportJson(e.target.value)}
                    className="w-full h-48 p-4 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#2a2a2a] rounded-2xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    placeholder='{ "contributions": [...], "loans": [...], "inflationRate": 5.0 }'
                  />
                  {importStatus && (
                    <div className={`p-4 rounded-2xl text-sm font-medium ${importStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
                      {importStatus.msg}
                    </div>
                  )}
                </div>
                <div className="p-6 bg-slate-50 dark:bg-[#121212] flex gap-3">
                  <button 
                    onClick={() => { setShowImportModal(false); setImportStatus(null); }}
                    className="flex-1 py-3 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-[#2a2a2a] text-slate-600 dark:text-slate-400 font-bold rounded-xl"
                  >
                    {t('cancel')}
                  </button>
                  <button 
                    onClick={() => {
                      const success = importData(importJson);
                      if (success) {
                        setImportStatus({ type: 'success', msg: t('importSuccess') });
                        setTimeout(() => setShowImportModal(false), 1500);
                      } else {
                        setImportStatus({ type: 'error', msg: t('importError') });
                      }
                    }}
                    className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20"
                  >
                    {t('importData')}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      ) : activeTab === 'loans' ? (
        <div className="space-y-8">
          {/* Loan Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-3xl border border-slate-100 dark:border-[#2a2a2a] shadow-sm transition-all duration-300">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium transition-colors duration-300">{t('pendingRequests')}</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1 transition-colors duration-300">{loans.filter(l => l.status === 'Pending').length}</p>
            </div>
            <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-3xl border border-slate-100 dark:border-[#2a2a2a] shadow-sm transition-all duration-300">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium transition-colors duration-300">{t('approvedLoans')}</p>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 transition-colors duration-300">{loans.filter(l => l.status === 'Approved').length}</p>
            </div>
            <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-3xl border border-slate-100 dark:border-[#2a2a2a] shadow-sm transition-all duration-300">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium transition-colors duration-300">{t('totalOutstanding')}</p>
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-1 transition-colors duration-300">{formatCurrency(totalOutstanding)}</p>
            </div>
          </div>

          {/* Loan Requests Table */}
          <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl border border-slate-100 dark:border-[#2a2a2a] shadow-sm overflow-hidden transition-all duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#121212] border-b border-slate-100 dark:border-[#2a2a2a] transition-colors duration-300">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('member')}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('approvedAmountLabel')}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('date')}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('status')}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800 transition-colors duration-300">
                  {loans.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 transition-colors duration-300">No loan requests found.</td>
                    </tr>
                  ) : (
                    loans.map((loan) => (
                      <tr key={loan.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-300">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 text-xs font-bold transition-colors duration-300">
                              {loan.userName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white transition-colors duration-300">{loan.userName}</p>
                              <p className="text-xs text-slate-400 dark:text-slate-500 transition-colors duration-300">{loan.userId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white transition-colors duration-300">{formatCurrency(loan.amount)}</td>
                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">{new Date(loan.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                            loan.status === 'Approved' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 
                            loan.status === 'Rejected' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 
                            'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                          }`}>
                            {loan.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {loan.status === 'Pending' && (
                              <>
                                <button 
                                  onClick={() => updateLoanStatus(loan.id, 'Approved')}
                                  className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors duration-300"
                                  title="Approve"
                                >
                                  <ShieldCheck size={18} />
                                </button>
                                <button 
                                  onClick={() => updateLoanStatus(loan.id, 'Rejected')}
                                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-300"
                                  title="Reject"
                                >
                                  <XCircle size={18} />
                                </button>
                              </>
                            )}
                            <button 
                              onClick={() => { if(window.confirm(t('deleteConfirm'))) deleteLoan(loan.id); }}
                              className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-300"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : activeTab === 'data' ? (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('allContributions')}</h2>
          </div>

          <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl border border-slate-100 dark:border-[#2a2a2a] shadow-sm overflow-hidden transition-all duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#121212] border-b border-slate-100 dark:border-[#2a2a2a] transition-colors duration-300">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('amount')}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('type')}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('date')}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800 transition-colors duration-300">
                  {contributions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 transition-colors duration-300">No contributions found.</td>
                    </tr>
                  ) : (
                    contributions.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-300">
                        <td className="px-6 py-4 font-mono text-xs text-slate-400">{c.id}</td>
                        <td className="px-6 py-4">
                          {editingId === c.id ? (
                            <input 
                              type="number"
                              value={editAmount}
                              onChange={(e) => setEditAmount(e.target.value)}
                              className="w-24 px-2 py-1 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#2a2a2a] rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            />
                          ) : (
                            <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(c.amount)}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {editingId === c.id ? (
                            <select 
                              value={editType}
                              onChange={(e) => setEditType(e.target.value as 'Daily' | 'Monthly')}
                              className="px-2 py-1 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#2a2a2a] rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            >
                              <option value="Daily">{t('daily')}</option>
                              <option value="Monthly">{t('monthly')}</option>
                            </select>
                          ) : (
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${c.type === 'Monthly' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'}`}>
                              {c.type === 'Monthly' ? t('monthly') : t('daily')}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{new Date(c.date).toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {editingId === c.id ? (
                              <>
                                <button 
                                  onClick={() => {
                                    updateContribution(c.id, parseFloat(editAmount), editType);
                                    setEditingId(null);
                                  }}
                                  className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg"
                                  title={t('save')}
                                >
                                  <Save size={18} />
                                </button>
                                <button 
                                  onClick={() => setEditingId(null)}
                                  className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                                  title={t('cancel')}
                                >
                                  <XCircle size={18} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button 
                                  onClick={() => {
                                    setEditingId(c.id);
                                    setEditAmount(c.amount.toString());
                                    setEditType(c.type);
                                  }}
                                  className="p-2 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors duration-300"
                                  title={t('editItem')}
                                >
                                  <Edit size={18} />
                                </button>
                                <button 
                                  onClick={() => { if(window.confirm(t('deleteConfirm'))) deleteContribution(c.id); }}
                                  className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-300"
                                  title="Delete"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('userManagement')}</h2>
          
          <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl border border-slate-100 dark:border-[#2a2a2a] shadow-sm overflow-hidden transition-all duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#121212] border-b border-slate-100 dark:border-[#2a2a2a] transition-colors duration-300">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('fullName')}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('email')}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('role')}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">{t('status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800 transition-colors duration-300">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-300">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                          {user?.name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">{user?.name} (You)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{user?.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                        {t('admin')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-emerald-500 flex items-center justify-end gap-1 text-xs font-bold">
                        <CheckCircle2 size={14} />
                        Active
                      </span>
                    </td>
                  </tr>
                  {/* Mock Users */}
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-300">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 text-xs font-bold">
                          J
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">John Doe</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">john@example.com</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        {t('member')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-emerald-500 flex items-center justify-end gap-1 text-xs font-bold">
                        <CheckCircle2 size={14} />
                        Active
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

