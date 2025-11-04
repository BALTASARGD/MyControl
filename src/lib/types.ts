import type { LucideIcon } from 'lucide-react';

export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  category: string;
  categoryIcon: LucideIcon;
  description: string;
  amount: number;
  date: string;
};

export type CategorySpending = {
  name: string;
  spent: number;
  fill: string;
};

export type Budget = {
  category: string;
  limit: number;
  spent: number;
};
