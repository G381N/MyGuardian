'use server';

/**
 * @fileOverview Generates a daily scripture passage and an AI-generated reflection.
 *
 * - generateDailyReflection - A function that generates the daily reflection.
 * - DailyReflectionInput - The input type for the generateDailyReflection function.
 * - DailyReflectionOutput - The return type for the generateDailyReflection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getRandomVerse } from '@/services/scripture';

const DailyReflectionInputSchema = z.object({
  date: z.string().describe('The date for which to generate the reflection (YYYY-MM-DD). This is used to ensure a new verse is selected each day.'),
});
export type DailyReflectionInput = z.infer<typeof DailyReflectionInputSchema>;

const DailyReflectionOutputSchema = z.object({
  passage: z.string().describe('The scripture passage for the day.'),
  reflection: z.string().describe('An AI-generated reflection on the passage.'),
});
export type DailyReflectionOutput = z.infer<typeof DailyReflectionOutputSchema>;

export async function generateDailyReflection(input: DailyReflectionInput): Promise<DailyReflectionOutput> {
  return dailyReflectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dailyReflectionPrompt',
  input: {schema: z.object({ passage: z.string() }) },
  output: {schema: z.object({ reflection: DailyReflectionOutputSchema.shape.reflection })},
  prompt: `You are a helpful AI assistant that provides a concise, inspiring reflection on a scripture passage.
  The user has received the following passage for today's reading:

  Passage: {{{passage}}}

  Provide a thoughtful reflection on this passage. The reflection should be suitable for contemplation and inspiration, be simple, empathetic, and comforting. The tone should feel like a guardian angel or Jesus gently guiding the user. Always ground reflections in the verse provided.
  `,
});

const dailyReflectionFlow = ai.defineFlow(
  {
    name: 'dailyReflectionFlow',
    inputSchema: DailyReflectionInputSchema,
    outputSchema: DailyReflectionOutputSchema,
  },
  async (input) => {
    const verse = await getRandomVerse(input.date);
    const passage = `${verse.book} ${verse.chapter}:${verse.verse} - ${verse.text}`;
    
    const {output} = await prompt({ passage });
    
    return {
        passage: passage,
        reflection: output!.reflection,
    };
  }
);
