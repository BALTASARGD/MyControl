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
} from 'lucide-react';
import { AddTransactionDialog } from './add-transaction-dialog';
import { UserNav } from './user-nav';

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <SidebarTrigger />
            <span className="sr-only">Toggle Menu</span>
          </Button>
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
              Dashboard
            </Link>
            <Link
              href="#"
              className="flex items-center gap-4 px-2.5 text-foreground"
            >
              <ArrowLeftRight className="h-5 w-5" />
              Transacciones
            </Link>
            <Link
              href="#"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Target className="h-5 w-5" />
              Presupuestos
            </Link>
            <Link
              href="#"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <BarChart3 className="h-5 w-5" />
              Reportes
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="relative ml-auto flex-1 md:grow-0">
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
        <AddTransactionDialog />
        <div className="hidden md:block">
          <UserNav />
        </div>
      </div>
    </header>
  );
}
