'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/dashboard/header';
import { TransactionsTable } from './transactions-table';
import { ClientOnly } from '@/components/client-only';
import { ExportTransactionsButton } from './export-transactions-button';
import type { Transaction } from '@/lib/types';
import { transactions as fallbackData } from '@/lib/data';

export default function TransaccionesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const loadData = () => {
      try {
        const storedTransactions = localStorage.getItem('transactions');
        if (storedTransactions) {
          const parsed = JSON.parse(storedTransactions);
          setTransactions(parsed);
          setFilteredTransactions(parsed);
        } else {
          localStorage.setItem('transactions', JSON.stringify(fallbackData));
          setTransactions(fallbackData);
          setFilteredTransactions(fallbackData);
        }
      } catch (error) {
        console.error('Error loading transactions from localStorage', error);
        setTransactions(fallbackData);
        setFilteredTransactions(fallbackData);
      }
    };
    
    loadData();

    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <main>
      <Header
        title="Transacciones"
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
