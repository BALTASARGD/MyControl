'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { MainSidebar } from '@/components/dashboard/main-sidebar';
import { Header } from '@/components/dashboard/header';
import { SidebarInset } from '@/components/ui/sidebar';
import StatsCard from '@/components/dashboard/stats-card';
import { DollarSign, Wallet, PiggyBank } from 'lucide-react';
import SpendingChart from '@/components/dashboard/spending-chart';
import RecentTransactions from '@/components/dashboard/recent-transactions';
import { useI18n } from '@/lib/i18n';
import type { Transaction } from '@/lib/types';
import { transactions as fallbackData } from '@/lib/data';
import { isSameMonth, subMonths, parseISO } from 'date-fns';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { t } = useI18n();
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  const loadTransactions = () => {
    try {
      const stored = localStorage.getItem('transactions');
      if (stored) {
        setAllTransactions(JSON.parse(stored));
      } else {
        localStorage.setItem('transactions', JSON.stringify(fallbackData));
        setAllTransactions(fallbackData);
      }
    } catch (error) {
      console.error("Failed to load transactions", error);
      setAllTransactions(fallbackData);
    }
  };

  useEffect(() => {
    loadTransactions();
    window.addEventListener('storage', loadTransactions);
    return () => {
      window.removeEventListener('storage', loadTransactions);
    };
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };
  
  const {
    currentIncome,
    currentExpenses,
    currentSavings,
    incomeChange,
    expenseChange,
    savingsChange,
  } = useMemo(() => {
    const now = new Date();
    const lastMonth = subMonths(now, 1);

    const transactionsThisMonth = allTransactions.filter(tx => isSameMonth(parseISO(tx.date), now));
    const transactionsLastMonth = allTransactions.filter(tx => isSameMonth(parseISO(tx.date), lastMonth));

    const calcTotals = (transactions: Transaction[]) => {
      let income = 0;
      let expenses = 0;
      transactions.forEach(tx => {
        if (tx.type === 'income') {
          income += tx.amount;
        } else {
          expenses += tx.amount;
        }
      });
      return { income, expenses, savings: income - expenses };
    };

    const currentTotals = calcTotals(transactionsThisMonth);
    const previousTotals = calcTotals(transactionsLastMonth);
    
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    return {
      currentIncome: currentTotals.income,
      currentExpenses: currentTotals.expenses,
      currentSavings: currentTotals.savings,
      incomeChange: calculateChange(currentTotals.income, previousTotals.income),
      expenseChange: calculateChange(currentTotals.expenses, previousTotals.expenses),
      savingsChange: calculateChange(currentTotals.savings, previousTotals.savings),
    };

  }, [allTransactions]);

  if (loading || !user) {
    return <div className="flex h-screen items-center justify-center">{t('loading')}...</div>;
  }

  return (
    <>
      <MainSidebar />
      <SidebarInset>
        <Header
          title={t('dashboard')}
        />
        <main className="p-4 sm:px-6 sm:py-0">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title={t('income')}
              amount={formatCurrency(currentIncome)}
              description={`${incomeChange.toFixed(1)}% ${t('since_last_month')}`}
              icon={DollarSign}
              change={incomeChange}
            />
            <StatsCard
              title={t('expenses')}
              amount={formatCurrency(currentExpenses)}
              description={`${expenseChange.toFixed(1)}% ${t('since_last_month')}`}
              icon={Wallet}
              change={expenseChange}
            />
            <StatsCard
              title={t('savings')}
              amount={formatCurrency(currentSavings)}
              description={`${savingsChange.toFixed(1)}% ${t('since_last_month')}`}
              icon={PiggyBank}
              change={savingsChange}
            />
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SpendingChart transactions={allTransactions} />
            </div>
            <div className="space-y-4">
              <RecentTransactions />
            </div>
          </div>
        </main>
      </SidebarInset>
    </>
  );
}
