import {config} from 'dotenv';
config();

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});

