'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
// Sidebar is rendered in the global layout
import { Header } from '@/components/dashboard/header';
import { SidebarInset } from '@/components/ui/sidebar';
import StatsCard from '@/components/dashboard/stats-card';
import { DollarSign, Wallet, PiggyBank, PlusCircle, Coffee, Car, Smile } from 'lucide-react';
import { AddTransactionDialog } from '@/components/dashboard/add-transaction-dialog';
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
  
  const transactionsKey = useMemo(() => user ? `transactions_${user.email}` : null, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  const loadTransactions = () => {
    if (!transactionsKey) return;
    try {
      const stored = localStorage.getItem(transactionsKey);
      if (stored) {
        setAllTransactions(JSON.parse(stored));
      } else {
        localStorage.setItem(transactionsKey, JSON.stringify(fallbackData));
        setAllTransactions(fallbackData);
      }
    } catch (error) {
      console.error("Failed to load transactions", error);
      setAllTransactions(fallbackData);
    }
  };

  useEffect(() => {
    if (transactionsKey) {
      loadTransactions();
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === transactionsKey || e.key === null) { // e.key is null for localStorage.clear()
          loadTransactions();
        }
      };
      window.addEventListener('storage', handleStorageChange);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    } else {
        setAllTransactions([]);
    }
  }, [transactionsKey]);

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
  <SidebarInset className="md:ml-0">
        <Header
          title={t('dashboard')}
          subtitle={`Hola de nuevo, ${user.name}`}
        />
        <main className="p-4 sm:px-6 sm:py-0">
          {/* Hero: título de la app y CTA para crear presupuesto */}
          <section className="mb-6 rounded-lg bg-gradient-to-r from-indigo-600 to-sky-500 p-6 text-white">
            <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-6">
              <div className="w-full md:w-1/2">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">MiControl</h2>
                <p className="mt-2 text-sm sm:text-base opacity-90">Gestiona tus finanzas personales y familiares, controla gastos y alcanza tus metas.</p>
                <div className="mt-4">
                    <AddTransactionDialog initialValues={{ type: 'expense', category: 'Comida' }}>
                      <button aria-label="Añadir transacción" title="Añadir transacción" className="inline-flex items-center justify-center rounded-md bg-white text-slate-900 p-3 font-semibold shadow hover:bg-white/90 motion-safe:animate-[pulse_2s_ease-in-out_infinite] hover:motion-safe:animate-none">
                          <PlusCircle className="h-5 w-5" />
                        </button>
                    </AddTransactionDialog>
                    <div className="mt-3 flex gap-2">
                      <AddTransactionDialog initialValues={{ type: 'expense', category: 'Comida' }}>
                        <button aria-label="Comida" title="Comida" className="inline-flex items-center justify-center rounded-md bg-white/80 text-slate-900 p-2 shadow hover:bg-white/90">
                          <Coffee className="h-4 w-4" />
                        </button>
                      </AddTransactionDialog>
                      <AddTransactionDialog initialValues={{ type: 'expense', category: 'Transporte' }}>
                        <button aria-label="Transporte" title="Transporte" className="inline-flex items-center justify-center rounded-md bg-white/80 text-slate-900 p-2 shadow hover:bg-white/90">
                          <Car className="h-4 w-4" />
                        </button>
                      </AddTransactionDialog>
                      <AddTransactionDialog initialValues={{ type: 'expense', category: 'Ocio' }}>
                        <button aria-label="Ocio" title="Ocio" className="inline-flex items-center justify-center rounded-md bg-white/80 text-slate-900 p-2 shadow hover:bg-white/90">
                          <Smile className="h-4 w-4" />
                        </button>
                      </AddTransactionDialog>
                    </div>
                </div>
              </div>
              <div className="hidden md:flex md:w-1/2 justify-end">
                {/* Ilustración SVG simple y ligera (decorativa) */}
                <svg className="h-40 w-40 text-white/90" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <rect x="10" y="30" width="180" height="120" rx="12" fill="rgba(255,255,255,0.08)" />
                  <rect x="28" y="60" width="18" height="40" rx="3" fill="white" opacity="0.95" />
                  <rect x="58" y="48" width="18" height="52" rx="3" fill="white" opacity="0.85" />
                  <rect x="88" y="36" width="18" height="64" rx="3" fill="white" opacity="0.75" />
                  <rect x="118" y="72" width="18" height="28" rx="3" fill="white" opacity="0.9" />
                  <circle cx="156" cy="52" r="8" fill="white" opacity="0.9" />
                  <path d="M24 26c16-8 40-12 76-8s58 18 76 34" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </section>
          {user.isGuest && (
             <div className="bg-primary/10 border-l-4 border-primary text-primary-foreground p-4 mb-6 rounded-md" role="alert">
                <p className="font-bold">Modo Invitado</p>
                <p>Estás usando una cuenta de invitado. Los datos se borrarán al cerrar sesión.</p>
            </div>
          )}
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title={t('income')}
              amount={formatCurrency(currentIncome)}
              description={`${incomeChange.toFixed(1)}% ${t('since_last_month')}`}
              icon={DollarSign}
              change={incomeChange}
              variant="income"
            />
            <StatsCard
              title={t('expenses')}
              amount={formatCurrency(currentExpenses)}
              description={`${expenseChange.toFixed(1)}% ${t('since_last_month')}`}
              icon={Wallet}
              change={expenseChange}
              variant="expenses"
            />
            <StatsCard
              title={t('savings')}
              amount={formatCurrency(currentSavings)}
              description={`${savingsChange.toFixed(1)}% ${t('since_last_month')}`}
              icon={PiggyBank}
              change={savingsChange}
              variant="savings"
            />
            </div>
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
