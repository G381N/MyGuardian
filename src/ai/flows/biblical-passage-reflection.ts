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
  reflection: z.string().describe('An explanatory reflection on the meaning and significance of the selected scripture.'),
});
export type BiblicalPassageReflectionOutput = z.infer<typeof BiblicalPassageReflectionOutputSchema>;

export async function biblicalPassageReflection(input: BiblicalPassageReflectionInput): Promise<BiblicalPassageReflectionOutput> {
  return biblicalPassageReflectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'biblicalPassageReflectionPrompt',
  input: {schema: BiblicalPassageReflectionInputSchema},
  output: {schema: BiblicalPassageReflectionOutputSchema},
  prompt: `You are a biblical scholar providing educational and explanatory insights into scripture passages. Your role is to help readers understand the meaning, context, and significance of the text they have selected.

Selected Text: "{{{selectedText}}}"
Context: {{{context}}}

Provide a thoughtful, explanatory reflection that:
- Explains what this passage means in its biblical context
- Describes the significance and themes present in the text
- Offers insights into the historical or theological background
- Helps the reader understand the deeper meaning of these verses

Keep the tone educational and informative rather than personal or directive. Focus on explaining what the scripture means rather than telling the reader what they should do. The reflection should enhance understanding of God's word.

Reflection:`,
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
      reflection: output!.reflection,
    };
  }
);
