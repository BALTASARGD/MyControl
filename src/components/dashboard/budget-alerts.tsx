'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { analyzeSpendingAndAlert } from '@/ai/flows/budget-alerts';
import { useI18n } from '@/lib/i18n';
import type { Transaction } from '@/lib/types';
import { transactions as fallbackData } from '@/lib/data';

const isApiKeyAvailable = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export default function BudgetAlerts() {
  const { t } = useI18n();
  const [budgetAnalysis, setBudgetAnalysis] = useState<{alert: boolean, message: string} | null>(null);

  useEffect(() => {
    async function getAnalysis() {
      if (!isApiKeyAvailable) {
        setBudgetAnalysis({
          alert: false,
          message: 'El análisis de presupuesto no está disponible. Falta la clave de API.',
        });
        return;
      }

      try {
        const storedTransactions = localStorage.getItem('transactions');
        const allTransactions: Transaction[] = storedTransactions
          ? JSON.parse(storedTransactions)
          : fallbackData;

        const spendingDataForCategory = allTransactions
          .filter(t => t.category === 'Compras' && t.type === 'expense')
          .map(t => ({ date: t.date, amount: t.amount }));

        if (spendingDataForCategory.length > 0) {
          const analysis = await analyzeSpendingAndAlert({
            category: 'Compras',
            budget: 400, // Manteniendo el presupuesto de ejemplo por ahora
            spendingData: spendingDataForCategory,
          });
          setBudgetAnalysis(analysis);
        } else {
          setBudgetAnalysis({
            alert: false,
            message: 'No hay gastos en la categoría Compras para analizar.',
          });
        }
      } catch (error) {
        console.error("Error analyzing budget:", error);
        setBudgetAnalysis({
          alert: true,
          message: 'Could not analyze budget. Check console for details.',
        });
      }
    }

    getAnalysis();
    
    // Volver a analizar cuando cambien las transacciones
    window.addEventListener('storage', getAnalysis);
    return () => {
      window.removeEventListener('storage', getAnalysis);
    };
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
            {budgetAnalysis.message || t('no_alerts')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
