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
} from 'lucide-react';
import { AddTransactionDialog } from './add-transaction-dialog';
import { UserNav } from './user-nav';
import { ClientOnly } from '../client-only';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useI18n } from '@/lib/i18n';
import { LanguageSwitcher } from './language-switcher';

export function Header({
  title,
  actions,
  showAddButton,
}: {
  title: string;
  actions?: React.ReactNode;
  showAddButton?: boolean;
}) {
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
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
        <Button variant="outline" size="icon" className="h-7 w-7">
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">{t('back')}</span>
        </Button>
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">{t('dashboard')}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="ml-auto flex items-center gap-2">
        {actions}
        {showAddButton && <AddTransactionDialog />}
        <LanguageSwitcher />
        <ClientOnly>
          <UserNav />
        </ClientOnly>
      </div>
    </header>
  );
}
