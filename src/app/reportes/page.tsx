
'use client';
import { Header } from '@/components/dashboard/header';
import StatsCard from '@/components/dashboard/stats-card';
import { DollarSign, Wallet, PiggyBank } from 'lucide-react';
import SpendingChart from '@/components/dashboard/spending-chart';

export default function ReportesPage() {
  // Estos datos serían dinámicos en una aplicación real
  const totalIncome = 4523.18;
  const totalExpense = 2129.50;
  const netSavings = totalIncome - totalExpense;

  return (
    <main>
      <Header title="Reportes" />
      <div className="p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <StatsCard
              title="Ingresos Totales"
              amount={new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(totalIncome)}
              description="del último mes"
              icon={DollarSign}
              change={0}
            />
            <StatsCard
              title="Gastos Totales"
              amount={new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(totalExpense)}
              description="del último mes"
              icon={Wallet}
              change={0}
            />
            <StatsCard
              title="Ahorro Neto"
              amount={new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(netSavings)}
              description="del último mes"
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
