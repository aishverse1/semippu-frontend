import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Contribution {
  id: string;
  amount: number;
  type: 'Daily' | 'Monthly';
  date: string;
}

export interface Loan {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
}

export interface User {
  name: string;
  email: string;
  isAdmin: boolean;
  age?: number;
  dependents?: number;
  monthlyExpenses?: number;
  existingSavings?: number;
  yearsToRetire?: number;
  minWage?: number;
  maxWage?: number;
  minWorkingDays?: number;
  maxWorkingDays?: number;
}

export interface AIPlan {
  worst_income: number;
  best_income: number;
  expected_income: number;
  monthly_savings: number;
  daily_savings: number;
  best_scheme: string;
  retirement_corpus: number;
  years_to_retire: number;
  warning: string;
  avg_monthly_savings: number;
  total_contributed: number;
  created_at: string;
}

interface PensionContextType {
  user: User | null;
  login: (email: string, name: string, isAdmin: boolean, profileData?: Partial<User>) => void;
  updateProfile: (profileData: Partial<User>) => void;
  logout: () => void;
  contributions: Contribution[];
  addContribution: (amount: number, type: 'Daily' | 'Monthly') => void;
  deleteContribution: (id: string) => void;
  updateContribution: (id: string, amount: number, type: 'Daily' | 'Monthly') => void;
  inflationRate: number;
  updateInflationRate: (rate: number) => void;
  totalInvested: number;
  adjustedReturns: number;
  loans: Loan[];
  applyForLoan: (amount: number) => void;
  updateLoanStatus: (loanId: string, status: 'Approved' | 'Rejected') => void;
  deleteLoan: (loanId: string) => void;
  loanEligibility: number;
  userLoan: Loan | null;
  exportData: () => string;
  importData: (jsonData: string) => boolean;
  aiPlan: AIPlan | null;
  aiLoading: boolean;
  aiError: string | null;
  fetchAIPlan: () => Promise<void>;
  avgMonthlySavings: number;
  monthsTracked: number;
}

const PensionContext = createContext<PensionContextType | undefined>(undefined);

export const PensionProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pension_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [contributions, setContributions] = useState<Contribution[]>(() => {
    const savedUser = localStorage.getItem('pension_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        const saved = localStorage.getItem(`pension_contributions_${u.email}`);
        return saved ? JSON.parse(saved) : [];
      } catch (e) { return []; }
    }
    return [];
  });

  const [loans, setLoans] = useState<Loan[]>(() => {
    const savedUser = localStorage.getItem('pension_user');
    const savedLoans = localStorage.getItem('pension_loans');
    const allLoans = savedLoans ? JSON.parse(savedLoans) : [];
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u.isAdmin) return allLoans;
        return allLoans.filter((l: Loan) => l.userId === u.email);
      } catch (e) { return []; }
    }
    return [];
  });

  const [inflationRate, setInflationRate] = useState<number>(() => {
    const saved = localStorage.getItem('pension_inflation_rate');
    return saved ? JSON.parse(saved) : 5.0;
  });

  const [aiPlan, setAiPlan] = useState<AIPlan | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // ── Calculate avg monthly savings from contribution history ───────────────
  const totalInvested = contributions.reduce((sum, c) => sum + c.amount, 0);

  const monthsTracked = (() => {
    if (contributions.length === 0) return 0
    const sorted = [...contributions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    const firstDate = new Date(sorted[0].date)
    const now = new Date()
    return Math.max(
      1,
      (now.getFullYear() - firstDate.getFullYear()) * 12 +
      (now.getMonth() - firstDate.getMonth())
    )
  })()

  const avgMonthlySavings = contributions.length > 0
    ? Math.round(totalInvested / monthsTracked)
    : 0

  // ── Fetch AI Plan ─────────────────────────────────────────────────────────
  const fetchAIPlan = async () => {
    if (!user) return;

    const {
      age, dependents, monthlyExpenses, existingSavings,
      yearsToRetire, minWage, maxWage, minWorkingDays, maxWorkingDays
    } = user;

    if (!age || !minWage || !maxWage || !minWorkingDays || !maxWorkingDays) {
      setAiError('Complete your profile to get AI recommendations.');
      return;
    }

    setAiLoading(true);
    setAiError(null);

    try {
      const retirementAge = age + (yearsToRetire ?? 20);

      const response = await fetch('http://localhost:3000/api/ai/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.email,
          age,
          dependents: dependents ?? 0,
          monthly_expenses: monthlyExpenses ?? 0,
          existing_savings: existingSavings ?? 0,
          retirement_age: retirementAge,
          min_wage: minWage,
          max_wage: maxWage,
          min_days: minWorkingDays,
          max_days: maxWorkingDays,
          avg_monthly_savings: avgMonthlySavings,  // ← from contributions
          total_contributed: totalInvested,          // ← from contributions
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        let msg = 'Failed to fetch AI plan';
        if (typeof err.error === 'string') msg = err.error;
        else if (Array.isArray(err.error)) msg = err.error.map((e: any) => e.msg || JSON.stringify(e)).join('. ');
        else if (err.detail) {
          if (Array.isArray(err.detail)) msg = err.detail.map((e: any) => e.msg || e.message || JSON.stringify(e)).join('. ');
          else if (typeof err.detail === 'string') msg = err.detail;
        }
        throw new Error(msg);
      }

      const data: AIPlan = await response.json();
      setAiPlan(data);
    } catch (err: any) {
      setAiError(err.message || 'Something went wrong. Is the AI server running?');
    } finally {
      setAiLoading(false);
    }
  };

  // ── Effects ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (user) {
      const savedContribs = localStorage.getItem(`pension_contributions_${user.email}`);
      setContributions(savedContribs ? JSON.parse(savedContribs) : []);
      const savedLoans = localStorage.getItem('pension_loans');
      const allLoans: Loan[] = savedLoans ? JSON.parse(savedLoans) : [];
      setLoans(user.isAdmin ? allLoans : allLoans.filter(l => l.userId === user.email));
      setAiPlan(null);
      setAiError(null);
    } else {
      setContributions([]);
      setLoans([]);
    }
  }, [user]);

  useEffect(() => { localStorage.setItem('pension_user', JSON.stringify(user)); }, [user]);

  useEffect(() => {
    if (user) localStorage.setItem(`pension_contributions_${user.email}`, JSON.stringify(contributions));
  }, [contributions, user]);

  useEffect(() => {
    if (user) {
      const savedLoans = localStorage.getItem('pension_loans');
      let allLoans: Loan[] = savedLoans ? JSON.parse(savedLoans) : [];
      if (user.isAdmin) {
        allLoans = loans;
      } else {
        const otherLoans = allLoans.filter(l => l.userId !== user.email);
        allLoans = [...otherLoans, ...loans];
      }
      localStorage.setItem('pension_loans', JSON.stringify(allLoans));
    }
  }, [loans, user]);

  useEffect(() => { localStorage.setItem('pension_inflation_rate', JSON.stringify(inflationRate)); }, [inflationRate]);

  // ── Auth ──────────────────────────────────────────────────────────────────
  const login = (email: string, name: string, isAdmin: boolean, profileData?: Partial<User>) => {
    setContributions([]);
    setLoans([]);
    localStorage.removeItem('pension_contributions');
    const savedProfile = localStorage.getItem(`pension_profile_${email}`);
    const existingProfile = savedProfile ? JSON.parse(savedProfile) : {};
    const newUser = { email, name, isAdmin, ...existingProfile, ...profileData };
    setUser(newUser);
    localStorage.setItem(`pension_profile_${email}`, JSON.stringify(newUser));
  };

  const updateProfile = (profileData: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...profileData };
      localStorage.setItem(`pension_profile_${prev.email}`, JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    setUser(null);
    setContributions([]);
    setLoans([]);
    setAiPlan(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('pension_user');
  };

  // ── Contributions ─────────────────────────────────────────────────────────
  const addContribution = (amount: number, type: 'Daily' | 'Monthly') => {
    const newContribution: Contribution = {
      id: Math.random().toString(36).substr(2, 9),
      amount, type,
      date: new Date().toISOString(),
    };
    setContributions(prev => [newContribution, ...prev]);
  };

  const deleteContribution = (id: string) => setContributions(prev => prev.filter(c => c.id !== id));

  const updateContribution = (id: string, amount: number, type: 'Daily' | 'Monthly') => {
    setContributions(prev => prev.map(c => c.id === id ? { ...c, amount, type } : c));
  };

  const updateInflationRate = (rate: number) => setInflationRate(rate);

  // ── Loans ─────────────────────────────────────────────────────────────────
  const applyForLoan = (amount: number) => {
    if (!user) return;
    const maxLoan = totalInvested * 0.9;
    if (amount > maxLoan) throw new Error("You can only borrow up to 90% of your invested amount.");
    const newLoan: Loan = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.email, userName: user.name,
      amount, status: 'Pending',
      date: new Date().toISOString(),
    };
    setLoans(prev => [newLoan, ...prev]);
  };

  const updateLoanStatus = (loanId: string, status: 'Approved' | 'Rejected') => {
    setLoans(prev => prev.map(loan => loan.id === loanId ? { ...loan, status } : loan));
  };

  const deleteLoan = (loanId: string) => setLoans(prev => prev.filter(l => l.id !== loanId));

  const exportData = () => JSON.stringify({ contributions, loans, inflationRate }, null, 2);

  const importData = (jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.contributions) setContributions(data.contributions);
      if (data.loans) setLoans(data.loans);
      if (data.inflationRate) setInflationRate(data.inflationRate);
      return true;
    } catch (e) { return false; }
  };

  const adjustedReturns = totalInvested + (totalInvested * (inflationRate / 100));
  const loanEligibility = totalInvested * 0.9;
  const userLoan = loans.find(l => l.userId === user?.email) || null;

  return (
    <PensionContext.Provider value={{
      user, login, logout, updateProfile,
      contributions, addContribution, deleteContribution, updateContribution,
      inflationRate, updateInflationRate,
      totalInvested, adjustedReturns,
      loans, applyForLoan, updateLoanStatus, deleteLoan,
      loanEligibility, userLoan,
      exportData, importData,
      aiPlan, aiLoading, aiError, fetchAIPlan,
      avgMonthlySavings, monthsTracked,
    }}>
      {children}
    </PensionContext.Provider>
  );
};

export const usePension = () => {
  const context = useContext(PensionContext);
  if (context === undefined) throw new Error('usePension must be used within a PensionProvider');
  return context;
};