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
  const percentage = (budget.spent / budget.limit) * 100;
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
        <Progress value={percentage} />
        <p
          className={cn(
            'text-sm text-muted-foreground mt-2',
            percentage > 100 && 'text-red-500',
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
              }).format(budget.limit - budget.spent)} ${t('remaining')}`}
        </p>
      </CardContent>
    </Card>
  );
}
