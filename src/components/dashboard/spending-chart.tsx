'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { categorySpending } from '@/lib/data';
import { useI18n } from '@/lib/i18n';

const chartConfig = {
  spent: {
    label: 'Spent',
  },
  Vivienda: {
    label: 'Housing',
    color: 'hsl(var(--chart-1))',
  },
  Compras: {
    label: 'Shopping',
    color: 'hsl(var(--chart-2))',
  },
  Transporte: {
    label: 'Transport',
    color: 'hsl(var(--chart-3))',
  },
  Restaurantes: {
    label: 'Restaurants',
    color: 'hsl(var(--chart-4))',
  },
  Ocio: {
    label: 'Leisure',
    color: 'hsl(var(--chart-5))',
  },
  Otros: {
    label: 'Others',
    color: 'hsl(var(--muted-foreground))',
  },
} satisfies ChartConfig;

export default function SpendingChart() {
  const { t } = useI18n();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('spending_by_category')}</CardTitle>
        <CardDescription>July 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categorySpending} layout="vertical">
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                width={80}
              />
              <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
              <Bar dataKey="spent" radius={5} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
