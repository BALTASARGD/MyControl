import { Header } from '@/components/dashboard/header';
import { transactions } from '@/lib/data';
import { TransactionsTable } from './transactions-table';

export default function TransaccionesPage() {
  return (
    <main>
      <Header title="Transacciones" />
      <div className="p-4 sm:p-6">
        <TransactionsTable data={transactions} />
      </div>
    </main>
  );
}
