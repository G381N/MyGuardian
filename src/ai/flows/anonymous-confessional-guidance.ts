'use server';

/**
 * @fileOverview Provides AI-guided responses to transcribed confessions.
 *
 * - anonymousConfessionalGuidance - A function that handles the confession and provides guidance.
 * - AnonymousConfessionalGuidanceInput - The input type for the anonymousConfessionalGuidance function.
 * - AnonymousConfessionalGuidanceOutput - The return type for the anonymousConfessionalGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {contextualPassageRetrieval} from './contextual-passage-retrieval';

const AnonymousConfessionalGuidanceInputSchema = z.object({
  transcription: z
    .string()
    .describe(
      'The transcribed text of the user\'s confession. This should be a detailed and honest account of their thoughts and feelings.'
    ),
});
export type AnonymousConfessionalGuidanceInput = z.infer<
  typeof AnonymousConfessionalGuidanceInputSchema
>;

const AnonymousConfessionalGuidanceOutputSchema = z.object({
  relevantVerses: z
    .string()
    .describe('Relevant scripture passages from the KJV.'),
  reflection: z
    .string()
    .describe(
      'AI-generated reflection based on the provided verses. This should be empathetic, pastoral advice drawing from KJV scripture.'
    ),
});
export type AnonymousConfessionalGuidanceOutput = z.infer<
  typeof AnonymousConfessionalGuidanceOutputSchema
>;

export async function anonymousConfessionalGuidance(
  input: AnonymousConfessionalGuidanceInput
): Promise<AnonymousConfessionalGuidanceOutput> {
  return anonymousConfessionalGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'anonymousConfessionalGuidancePrompt',
  input: {schema: z.object({
      transcription: AnonymousConfessionalGuidanceInputSchema.shape.transcription,
      verses: z.string().describe("The relevant scripture verses."),
    })},
  output: {schema: z.object({ reflection: AnonymousConfessionalGuidanceOutputSchema.shape.reflection })},
  prompt: `You are a compassionate and understanding pastoral counselor, offering guidance based on the King James Version of the Bible. Your tone should be gentle, empathetic, and comforting, like a guardian angel or Jesus speaking gently.

  A user has shared the following confession with you:
  "{{{transcription}}}"

  You have been provided with the following relevant scripture verses:
  "{{{verses}}}"

  Based *only* on these verses, provide an empathetic and non-judgmental reflection. Your reflection should stay true to the Word of God as presented in the verses. Do not add any new verses.

  Format your response as a heartfelt message of reflection to help the user find peace and resolution.
  `,
});

const anonymousConfessionalGuidanceFlow = ai.defineFlow(
  {
    name: 'anonymousConfessionalGuidanceFlow',
    inputSchema: AnonymousConfessionalGuidanceInputSchema,
    outputSchema: AnonymousConfessionalGuidanceOutputSchema,
  },
  async input => {
    // 1. Retrieve relevant verses based on the confession.
    const passageResult = await contextualPassageRetrieval({ userInput: input.transcription });
    const relevantVerses = passageResult.passage;
    
    // 2. Generate guidance based on the retrieved verses.
    const {output} = await prompt({
      transcription: input.transcription,
      verses: relevantVerses,
    });

    return {
        relevantVerses: relevantVerses,
        reflection: output!.reflection,
    };
  }
);
