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
import { PlusCircle, Pencil } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import type { Budget } from '@/lib/types';

const budgetFormSchema = z.object({
  category: z.string().min(1, { message: 'La categoría es requerida.' }),
  limit: z.coerce.number().positive({ message: 'El límite debe ser un número positivo.' }),
});

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

interface StoredBudget {
  category: string;
  limit: number;
}

const expenseCategories = [
  "Compras", "Comida", "Transporte", "Vivienda", "Ocio", "Salud", "Otros", "Restaurantes"
];

interface AddBudgetDialogProps {
  budgetToEdit?: Budget;
  children: React.ReactNode;
}


export function AddBudgetDialog({ budgetToEdit, children }: AddBudgetDialogProps) {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  const { user } = useAuth();
  const isEditing = !!budgetToEdit;

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      category: '',
      limit: undefined,
    },
  });

  useEffect(() => {
    if (isEditing && budgetToEdit) {
      form.reset({
        category: budgetToEdit.category,
        limit: budgetToEdit.limit,
      });
    } else {
      form.reset({
        category: '',
        limit: undefined,
      });
    }
  }, [isEditing, budgetToEdit, form]);

  const budgetsKey = useMemo(() => (user ? `budgets_${user.email}` : null), [user]);

  async function onSubmit(data: BudgetFormValues) {
    if (!budgetsKey) {
      console.error("No user logged in to save budget");
      return;
    }
    try {
      const existingBudgets: StoredBudget[] = JSON.parse(
        localStorage.getItem(budgetsKey) || '[]'
      );

      const isExisting = existingBudgets.some(b => b.category === data.category);

      let updatedBudgets;
      if (isExisting) {
        // Update existing budget
        updatedBudgets = existingBudgets.map(b => 
          b.category === data.category ? { ...b, limit: data.limit } : b
        );
      } else {
        // Add new budget
        const newBudget: StoredBudget = { ...data };
        updatedBudgets = [...existingBudgets, newBudget];
      }
      
      localStorage.setItem(budgetsKey, JSON.stringify(updatedBudgets));

      console.log('Budget saved successfully!');
      setOpen(false);
      window.dispatchEvent(new StorageEvent('storage', { key: budgetsKey }));
      if (!isEditing) {
        form.reset({
          category: '',
          limit: undefined
        });
      }
    } catch (error) {
      console.error('Error saving budget: ', error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? t('edit_budget') : t('add_budget')}</DialogTitle>
          <DialogDescription>
            {isEditing ? t('update_budget_details') : t('create_new_budget')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('category')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isEditing}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('select_category')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {expenseCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('limit')}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder={t('limit_placeholder')} {...field} step="0.01" value={field.value ?? ''}/>
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