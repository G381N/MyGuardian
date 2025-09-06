// src/ai/flows/daily-scripture-reflection.ts
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

const DailyReflectionInputSchema = z.object({
  date: z.string().describe('The date for which to generate the reflection (YYYY-MM-DD).'),
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
  input: {schema: DailyReflectionInputSchema},
  output: {schema: DailyReflectionOutputSchema},
  prompt: `You are a helpful AI assistant that provides a daily scripture passage from the King James Version (KJV) of the Bible and a concise, inspiring reflection on the passage.

  Today's date: {{{date}}}

  Respond with a scripture passage and a thoughtful reflection. The reflection should be suitable for contemplation and inspiration.

  Format:
  Passage: [KJV Scripture Passage]
  Reflection: [AI-generated reflection]`,
});

const dailyReflectionFlow = ai.defineFlow(
  {
    name: 'dailyReflectionFlow',
    inputSchema: DailyReflectionInputSchema,
    outputSchema: DailyReflectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
