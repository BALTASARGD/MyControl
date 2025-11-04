import { Header } from '@/components/dashboard/header';
import { TransactionsTable } from './transactions-table';
import { ClientOnly } from '@/components/client-only';
import { ExportTransactionsButton } from './export-transactions-button';

export default function TransaccionesPage() {
  return (
    <main>
      <Header
        title="Transacciones"
        actions={
          <ClientOnly>
            <ExportTransactionsButton />
          </ClientOnly>
        }
      />
      <div className="p-4 sm:p-6" id="transactions-content">
        <ClientOnly>
          <TransactionsTable />
        </ClientOnly>
      </div>
    </main>
  );
}
