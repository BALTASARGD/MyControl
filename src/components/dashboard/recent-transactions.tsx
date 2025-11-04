import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { transactions } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export default function RecentTransactions() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
            <CardTitle>Transacciones Recientes</CardTitle>
            <CardDescription>
                Últimos 5 movimientos.
            </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="#">
            Ver Todas
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center gap-4">
            <Avatar className="hidden h-9 w-9 sm:flex">
              <AvatarFallback>
                <transaction.categoryIcon className="h-5 w-5 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">
                {transaction.category}
              </p>
              <p className="text-sm text-muted-foreground">
                {transaction.description}
              </p>
            </div>
            <div className="ml-auto font-medium text-right">
              - {transaction.amount.toFixed(2)}€
              <p className="text-xs text-muted-foreground font-normal">
                {new Date(transaction.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
