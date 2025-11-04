import { Header } from '@/components/dashboard/header';
import { TransactionsTable } from './transactions-table';
import { ClientOnly } from '@/components/client-only';
import { ExportTransactionsButton } from './export-transactions-button';

export default function TransaccionesPage() {
  return (
    <main>
      <Header
        title="Transacciones"
        actions={<ExportTransactionsButton />}
      />
      <div className="p-4 sm:p-6">
        <ClientOnly>
          <div id="transactions-content">
            <TransactionsTable />
          </div>
        </ClientOnly>
      </div>
    </main>
  );
}