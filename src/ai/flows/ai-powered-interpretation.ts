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
  explanation: z.string().describe('A clear, contextual explanation of what the scripture passage means, including historical context and biblical references.'),
});
export type AnalyzeScriptureOutput = z.infer<typeof AnalyzeScriptureOutputSchema>;

export async function analyzeScripture(input: AnalyzeScriptureInput): Promise<AnalyzeScriptureOutput> {
  return analyzeScriptureFlow(input);
}

const analyzeScripturePrompt = ai.definePrompt({
  name: 'analyzeScripturePrompt',
  input: {schema: AnalyzeScriptureInputSchema},
  output: {schema: z.object({explanation: AnalyzeScriptureOutputSchema.shape.explanation})},
  prompt: `You are a helpful biblical scholar providing clear, accessible explanations of scripture passages. Your goal is to help users understand what the text means in simple terms.

  Passage: {{{passage}}}
  User Input: {{{userInput}}}

  Provide a clear explanation that:
  - Explains the meaning of the passage in simple, easy-to-understand language
  - Provides historical or cultural context when relevant (e.g., if "Cana" is mentioned, explain the wedding at Cana)
  - References other biblical events or locations mentioned in the passage
  - Clarifies difficult or archaic language from the King James Version
  - Explains who the people mentioned are and their significance
  - Does NOT add new interpretations or personal meanings
  - Focuses on helping the reader understand what actually happened or what the text actually says

  If the passage references other biblical events, briefly explain those connections to help understanding.
  
  Explanation: `,
});

const analyzeScriptureFlow = ai.defineFlow(
  {
    name: 'analyzeScriptureFlow',
    inputSchema: AnalyzeScriptureInputSchema,
    outputSchema: AnalyzeScriptureOutputSchema,
  },
  async input => {
    const {output} = await analyzeScripturePrompt(input);
    return { explanation: output!.explanation };
  }
);
