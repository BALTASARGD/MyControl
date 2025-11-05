'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Transaction } from '@/lib/types';
import { transactions as fallbackData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  ShoppingCart,
  Utensils,
  Home,
  Car,
  Heart,
  LucideIcon,
  HelpCircle,
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';

const categoryIconMap: Record<string, LucideIcon> = {
  compras: ShoppingCart,
  restaurantes: Utensils,
  vivienda: Home,
  transporte: Car,
  salud: Heart,
  ocio: HelpCircle,
  otros: HelpCircle,
};

export default function RecentTransactions() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  const transactionsKey = useMemo(() => user ? `transactions_${user.email}` : null, [user]);

  const loadData = () => {
    if (!transactionsKey) return;
    try {
      const storedTransactions = localStorage.getItem(transactionsKey);
      const allTransactions = storedTransactions
        ? JSON.parse(storedTransactions)
        : [];
      
      // Ordenamos por fecha y tomamos las últimas 5
      const recent = allTransactions
        .sort((a: Transaction, b: Transaction) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      setTransactions(recent);
    } catch (error) {
      console.error('Error loading recent transactions:', error);
      setTransactions([]);
    }
  };

  useEffect(() => {
    if (transactionsKey) {
        loadData();
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === transactionsKey) {
                loadData();
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
          window.removeEventListener('storage', handleStorageChange);
        };
    } else {
        setTransactions([]);
    }
  }, [transactionsKey]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
            <CardTitle>{t('recent_transactions')}</CardTitle>
            <CardDescription>
                {t('last_5_movements')}
            </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="/transacciones">
            {t('view_all')}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4">
        {transactions.length > 0 ? transactions.map((transaction) => {
          const Icon = categoryIconMap[transaction.category.toLowerCase()] || HelpCircle;
          return (
            <div key={transaction.id} className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarFallback>
                  <Icon className="h-5 w-5 text-muted-foreground" />
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
                - {new Intl.NumberFormat('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(transaction.amount)}
                <p className="text-xs text-muted-foreground font-normal">
                  {new Date(transaction.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                </p>
              </div>
            </div>
          );
        }) : (
          <p className="text-sm text-muted-foreground">{t('no_results')}</p>
        )}
      </CardContent>
    </Card>
  );
}
