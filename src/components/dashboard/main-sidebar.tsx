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
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
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
