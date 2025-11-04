'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function ExportTransactionsButton() {
  const handlePrint = () => {
    // Oculta todo menos la tabla de transacciones
    const originalBody = document.body.innerHTML;
    const printContent = document.getElementById('transactions-content')?.innerHTML;
    
    if (printContent) {
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalBody;
      // Es necesario recargar para restaurar los listeners de eventos
      window.location.reload(); 
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handlePrint}>
      <Download className="mr-2 h-4 w-4" />
      Exportar
    </Button>
  );
}
