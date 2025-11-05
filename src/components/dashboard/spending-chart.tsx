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
import type { Transaction } from '@/lib/types';
import { useI18n } from '@/lib/i18n';
import { useMemo } from 'react';
import { format, getMonth, getYear } from 'date-fns';
import { es } from 'date-fns/locale';

const chartColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--muted-foreground))',
];

export default function SpendingChart({ transactions }: { transactions: Transaction[] }) {
  const { t } = useI18n();

  const { chartData, chartConfig, currentMonthYear } = useMemo(() => {
    const now = new Date();
    const currentMonth = getMonth(now);
    const currentYear = getYear(now);
    
    const monthYear = format(now, "MMMM yyyy", { locale: es });


    const spendingByCategory = transactions
      .filter(tx => {
        const txDate = new Date(tx.date);
        return tx.type === 'expense' && getMonth(txDate) === currentMonth && getYear(txDate) === currentYear;
      })
      .reduce((acc, tx) => {
        if (!acc[tx.category]) {
          acc[tx.category] = 0;
        }
        acc[tx.category] += tx.amount;
        return acc;
      }, {} as Record<string, number>);

    const dynamicChartData = Object.entries(spendingByCategory)
      .map(([name, spent], index) => ({
        name,
        spent,
        fill: chartColors[index % chartColors.length],
      }))
      .sort((a, b) => b.spent - a.spent);

    const dynamicChartConfig: ChartConfig = {
      spent: { label: t('expenses') },
    };
    dynamicChartData.forEach(item => {
      dynamicChartConfig[item.name] = {
        label: item.name,
        color: item.fill,
      };
    });

    return { 
      chartData: dynamicChartData, 
      chartConfig: dynamicChartConfig,
      currentMonthYear: monthYear.charAt(0).toUpperCase() + monthYear.slice(1)
    };
  }, [transactions, t]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('spending_by_category')}</CardTitle>
        <CardDescription>{currentMonthYear}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  width={100}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted))' }} 
                  content={<ChartTooltipContent 
                    formatter={(value) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value as number)}
                  />} 
                />
                <Bar dataKey="spent" radius={5} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
              {t('no_results')}
            </div>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
