'use client';

import { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/dashboard/header';
import { BudgetCard } from './budget-card';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import type { Budget, Transaction } from '@/lib/types';
import { AddBudgetDialog } from './add-budget-dialog';
import { getMonth, getYear, parseISO } from 'date-fns';

interface StoredBudget {
  category: string;
  limit: number;
}

export default function PresupuestosPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  
  const budgetsKey = useMemo(() => user ? `budgets_${user.email}` : null, [user]);
  const transactionsKey = useMemo(() => user ? `transactions_${user.email}` : null, [user]);

  const loadData = () => {
    if (!budgetsKey || !transactionsKey) return;

    try {
      const storedBudgets: StoredBudget[] = JSON.parse(localStorage.getItem(budgetsKey) || '[]');
      const allTransactions: Transaction[] = JSON.parse(localStorage.getItem(transactionsKey) || '[]');
      
      const now = new Date();
      const currentMonth = getMonth(now);
      const currentYear = getYear(now);

      const transactionsThisMonth = allTransactions.filter(tx => {
        const txDate = parseISO(tx.date);
        return getMonth(txDate) === currentMonth && getYear(txDate) === currentYear && tx.type === 'expense';
      });

      const spendingByCategory = transactionsThisMonth.reduce((acc, tx) => {
        if (!acc[tx.category]) {
          acc[tx.category] = 0;
        }
        acc[tx.category] += tx.amount;
        return acc;
      }, {} as Record<string, number>);

      const calculatedBudgets = storedBudgets.map(budget => ({
        ...budget,
        spent: spendingByCategory[budget.category] || 0,
      }));

      setBudgets(calculatedBudgets);

    } catch (error) {
      console.error('Error loading budgets or transactions:', error);
      setBudgets([]);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
      window.addEventListener('storage', loadData);

      return () => {
        window.removeEventListener('storage', loadData);
      };
    } else {
        setBudgets([]);
    }
  }, [user, budgetsKey, transactionsKey]);

  return (
    <main>
      <Header title={t('budgets')} actions={<AddBudgetDialog />} />
      <div className="p-4 sm:p-6">
        {budgets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgets.map((budget) => (
              <BudgetCard key={budget.category} budget={budget} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-12 border-2 border-dashed rounded-lg">
              <h3 className="text-xl font-semibold">{t('no_budgets_yet')}</h3>
              <p className="text-muted-foreground mt-2">{t('create_first_budget')}</p>
              <div className="mt-4">
                <AddBudgetDialog />
              </div>
          </div>
        )}
      </div>
    </main>
  );
}
