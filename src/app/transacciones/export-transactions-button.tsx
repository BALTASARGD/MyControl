'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { Transaction } from '@/lib/types';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export function ExportTransactionsButton({ data }: { data: Transaction[] }) {
  const handleExport = () => {
    const doc = new jsPDF();

    doc.text('Reporte de Transacciones', 14, 16);

    const tableColumn = ['Fecha', 'Categoría', 'Descripción', 'Tipo', 'Monto'];
    const tableRows: (string | number)[][] = [];

    data.forEach((transaction) => {
      const transactionData = [
        new Date(transaction.date).toLocaleDateString('es-ES'),
        transaction.category,
        transaction.description,
        transaction.type === 'income' ? 'Ingreso' : 'Gasto',
        new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN',
        }).format(transaction.amount),
      ];
      tableRows.push(transactionData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('transacciones.pdf');
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      <Download className="mr-2 h-4 w-4" />
      Exportar PDF
    </Button>
  );
}
