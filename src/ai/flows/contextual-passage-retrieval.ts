'use server';
/**
 * @fileOverview Retrieves relevant scripture passages based on user input from a local KJV dataset.
 *
 * - contextualPassageRetrieval - A function that retrieves relevant scripture passages.
 * - ContextualPassageRetrievalInput - The input type for the contextualPassageRetrieval function.
 * - ContextualPassageRetrievalOutput - The return type for the contextualPassageRetrieval function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {searchVerses, Verse} from '@/services/scripture';

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


const contextualPassageRetrievalFlow = ai.defineFlow(
  {
    name: 'contextualPassageRetrievalFlow',
    inputSchema: ContextualPassageRetrievalInputSchema,
    outputSchema: ContextualPassageRetrievalOutputSchema,
  },
  async (input) => {
    // Search for relevant verses using our scripture service
    const searchResults = await searchVerses(input.userInput);
    
    if (!searchResults || searchResults.length === 0) {
      return { passage: 'No relevant verses found.' };
    }
    
    // Take the top 5 most relevant verses
    const topVerses = searchResults.slice(0, 5);
    const passage = topVerses.map(v => `${v.book} ${v.chapter}:${v.verse} - ${v.text}`).join('\n\n');
    
    return { passage };
  }
);
