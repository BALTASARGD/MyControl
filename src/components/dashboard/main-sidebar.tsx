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

export function MainSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '#', icon: ArrowLeftRight, label: 'Transacciones' },
    { href: '#', icon: Target, label: 'Presupuestos' },
    { href: '#', icon: BarChart3, label: 'Reportes' },
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
        <SidebarMenu>
           <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Ajustes">
                <Link href="#">
                    <Settings />
                    <span>Ajustes</span>
                </Link>
            </SidebarMenuButton>
           </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Ayuda">
                <Link href="#">
                    <CircleHelp />
                    <span>Ayuda</span>
                </Link>
            </SidebarMenuButton>
           </SidebarMenuItem>
        </SidebarMenu>
        <div className="p-2">
            <UserNav />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
