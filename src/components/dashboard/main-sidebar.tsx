'use client';
import Link from 'next/link';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { AppLogo } from '@/components/icons';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Target,
  BarChart3,
  Settings,
  CircleHelp,
} from 'lucide-react';
import { UserNav } from '@/components/dashboard/user-nav';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n';

export function MainSidebar() {
  const pathname = usePathname();
  const { t } = useI18n();

  const menuItems = [
    { href: '/', icon: LayoutDashboard, label: t('dashboard') },
    { href: '/transacciones', icon: ArrowLeftRight, label: t('transactions') },
    { href: '/presupuestos', icon: Target, label: t('budgets') },
    { href: '/reportes', icon: BarChart3, label: t('reports') },
    { href: '/ajustes', icon: Settings, label: t('settings') },
    { href: '/ayuda', icon: CircleHelp, label: t('help') },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <AppLogo className="size-6 text-primary" />
          <span className="text-lg font-semibold">MiControl</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1">
        <SidebarMenu>
          {menuItems.map((item) => {
            // small palette for colored cards per route
            const colorClass = {
              '/': 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200',
              '/transacciones': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200',
              '/presupuestos': 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200',
              '/reportes': 'bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-200',
              '/ajustes': 'bg-slate-50 text-slate-700 dark:bg-slate-800/40 dark:text-slate-200',
              '/ayuda': 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200',
            }[item.href] || 'bg-background';

            const accentClass = {
              '/': 'before:bg-indigo-600 dark:before:bg-indigo-400',
              '/transacciones': 'before:bg-emerald-600 dark:before:bg-emerald-300',
              '/presupuestos': 'before:bg-amber-600 dark:before:bg-amber-300',
              '/reportes': 'before:bg-sky-600 dark:before:bg-sky-300',
              '/ajustes': 'before:bg-slate-600 dark:before:bg-slate-300',
              '/ayuda': 'before:bg-rose-600 dark:before:bg-rose-300',
            }[item.href] || 'before:bg-transparent';

            const isActive = pathname === item.href;

            // stronger active background similar to header intensity
            const activeBgClass = {
              '/': 'bg-indigo-600 text-white dark:bg-indigo-500 dark:text-white',
              '/transacciones': 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-white',
              '/presupuestos': 'bg-amber-600 text-white dark:bg-amber-500 dark:text-white',
              '/reportes': 'bg-sky-600 text-white dark:bg-sky-500 dark:text-white',
              '/ajustes': 'bg-slate-700 text-white dark:bg-slate-600 dark:text-white',
              '/ayuda': 'bg-rose-600 text-white dark:bg-rose-500 dark:text-white',
            }[item.href] || 'bg-indigo-600 text-white';

            const itemClass = `rounded-lg px-3 py-2 shadow-sm transform-gpu hover:-translate-y-1 hover:shadow-md transition-transform ${isActive ? `${activeBgClass} relative before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r-md ${accentClass}` : colorClass}`;

            return (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={item.label} size="lg" className={itemClass}>
                  <Link href={item.href} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span className="text-lg font-medium">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2">
            <UserNav />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
