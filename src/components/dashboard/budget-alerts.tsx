'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { analyzeSpendingAndAlert } from '@/ai/flows/budget-alerts';
import { useI18n } from '@/lib/i18n';

export default function BudgetAlerts() {
  const { t } = useI18n();
  const [budgetAnalysis, setBudgetAnalysis] = useState<{alert: boolean, message: string} | null>(null);

  useEffect(() => {
    async function getAnalysis() {
      const spendingData = [
        { date: '2024-07-01', amount: 30.5 },
        { date: '2024-07-05', amount: 85.2 },
        { date: '2024-07-10', amount: 42.0 },
        { date: '2024-07-15', amount: 95.7 },
        { date: '2024-07-22', amount: 75.6 },
      ];

      try {
        const analysis = await analyzeSpendingAndAlert({
          category: 'Compras',
          budget: 400,
          spendingData: spendingData,
        });
        setBudgetAnalysis(analysis);
      } catch (error) {
        console.error("Error analyzing budget:", error);
        setBudgetAnalysis({
          alert: true,
          message: 'Could not analyze budget. Check console for details.',
        });
      }
    }

    getAnalysis();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('budget_alerts')}</CardTitle>
      </CardHeader>
      <CardContent>
        {!budgetAnalysis ? (
          <div className="text-sm text-muted-foreground">{t('analyzing')}...</div>
        ) : budgetAnalysis.alert ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t('attention')}!</AlertTitle>
            <AlertDescription>{budgetAnalysis.message}</AlertDescription>
          </Alert>
        ) : (
          <div className="text-sm text-muted-foreground">
            {t('no_alerts')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
