'use client';

import { Header } from '@/components/dashboard/header';
import { budgets } from '@/lib/data';
import { BudgetCard } from './budget-card';
import { useI18n } from '@/lib/i18n';

export default function PresupuestosPage() {
  const { t } = useI18n();
  return (
    <main>
      <Header title={t('budgets')} showAddButton />
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((budget) => (
            <BudgetCard key={budget.category} budget={budget} />
          ))}
        </div>
      </div>
    </main>
  );
}
