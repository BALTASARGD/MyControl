'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import type { Transaction } from '@/lib/types';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';

const transactionFormSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.coerce.number().positive({ message: 'El monto debe ser positivo.' }),
  description: z.string().min(1, { message: 'La descripción es requerida.' }),
  category: z.string().min(1, { message: 'La categoría es requerida.' }),
  date: z.string().min(1, { message: 'La fecha es requerida.' }),
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

export function AddTransactionDialog({ trigger, children, initialValues }: { trigger?: React.ReactNode; children?: React.ReactNode; initialValues?: Partial<TransactionFormValues> }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { t } = useI18n();
  const { user } = useAuth();

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      type: 'expense',
      amount: undefined,
      description: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  // When dialog opens, if initialValues are provided, reset the form with them
  useEffect(() => {
    if (open && initialValues) {
      form.reset({
        type: initialValues.type ?? form.getValues('type'),
        amount: initialValues.amount ?? undefined,
        description: initialValues.description ?? '',
        category: initialValues.category ?? '',
        date: initialValues.date ?? new Date().toISOString().split('T')[0],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const transactionType = form.watch('type');

  async function onSubmit(data: TransactionFormValues) {
    if (!user) {
        console.error("No user logged in to save transaction");
        return;
    }
    try {
      const transactionsKey = `transactions_${user.email}`;
      const existingTransactions: Transaction[] = JSON.parse(
        localStorage.getItem(transactionsKey) || '[]'
      );
      const newTransaction: Transaction = {
        ...data,
        id: new Date().toISOString() + Math.random(), // Make ID more unique
      };
      const updatedTransactions = [...existingTransactions, newTransaction];
      localStorage.setItem(
        transactionsKey,
        JSON.stringify(updatedTransactions)
      );

      console.log('Transaction saved successfully!');
      setOpen(false);
      // Disparar un evento para que otras partes de la app sepan que se actualizaron las transacciones
      window.dispatchEvent(new StorageEvent('storage', { key: transactionsKey }));
      router.refresh();
      form.reset({
        type: 'expense',
        amount: undefined,
        description: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Error saving transaction: ', error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : children ? (
        <DialogTrigger asChild>{children}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              {t('add')}
            </span>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('add_transaction')}</DialogTitle>
          <DialogDescription>
            {t('register_new_income_expense')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('type')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('select_type')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="income">{t('income')}</SelectItem>
                      <SelectItem value="expense">{t('expense')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('amount')}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder={t('amount_placeholder')} {...field} step="0.01" value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('description')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('description_placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('category')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('select_category')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {transactionType === 'income' ? (
                        <>
                          <SelectItem value="Salario">Salario</SelectItem>
                          <SelectItem value="Ventas">Ventas</SelectItem>
                          <SelectItem value="Otros Ingresos">Otros Ingresos</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="Compras">Compras</SelectItem>
                          <SelectItem value="Comida">Comida</SelectItem>
                          <SelectItem value="Transporte">Transporte</SelectItem>
                          <SelectItem value="Vivienda">Vivienda</SelectItem>
                          <SelectItem value="Ocio">Ocio</SelectItem>
                          <SelectItem value="Salud">Salud</SelectItem>
                          <SelectItem value="Otros">Otros</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('date')}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">{t('save')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
