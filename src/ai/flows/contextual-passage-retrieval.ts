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

const findRelevantVersesTool = ai.defineTool(
    {
      name: 'findRelevantVerses',
      description: 'Searches the King James Version of the Bible for verses relevant to a user\'s input.',
      inputSchema: z.object({
        query: z.string().describe('The user\'s input or query to search for.'),
      }),
      outputSchema: z.array(z.object({
          book: z.string(),
          chapter: z.number(),
          verse: z.number(),
          text: z.string(),
      })),
    },
    async (input) => {
        return await searchVerses(input.query);
    }
  );


const contextualPassageRetrievalFlow = ai.defineFlow(
  {
    name: 'contextualPassageRetrievalFlow',
    inputSchema: ContextualPassageRetrievalInputSchema,
    outputSchema: ContextualPassageRetrievalOutputSchema,
    tools: [findRelevantVersesTool]
  },
  async (input) => {
    const llmResponse = await ai.generate({
        prompt: `You are a bible expert. Your goal is to find the most relevant bible verses for a user's query. Use the findRelevantVerses tool to search the bible.
        
        User query: ${input.userInput}
        
        Analyze the user's query and use the tool to find the most relevant verses. Return a list of the most relevant verses. If there are many, a maximum of 5 is a good number.
        Return the verses as a formatted string, with each verse on a new line, like this:
        [Book] [Chapter]:[Verse] - [Text]
        `,
        tools: [findRelevantVersesTool],
        model: 'googleai/gemini-2.5-flash',
      });

    const toolCalls = llmResponse.toolCalls();
    if (toolCalls.length > 0) {
      const toolResults = await Promise.all(
        toolCalls.map((call) => ai.runTool(call))
      );
      
      const verses = toolResults[0].output as Verse[];
      if (!verses || verses.length === 0) {
          return { passage: 'No relevant verses found.' };
      }
      
      const passage = verses.map(v => `${v.book} ${v.chapter}:${v.verse} - ${v.text}`).join('\n');
      return { passage };
    }
    
    // Fallback if the model doesn't use the tool, though it should.
    const textResponse = llmResponse.text();
    if (textResponse) {
        return { passage: textResponse };
    }

    // Final fallback
    const searchResults = await searchVerses(input.userInput);
     if (!searchResults || searchResults.length === 0) {
        return { passage: 'No relevant verses found.' };
    }
    const passage = searchResults.map(v => `${v.book} ${v.chapter}:${v.verse} - ${v.text}`).join('\n');
    return { passage };
  }
);
