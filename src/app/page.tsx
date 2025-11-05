'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { MainSidebar } from '@/components/dashboard/main-sidebar';
import { Header } from '@/components/dashboard/header';
import { SidebarInset } from '@/components/ui/sidebar';
import StatsCard from '@/components/dashboard/stats-card';
import { DollarSign, Wallet, PiggyBank } from 'lucide-react';
import SpendingChart from '@/components/dashboard/spending-chart';
import RecentTransactions from '@/components/dashboard/recent-transactions';
import { useI18n } from '@/lib/i18n';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { t } = useI18n();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

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
              amount="€4,523.18"
              description={`+20.1% ${t('since_last_month')}`}
              icon={DollarSign}
              change={20.1}
            />
            <StatsCard
              title={t('expenses')}
              amount="€2,129.50"
              description={`-10.5% ${t('since_last_month')}`}
              icon={Wallet}
              change={-10.5}
            />
            <StatsCard
              title={t('savings')}
              amount="€2,393.68"
              description={`+33.3% ${t('since_last_month')}`}
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
            </div>
          </div>
        </main>
      </SidebarInset>
    </>
  );
}
