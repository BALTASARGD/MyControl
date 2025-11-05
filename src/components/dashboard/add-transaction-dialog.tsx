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
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import type { Transaction } from '@/lib/types';
import { useI18n } from '@/lib/i18n';

const transactionFormSchema = z.object({
  type: z.enum(['income', 'expense'], {
    required_error: 'El tipo es requerido.',
  }),
  amount: z.coerce.number().positive({ message: 'El monto debe ser positivo.' }),
  description: z.string().min(1, { message: 'La descripción es requerida.' }),
  category: z.string().min(1, { required_error: 'La categoría es requerida.' }),
  date: z.string({ required_error: 'La fecha es requerida.' }),
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

export function AddTransactionDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { t } = useI18n();

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

  const transactionType = form.watch('type');

  async function onSubmit(data: TransactionFormValues) {
    try {
      const existingTransactions: Transaction[] = JSON.parse(
        localStorage.getItem('transactions') || '[]'
      );
      const newTransaction: Transaction = {
        ...data,
        id: new Date().toISOString(),
      };
      const updatedTransactions = [...existingTransactions, newTransaction];
      localStorage.setItem(
        'transactions',
        JSON.stringify(updatedTransactions)
      );

      console.log('Transaction saved successfully!');
      setOpen(false);
      // Disparar un evento para que otras partes de la app sepan que se actualizaron las transacciones
      window.dispatchEvent(new Event('storage'));
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
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            {t('add')}
          </span>
        </Button>
      </DialogTrigger>
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
