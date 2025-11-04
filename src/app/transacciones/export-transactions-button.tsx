'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { Transaction } from '@/lib/types';
import { useI18n } from '@/lib/i18n';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export function ExportTransactionsButton({ data }: { data: Transaction[] }) {
  const { t } = useI18n();
  const handleExport = () => {
    const doc = new jsPDF();

    doc.text(t('report_of_transactions'), 14, 16);

    const tableColumn = [t('date'), t('category'), t('description'), t('type'), t('amount')];
    const tableRows: (string | number)[][] = [];

    data.forEach((transaction) => {
      const transactionData = [
        new Date(transaction.date).toLocaleDateString('es-ES'),
        transaction.category,
        transaction.description,
        transaction.type === 'income' ? t('income') : t('expense'),
        new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency: 'EUR',
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
      {t('export_pdf')}
    </Button>
  );
}
