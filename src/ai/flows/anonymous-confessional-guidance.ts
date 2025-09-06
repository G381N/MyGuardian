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
  guidance: z
    .string()
    .describe(
      'AI-generated guidance based on the confession. This should be empathetic, pastoral advice drawing from KJV scripture.'
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
  input: {schema: AnonymousConfessionalGuidanceInputSchema},
  output: {schema: AnonymousConfessionalGuidanceOutputSchema},
  prompt: `You are a compassionate and understanding pastoral counselor, offering guidance based on the King James Version of the Bible.

  A user has shared the following confession with you:
  {{transcription}}

  Provide empathetic and non-judgmental advice, drawing upon relevant scriptures from the KJV to offer comfort and support. Focus on providing practical guidance and encouragement to help the user find peace and resolution.
  \n  Format your response as a heartfelt message from a trusted counselor.
  `,
});

const anonymousConfessionalGuidanceFlow = ai.defineFlow(
  {
    name: 'anonymousConfessionalGuidanceFlow',
    inputSchema: AnonymousConfessionalGuidanceInputSchema,
    outputSchema: AnonymousConfessionalGuidanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
