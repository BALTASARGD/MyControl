'use client';

import { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/dashboard/header';
import { TransactionsTable } from './transactions-table';
import { ClientOnly } from '@/components/client-only';
import { ExportTransactionsButton } from './export-transactions-button';
import type { Transaction } from '@/lib/types';
import { transactions as fallbackData } from '@/lib/data';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';

export default function TransaccionesPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  
  const transactionsKey = useMemo(() => user ? `transactions_${user.email}` : null, [user]);

  useEffect(() => {
    const loadData = () => {
      if (!transactionsKey) return;
      try {
        const storedTransactions = localStorage.getItem(transactionsKey);
        if (storedTransactions) {
          const parsed = JSON.parse(storedTransactions);
          setTransactions(parsed);
          setFilteredTransactions(parsed);
        } else {
          // Si el usuario es nuevo, no establecer datos de ejemplo. Empezar en blanco.
          const initialData: Transaction[] = [];
          localStorage.setItem(transactionsKey, JSON.stringify(initialData));
          setTransactions(initialData);
          setFilteredTransactions(initialData);
        }
      } catch (error) {
        console.error('Error loading transactions from localStorage', error);
        setTransactions([]);
        setFilteredTransactions([]);
      }
    };
    
    if (transactionsKey) {
        loadData();
    } else {
        setTransactions([]);
        setFilteredTransactions([]);
    }

    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === transactionsKey) {
            loadData();
        }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [transactionsKey]);

  return (
    <main>
      <Header
        title={t('transactions')}
        showAddButton
        actions={
          <ClientOnly>
            <ExportTransactionsButton data={filteredTransactions} />
          </ClientOnly>
        }
      />
      <div className="p-4 sm:p-6" id="transactions-content">
        <ClientOnly>
          <TransactionsTable 
            data={transactions} 
            onFilterChange={setFilteredTransactions} 
          />
        </ClientOnly>
      </div>
    </main>
  );
}
