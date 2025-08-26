'use server';
/**
 * @fileOverview Generates HTML and CSS code from a Figma design URL.
 *
 * - generateCode - A function that handles the code generation process.
 * - GenerateCodeInput - The input type for the generateCode function.
 * - GenerateCodeOutput - The return type for the generateCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCodeInputSchema = z.object({
  figmaUrl: z.string().describe('The URL of the Figma design.'),
});
export type GenerateCodeInput = z.infer<typeof GenerateCodeInputSchema>;

const GenerateCodeOutputSchema = z.object({
  htmlCode: z.string().describe('The generated HTML code.'),
  cssCode: z.string().describe('The generated CSS code.'),
});
export type GenerateCodeOutput = z.infer<typeof GenerateCodeOutputSchema>;

export async function generateCode(input: GenerateCodeInput): Promise<GenerateCodeOutput> {
  return generateCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCodePrompt',
  input: {schema: GenerateCodeInputSchema},
  output: {schema: GenerateCodeOutputSchema},
  prompt: `You are an expert front-end developer.

  Given a Figma design URL, you will generate HTML and CSS code that accurately represents the design.
  Pay attention to the structure and styling of the design.

  Figma URL: {{{figmaUrl}}}

  Ensure the HTML is well-structured and semantic.
  Provide modern CSS code, make sure it is compatible with the HTML code.

  Output the code in a format that can be easily copied and pasted into a project.
  Do not include any explanations or comments in the code.
  HTML code:
  CSS code:
`,
});

const generateCodeFlow = ai.defineFlow(
  {
    name: 'generateCodeFlow',
    inputSchema: GenerateCodeInputSchema,
    outputSchema: GenerateCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
