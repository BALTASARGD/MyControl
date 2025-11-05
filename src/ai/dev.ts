import {config} from 'dotenv';
config();

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

import './flows/budget-alerts.ts';

genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
  enableTracing: true,
  logLevel: 'debug',
});
