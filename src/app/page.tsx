import { MainSidebar } from '@/components/dashboard/main-sidebar';
import { Header } from '@/components/dashboard/header';
import { SidebarInset } from '@/components/ui/sidebar';
import StatsCard from '@/components/dashboard/stats-card';
import { DollarSign, Wallet, PiggyBank, ArrowUp, ArrowDown } from 'lucide-react';
import SpendingChart from '@/components/dashboard/spending-chart';
import RecentTransactions from '@/components/dashboard/recent-transactions';
import BudgetAlerts from '@/components/dashboard/budget-alerts';

export default function DashboardPage() {
  return (
    <>
      <MainSidebar />
      <SidebarInset>
        <Header />
        <main className="p-4 sm:px-6 sm:py-0">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Ingresos"
              amount="4,523.18€"
              description="+20.1% desde el mes pasado"
              icon={DollarSign}
              change={20.1}
            />
            <StatsCard
              title="Gastos"
              amount="2,129.50€"
              description="-10.5% desde el mes pasado"
              icon={Wallet}
              change={-10.5}
            />
            <StatsCard
              title="Ahorros"
              amount="2,393.68€"
              description="+33.3% desde el mes pasado"
              icon={PiggyBank}
              change={33.3}
            />
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SpendingChart />
            </div>
            <div className="space-y-4">
              <RecentTransactions />
              <BudgetAlerts />
            </div>
          </div>
        </main>
      </SidebarInset>
    </>
  );
}
