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

export function BudgetCard({ budget }: { budget: Budget }) {
  const percentage = (budget.spent / budget.limit) * 100;
  const formattedSpent = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(budget.spent);
  const formattedLimit = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(budget.limit);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{budget.category}</CardTitle>
        <CardDescription>
          {formattedSpent} de {formattedLimit}
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
            ? `Te has pasado por ${new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'MXN',
              }).format(budget.spent - budget.limit)}`
            : `${new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'MXN',
              }).format(budget.limit - budget.spent)} restantes`}
        </p>
      </CardContent>
    </Card>
  );
}
