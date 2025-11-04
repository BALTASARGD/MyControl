'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Transaction } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  ShoppingCart,
  Utensils,
  Home,
  Car,
  Heart,
  LucideIcon,
  HelpCircle, // Icono por defecto
} from 'lucide-react';

// Mapeo de categorías en español a iconos
const categoryIconMap: Record<string, LucideIcon> = {
  compras: ShoppingCart,
  comida: Utensils,
  vivienda: Home,
  transporte: Car,
  salud: Heart,
  ocio: HelpCircle, // Sin icono específico, usamos uno por defecto
  otros: HelpCircle, // Sin icono específico, usamos uno por defecto
  restaurantes: Utensils,
};

const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'category',
    header: 'Categoría',
    cell: ({ row }) => {
      const Icon = categoryIconMap[row.original.category.toLowerCase()] || HelpCircle;
      return (
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-muted-foreground" />
          <span>{row.original.category}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Descripción',
  },
  {
    accessorKey: 'date',
    header: 'Fecha',
    cell: ({ row }) =>
      new Date(row.original.date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }),
  },
  {
    accessorKey: 'type',
    header: 'Tipo',
    cell: ({ row }) => {
      const isIncome = row.original.type === 'income';
      return (
        <Badge variant={isIncome ? 'default' : 'destructive'} className={isIncome ? 'bg-green-600' : ''}>
          {isIncome ? 'Ingreso' : 'Gasto'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: 'Monto',
    cell: ({ row }) => {
      const isIncome = row.original.type === 'income';
      const formattedAmount = new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
      }).format(row.original.amount);
      return (
        <span className={isIncome ? 'text-green-600' : 'text-red-600'}>
          {isIncome ? '+' : '-'}
          {formattedAmount}
        </span>
      );
    },
  },
];

type TransactionsTableProps = {
  data: Transaction[];
  onFilterChange: (filteredData: Transaction[]) => void;
};

export function TransactionsTable({ data, onFilterChange }: TransactionsTableProps) {
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
    },
  });

  useEffect(() => {
    const filteredData = table.getFilteredRowModel().rows.map(row => row.original);
    onFilterChange(filteredData);
  }, [globalFilter, data, table, onFilterChange]);

  return (
    <div className="space-y-4">
      <Input
        placeholder="Filtrar transacciones..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="max-w-sm"
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
