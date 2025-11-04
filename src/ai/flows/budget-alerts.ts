'use server';
/**
 * @fileOverview Flow for analyzing spending patterns and providing budget alerts.
 *
 * - analyzeSpendingAndAlert - Analyzes spending and triggers alerts if budget thresholds are likely to be exceeded.
 * - AnalyzeSpendingAndAlertInput - Input type for the analyzeSpendingAndAlert function.
 * - AnalyzeSpendingAndAlertOutput - Return type for the analyzeSpendingAndAlert function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSpendingAndAlertInputSchema = z.object({
  category: z.string().describe('The category of spending to analyze.'),
  budget: z.number().describe('The budget for the category.'),
  spendingData: z.array(z.object({
    date: z.string().describe('The date of the expense.'),
    amount: z.number().describe('The amount spent.'),
  })).describe('An array of spending data for the category.'),
});
export type AnalyzeSpendingAndAlertInput = z.infer<typeof AnalyzeSpendingAndAlertInputSchema>;

const AnalyzeSpendingAndAlertOutputSchema = z.object({
  alert: z.boolean().describe('Whether an alert should be triggered.'),
  message: z.string().describe('The alert message, if any.'),
});
export type AnalyzeSpendingAndAlertOutput = z.infer<typeof AnalyzeSpendingAndAlertOutputSchema>;

export async function analyzeSpendingAndAlert(input: AnalyzeSpendingAndAlertInput): Promise<AnalyzeSpendingAndAlertOutput> {
  return analyzeSpendingAndAlertFlow(input);
}

const analyzeSpendingPrompt = ai.definePrompt({
  name: 'analyzeSpendingPrompt',
  input: {schema: AnalyzeSpendingAndAlertInputSchema},
  output: {schema: AnalyzeSpendingAndAlertOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the following spending data to determine if the user is likely to exceed their budget for the category {{category}}.

Budget: {{budget}}

Spending Data:
{{#each spendingData}}
- Date: {{date}}, Amount: {{amount}}
{{/each}}

Based on this data, determine if an alert should be triggered. If the spending trend indicates that the user is likely to exceed their budget, set alert to true and provide a message explaining why. Otherwise, set alert to false and provide an empty message.

Consider factors such as recent spending increases, large purchases, and the remaining time in the budget cycle. Be conservative and only trigger alerts when there is a clear indication that the budget will be exceeded.

Return a JSON object with the alert and message fields.
`,
});

const analyzeSpendingAndAlertFlow = ai.defineFlow(
  {
    name: 'analyzeSpendingAndAlertFlow',
    inputSchema: AnalyzeSpendingAndAlertInputSchema,
    outputSchema: AnalyzeSpendingAndAlertOutputSchema,
  },
  async input => {
    const {output} = await analyzeSpendingPrompt(input);
    return output!;
  }
);
