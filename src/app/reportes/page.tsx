'use client';

import { useEffect, useState, useMemo } from 'react';
import { Header } from '@/components/dashboard/header';
import StatsCard from '@/components/dashboard/stats-card';
import { DollarSign, Wallet, PiggyBank } from 'lucide-react';
import SpendingChart from '@/components/dashboard/spending-chart';
import { useI18n } from '@/lib/i18n';
import type { Transaction } from '@/lib/types';
import { useAuth } from '@/lib/auth';
import { isSameMonth, parseISO } from 'date-fns';

export default function ReportesPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

  const transactionsKey = useMemo(() => user ? `transactions_${user.email}` : null, [user]);

  useEffect(() => {
    const loadTransactions = () => {
      if (!transactionsKey) return;
      try {
        const stored = localStorage.getItem(transactionsKey);
        if (stored) {
          setAllTransactions(JSON.parse(stored));
        } else {
          setAllTransactions([]);
        }
      } catch (error) {
        console.error("Failed to load transactions", error);
        setAllTransactions([]);
      }
    };
    
    if (transactionsKey) {
        loadTransactions();
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === transactionsKey) {
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
  
  const { totalIncome, totalExpense, netSavings } = useMemo(() => {
    const now = new Date();
    const transactionsThisMonth = allTransactions.filter(tx => isSameMonth(parseISO(tx.date), now));

    let income = 0;
    let expenses = 0;
    transactionsThisMonth.forEach(tx => {
      if (tx.type === 'income') {
        income += tx.amount;
      } else {
        expenses += tx.amount;
      }
    });
    
    return {
      totalIncome: income,
      totalExpense: expenses,
      netSavings: income - expenses
    };

  }, [allTransactions]);

  return (
    <main>
      <Header title={t('reports')} />
      <div className="p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <StatsCard
              title={t('total_income')}
              amount={formatCurrency(totalIncome)}
              description={t('of_last_month')}
              icon={DollarSign}
              change={0}
            />
            <StatsCard
              title={t('total_expenses')}
              amount={formatCurrency(totalExpense)}
              description={t('of_last_month')}
              icon={Wallet}
              change={0}
            />
            <StatsCard
              title={t('net_savings')}
              amount={formatCurrency(netSavings)}
              description={t('of_last_month')}
              icon={PiggyBank}
              change={netSavings > 0 ? 1 : (netSavings < 0 ? -1 : 0)}
            />
        </div>
        
        <div className="grid grid-cols-1">
            <SpendingChart transactions={allTransactions} />
        </div>

      </div>
    </main>
  );
}
