'use server';
/**
 * @fileOverview Retrieves relevant scripture passages based on user input.
 *
 * - contextualPassageRetrieval - A function that retrieves relevant scripture passages.
 * - ContextualPassageRetrievalInput - The input type for the contextualPassageRetrieval function.
 * - ContextualPassageRetrievalOutput - The return type for the contextualPassageRetrieval function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContextualPassageRetrievalInputSchema = z.object({
  userInput: z.string().describe('The user input to find relevant scripture passages for.'),
});
export type ContextualPassageRetrievalInput = z.infer<typeof ContextualPassageRetrievalInputSchema>;

const ContextualPassageRetrievalOutputSchema = z.object({
  passage: z.string().describe('The relevant scripture passage.'),
});
export type ContextualPassageRetrievalOutput = z.infer<typeof ContextualPassageRetrievalOutputSchema>;

export async function contextualPassageRetrieval(input: ContextualPassageRetrievalInput): Promise<ContextualPassageRetrievalOutput> {
  return contextualPassageRetrievalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contextualPassageRetrievalPrompt',
  input: {schema: ContextualPassageRetrievalInputSchema},
  output: {schema: ContextualPassageRetrievalOutputSchema},
  prompt: `Find a relevant scripture passage from the King James Version of the Bible that relates to the following user input: {{{userInput}}}. Return only the passage.`,
});

const contextualPassageRetrievalFlow = ai.defineFlow(
  {
    name: 'contextualPassageRetrievalFlow',
    inputSchema: ContextualPassageRetrievalInputSchema,
    outputSchema: ContextualPassageRetrievalOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
