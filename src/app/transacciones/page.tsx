import { Header } from '@/components/dashboard/header';
import { TransactionsTable } from './transactions-table';
import { ClientOnly } from '@/components/client-only';

export default function TransaccionesPage() {
  return (
    <main>
      <Header title="Transacciones" />
      <div className="p-4 sm:p-6">
        <ClientOnly>
          <TransactionsTable />
        </ClientOnly>
      </div>
    </main>
  );
}
