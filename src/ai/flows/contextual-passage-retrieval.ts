// touched by GitHub Copilot for commit rewrite
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

// AI prompt to extract biblical keywords and concepts from user input
const keywordExtractionPrompt = ai.definePrompt({
  name: 'keywordExtractionPrompt',
  input: {schema: z.object({
    userInput: z.string().describe('The user question or input'),
  })},
  output: {schema: z.object({
    keywords: z.array(z.string()).describe('Biblical keywords and concepts to search for'),
    specificVerses: z.array(z.string()).describe('Any specific Bible verses mentioned (e.g., "John 3:16")'),
  })},
  prompt: `You are a biblical scholar helping to find relevant scripture passages for a user's question.

User Question: "{{{userInput}}}"

Your task is to identify:
1. Biblical keywords and concepts that would help find relevant verses (e.g., for "drinking wine" → ["wine", "drink", "drunk", "sober", "alcohol"])
2. Any specific Bible verses the user mentioned

Think about:
- Direct terms mentioned in the question
- Related biblical concepts (e.g., "lying" relates to "truth", "deceit", "false witness")
- Moral principles (e.g., "love", "righteousness", "sin", "holiness")
- Biblical topics (e.g., "prayer", "faith", "forgiveness", "grace")
- Old Testament terms and New Testament equivalents

Provide 3-8 relevant keywords that would help find the most appropriate verses.`,
});

const contextualPassageRetrievalFlow = ai.defineFlow(
  {
    name: 'contextualPassageRetrievalFlow',
    inputSchema: ContextualPassageRetrievalInputSchema,
    outputSchema: ContextualPassageRetrievalOutputSchema,
  },
  async (input) => {
    // Step 1: Use AI to extract biblical keywords and concepts
    const {output: keywordOutput} = await keywordExtractionPrompt({
      userInput: input.userInput,
    });
    
    if (!keywordOutput) {
      return { passage: 'Unable to process your question. Please try rephrasing.' };
    }
    
    const keywords = keywordOutput.keywords || [];
    const specificVerses = keywordOutput.specificVerses || [];
    
    // Step 2: If specific verses were mentioned, try to fetch them directly
    let allResults: Verse[] = [];
    
    for (const verseRef of specificVerses) {
      try {
        const verseResults = await searchVerses(verseRef);
        if (verseResults && verseResults.length > 0) {
          allResults = allResults.concat(verseResults.slice(0, 2));
        }
      } catch (error) {
        console.error(`Error searching for specific verse: ${verseRef}`, error);
      }
    }
    
    // Step 3: Search for verses using the extracted keywords
    const searchPromises = keywords.map(keyword => searchVerses(keyword));
    const searchResultsArray = await Promise.all(searchPromises);
    
    // Combine and deduplicate results
    const verseMap = new Map<string, Verse>();
    
    for (const searchResults of searchResultsArray) {
      if (searchResults && searchResults.length > 0) {
        // Take top 3 results from each keyword search
        searchResults.slice(0, 3).forEach(verse => {
          const key = `${verse.book}-${verse.chapter}-${verse.verse}`;
          if (!verseMap.has(key)) {
            verseMap.set(key, verse);
          }
        });
      }
    }
    
    // Add all results together
    allResults = allResults.concat(Array.from(verseMap.values()));
    
    if (allResults.length === 0) {
      // Fallback: try searching with the original input
      const fallbackResults = await searchVerses(input.userInput);
      if (fallbackResults && fallbackResults.length > 0) {
        allResults = fallbackResults.slice(0, 5);
      } else {
        return { passage: 'I could not find specific verses related to your question. The Bible may not directly address this topic, but I can still offer guidance based on general biblical principles. Please ask your question and I will do my best to help.' };
      }
    }
    
    // Take the top 8 most relevant verses
    const topVerses = allResults.slice(0, 8);
    const passage = topVerses.map(v => `${v.book} ${v.chapter}:${v.verse} - ${v.text}`).join('\n\n');
    
    return { passage };
  }
);
