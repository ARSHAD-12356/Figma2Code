import { config } from 'dotenv';
config();

import '@/ai/flows/generate-code-from-figma.ts';
import '@/ai/flows/explain-generated-code.ts';