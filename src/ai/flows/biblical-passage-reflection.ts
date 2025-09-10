'use server';

/**
 * @fileOverview Provides explanatory biblical reflections for selected scripture passages.
 *
 * - biblicalPassageReflection - A function that generates reflections on selected text.
 * - BiblicalPassageReflectionInput - The input type for the biblicalPassageReflection function.
 * - BiblicalPassageReflectionOutput - The return type for the biblicalPassageReflection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BiblicalPassageReflectionInputSchema = z.object({
  selectedText: z.string().describe('The selected scripture text to reflect upon.'),
  context: z.string().describe('The book, chapter, and verse context of the selection.'),
});
export type BiblicalPassageReflectionInput = z.infer<typeof BiblicalPassageReflectionInputSchema>;

const BiblicalPassageReflectionOutputSchema = z.object({
  explanation: z.string().describe('A clear, contextual explanation of what the scripture passage means, including historical context and biblical references.'),
});
export type BiblicalPassageReflectionOutput = z.infer<typeof BiblicalPassageReflectionOutputSchema>;

export async function biblicalPassageReflection(input: BiblicalPassageReflectionInput): Promise<BiblicalPassageReflectionOutput> {
  return biblicalPassageReflectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'biblicalPassageReflectionPrompt',
  input: {schema: BiblicalPassageReflectionInputSchema},
  output: {schema: z.object({explanation: BiblicalPassageReflectionOutputSchema.shape.explanation})},
  prompt: `You are a helpful biblical scholar providing clear, accessible explanations of scripture passages. Your goal is to help users understand what the text means in simple terms.

Selected Text: "{{{selectedText}}}"
Context: {{{context}}}

Provide a clear explanation that:
- Explains the meaning of the passage in simple, easy-to-understand language
- Provides historical or cultural context when relevant (e.g., if "Cana" is mentioned, explain the wedding at Cana and what happened there)
- References other biblical events or locations mentioned in the passage
- Clarifies difficult or archaic language from the King James Version
- Explains who the people mentioned are and their significance
- Does NOT add new interpretations or personal meanings
- Focuses on helping the reader understand what actually happened or what the text actually says

If the passage references other biblical events, briefly explain those connections to help understanding.

For example, if someone highlights "Cana" - explain: "Cana was the location where Jesus performed His first miracle at a wedding, turning water into wine (John 2:1-11). This demonstrated His divine power and marked the beginning of His public ministry."

Explanation:`,
});

const biblicalPassageReflectionFlow = ai.defineFlow(
  {
    name: 'biblicalPassageReflectionFlow',
    inputSchema: BiblicalPassageReflectionInputSchema,
    outputSchema: BiblicalPassageReflectionOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    
    return {
      explanation: output!.explanation,
    };
  }
);
