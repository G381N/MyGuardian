'use server';

/**
 * @fileOverview This file implements the AI-Powered Interpretation tool for analyzing scripture passages in relation to user inputs.
 *
 * It exports:
 * - `analyzeScripture`: The main function to analyze scripture.
 * - `AnalyzeScriptureInput`: The input type for the `analyzeScripture` function.
 * - `AnalyzeScriptureOutput`: The output type for the `analyzeScripture` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeScriptureInputSchema = z.object({
  passage: z.string().describe('The scripture passage to analyze.'),
  userInput: z.string().describe('The user input or question related to the passage.'),
});
export type AnalyzeScriptureInput = z.infer<typeof AnalyzeScriptureInputSchema>;

const AnalyzeScriptureOutputSchema = z.object({
  interpretation: z.string().describe('The AI-powered interpretation of the scripture passage in relation to the user input.'),
});
export type AnalyzeScriptureOutput = z.infer<typeof AnalyzeScriptureOutputSchema>;

export async function analyzeScripture(input: AnalyzeScriptureInput): Promise<AnalyzeScriptureOutput> {
  return analyzeScriptureFlow(input);
}

const analyzeScripturePrompt = ai.definePrompt({
  name: 'analyzeScripturePrompt',
  input: {schema: AnalyzeScriptureInputSchema},
  output: {schema: AnalyzeScriptureOutputSchema},
  prompt: `You are a helpful AI assistant that analyzes scripture passages in relation to user inputs to provide deeper insights and understanding.

  Passage: {{{passage}}}
  User Input: {{{userInput}}}

  Provide an interpretation of the passage in relation to the user input.
  The interpretation should be insightful and provide a deeper understanding of the passage in the context of the user's input.
  Interpretation: `,
});

const analyzeScriptureFlow = ai.defineFlow(
  {
    name: 'analyzeScriptureFlow',
    inputSchema: AnalyzeScriptureInputSchema,
    outputSchema: AnalyzeScriptureOutputSchema,
  },
  async input => {
    const {output} = await analyzeScripturePrompt(input);
    return output!;
  }
);
