'use client';
import { Header } from '@/components/dashboard/header';
import StatsCard from '@/components/dashboard/stats-card';
import { DollarSign, Wallet, PiggyBank } from 'lucide-react';
import SpendingChart from '@/components/dashboard/spending-chart';
import { useI18n } from '@/lib/i18n';

export default function ReportesPage() {
  const { t } = useI18n();
  // Estos datos serían dinámicos en una aplicación real
  const totalIncome = 4523.18;
  const totalExpense = 2129.50;
  const netSavings = totalIncome - totalExpense;

  return (
    <main>
      <Header title={t('reports')} />
      <div className="p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <StatsCard
              title={t('total_income')}
              amount={new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(totalIncome)}
              description={t('of_last_month')}
              icon={DollarSign}
              change={0}
            />
            <StatsCard
              title={t('total_expenses')}
              amount={new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(totalExpense)}
              description={t('of_last_month')}
              icon={Wallet}
              change={0}
            />
            <StatsCard
              title={t('net_savings')}
              amount={new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(netSavings)}
              description={t('of_last_month')}
              icon={PiggyBank}
              change={0}
            />
        </div>
        
        <div className="grid grid-cols-1">
            <SpendingChart />
        </div>

      </div>
    </main>
  );
}
