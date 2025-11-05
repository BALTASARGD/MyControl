'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AppLogo } from '../icons';
import Link from 'next/link';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Target,
  BarChart3,
  Download,
  ChevronLeft,
  PlusCircle,
} from 'lucide-react';
import { AddTransactionDialog } from './add-transaction-dialog';
import { UserNav } from './user-nav';
import { ClientOnly } from '../client-only';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useI18n } from '@/lib/i18n';
import { LanguageSwitcher } from './language-switcher';

export function Header({
  title,
  subtitle,
  actions,
  showAddButton,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  showAddButton?: boolean;
}) {
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-40 flex h-16 sm:h-20 items-center bg-gradient-to-r from-indigo-600 to-sky-500 text-white shadow-md">
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between px-4 sm:px-6 gap-6">
        <ClientOnly>
          <Sheet>
            <SheetTrigger asChild>
              <SidebarTrigger className="sm:hidden" />
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="#"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <AppLogo className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">MiControl</span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  {t('dashboard')}
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-foreground"
                >
                  <ArrowLeftRight className="h-5 w-5" />
                  {t('transactions')}
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Target className="h-5 w-5" />
                  {t('budgets')}
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <BarChart3 className="h-5 w-5" />
                  {t('reports')}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </ClientOnly>

        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{title}</h1>
            {subtitle && <p className="text-sm sm:text-base text-white/90">{subtitle}</p>}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {actions}
          {showAddButton && (
            <AddTransactionDialog
              trigger={
                <Button size="lg" className="gap-2">
                  <PlusCircle className="h-5 w-5" />
                  <span className="hidden sm:inline">{t('add_transaction')}</span>
                </Button>
              }
            />
          )}
          <LanguageSwitcher />
          <ClientOnly>
            <UserNav />
          </ClientOnly>
        </div>
      </div>
    </header>
  );
}
