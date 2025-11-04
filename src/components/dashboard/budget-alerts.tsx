'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { analyzeSpendingAndAlert } from '@/ai/flows/budget-alerts';

export default function BudgetAlerts() {
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

      // La variable de entorno solo se puede leer en el servidor,
      // pero este es un componente de cliente. Por ahora, asumimos que puede
      // hacer la llamada. En un futuro podríamos mover la lógica de la API a un 'server action'.
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
          message: 'No se pudo analizar el presupuesto. Revisa la consola para más detalles.',
        });
      }
    }

    getAnalysis();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas de Presupuesto</CardTitle>
      </CardHeader>
      <CardContent>
        {!budgetAnalysis ? (
          <div className="text-sm text-muted-foreground">Analizando...</div>
        ) : budgetAnalysis.alert ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>¡Atención!</AlertTitle>
            <AlertDescription>{budgetAnalysis.message}</AlertDescription>
          </Alert>
        ) : (
          <div className="text-sm text-muted-foreground">
            No hay alertas. ¡Vas por buen camino!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
