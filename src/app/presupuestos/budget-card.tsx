'use client';

import type { Budget } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { AddBudgetDialog } from './add-budget-dialog';

export function BudgetCard({ budget }: { budget: Budget }) {
  const { t } = useI18n();
  const percentage = budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;
  
  const formattedSpent = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(budget.spent);
  const formattedLimit = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(budget.limit);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>{budget.category}</CardTitle>
          <CardDescription>
            {formattedSpent} {t('of')} {formattedLimit}
          </CardDescription>
        </div>
        <AddBudgetDialog budgetToEdit={budget}>
          <Button variant="ghost" size="icon" className="h-8 w-8">
              <Pencil className="h-4 w-4" />
          </Button>
        </AddBudgetDialog>
      </CardHeader>
      <CardContent>
        <Progress value={Math.min(percentage, 100)} className="h-2" />
        <p
          className={cn(
            'text-sm text-muted-foreground mt-2',
            percentage > 100 && 'text-red-500 font-medium',
          )}
        >
          {percentage > 100
            ? `${t('overspent_by')} ${new Intl.NumberFormat('es-ES', {
                style: 'currency',
                currency: 'EUR',
              }).format(budget.spent - budget.limit)}`
            : `${new Intl.NumberFormat('es-ES', {
                style: 'currency',
                currency: 'EUR',
              }).format(Math.max(0, budget.limit - budget.spent))} ${t('remaining')}`}
        </p>
      </CardContent>
    </Card>
  );
}