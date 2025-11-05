import type { Transaction, CategorySpending, Budget } from '@/lib/types';

export const transactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    category: 'Salario',
    description: 'Salario de Julio',
    amount: 2500,
    date: '2024-07-01',
  },
  {
    id: '2',
    type: 'expense',
    category: 'Vivienda',
    description: 'Alquiler',
    amount: 850.0,
    date: '2024-07-05',
  },
  {
    id: '3',
    type: 'expense',
    category: 'Compras',
    description: 'Supermercado semanal',
    amount: 75.6,
    date: '2024-07-10',
  },
  {
    id: '4',
    type: 'expense',
    category: 'Transporte',
    description: 'Abono transporte mensual',
    amount: 50.0,
    date: '2024-07-02',
  },
  {
    id: '5',
    type: 'expense',
    category: 'Restaurantes',
    description: 'Cena con amigos',
    amount: 45.0,
    date: '2024-07-12',
  },
  {
    id: '6',
    type: 'expense',
    category: 'Salud',
    description: 'Farmacia',
    amount: 25.3,
    date: '2024-07-15',
  },
];

export const categorySpending: CategorySpending[] = [
  { name: 'Vivienda', spent: 950, fill: 'var(--color-chart-1)' },
  { name: 'Compras', spent: 430, fill: 'var(--color-chart-2)' },
  { name: 'Transporte', spent: 280, fill: 'var(--color-chart-3)' },
  { name: 'Restaurantes', spent: 220, fill: 'var(--color-chart-4)' },
  { name: 'Ocio', spent: 180, fill: 'var(--color-chart-5)' },
  { name: 'Otros', spent: 150, fill: 'hsl(var(--muted-foreground))' },
];

export const budgets: Budget[] = [
  {
    category: 'Vivienda',
    limit: 1000,
    spent: 950,
  },
  {
    category: 'Comida',
    limit: 500,
    spent: 430,
  },
  {
    category: 'Transporte',
    limit: 300,
    spent: 280,
  },
  {
    category: 'Entretenimiento',
    limit: 200,
    spent: 220,
  },
];
