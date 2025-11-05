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
      <CardHeader>
        <CardTitle>{budget.category}</CardTitle>
        <CardDescription>
          {formattedSpent} {t('of')} {formattedLimit}
        </CardDescription>
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
