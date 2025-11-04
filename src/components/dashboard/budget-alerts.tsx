import { analyzeSpendingAndAlert } from '@/ai/flows/budget-alerts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default async function BudgetAlerts() {
  const spendingData = [
    { date: '2024-07-01', amount: 30.5 },
    { date: '2024-07-05', amount: 85.2 },
    { date: '2024-07-10', amount: 42.0 },
    { date: '2024-07-15', amount: 95.7 },
    { date: '2024-07-22', amount: 75.6 },
  ];

  let budgetAnalysis = {
    alert: false,
    message: 'No se pudo analizar el presupuesto. Comprueba la clave de API de Gemini.',
  };

  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_API_KEY_HERE') {
    budgetAnalysis = await analyzeSpendingAndAlert({
      category: 'Compras',
      budget: 400,
      spendingData: spendingData,
    });
  } else {
    budgetAnalysis.alert = true;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas de Presupuesto</CardTitle>
      </CardHeader>
      <CardContent>
        {budgetAnalysis.alert ? (
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
