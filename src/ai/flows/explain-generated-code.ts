'use server';

/**
 * @fileOverview A flow to explain the generated code, highlighting key design elements and their corresponding code snippets.
 *
 * - explainGeneratedCode - A function that handles the code explanation process.
 * - ExplainGeneratedCodeInput - The input type for the explainGeneratedCode function.
 * - ExplainGeneratedCodeOutput - The return type for the explainGeneratedCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainGeneratedCodeInputSchema = z.object({
  code: z.string().describe('The HTML and CSS code to explain.'),
  designDescription: z.string().describe('The description of the design elements.'),
});
export type ExplainGeneratedCodeInput = z.infer<typeof ExplainGeneratedCodeInputSchema>;

const ExplainGeneratedCodeOutputSchema = z.object({
  explanation: z.string().describe('The explanation of the generated code.'),
});
export type ExplainGeneratedCodeOutput = z.infer<typeof ExplainGeneratedCodeOutputSchema>;

export async function explainGeneratedCode(input: ExplainGeneratedCodeInput): Promise<ExplainGeneratedCodeOutput> {
  return explainGeneratedCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainGeneratedCodePrompt',
  input: {schema: ExplainGeneratedCodeInputSchema},
  output: {schema: ExplainGeneratedCodeOutputSchema},
  prompt: `You are an expert front-end developer specializing in explaining HTML and CSS code.

You will receive the generated code and the description of the design elements. Your task is to explain the code,
highlighting key design elements and their corresponding code snippets, so the developer can understand the code
structure and customize it further.

Design Description: {{{designDescription}}}
Code: {{{code}}}`,
});

const explainGeneratedCodeFlow = ai.defineFlow(
  {
    name: 'explainGeneratedCodeFlow',
    inputSchema: ExplainGeneratedCodeInputSchema,
    outputSchema: ExplainGeneratedCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
