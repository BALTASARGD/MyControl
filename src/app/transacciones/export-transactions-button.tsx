'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function ExportTransactionsButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style jsx global>{`
        @media print {
          body > *:not(#transactions-content) {
            display: none;
          }
          #transactions-content {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
          }
        }
      `}</style>
      <Button variant="outline" size="sm" onClick={handlePrint}>
        <Download className="mr-2 h-4 w-4" />
        Exportar
      </Button>
    </>
  );
}