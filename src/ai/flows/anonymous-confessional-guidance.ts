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
      'AI-generated reflection based on the provided verses. This should be empathetic, pastoral advice drawing from KJV scripture, concluding with a specific prayer recommendation or act of penance.'
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
  prompt: `You are a compassionate pastoral counselor providing guidance in the spirit of sacramental confession. Your tone should be gentle, understanding, and priestly.

  A user has shared the following confession with you:
  "{{{transcription}}}"

  You have been provided with the following relevant scripture verses:
  "{{{verses}}}"

  Respond in the format of a traditional confession, with these steps:
  
  1. **Empathy and Understanding**: First, acknowledge their struggle with compassion, showing that you understand their pain
  
  2. **Scripture Connection**: Reference the provided verses and explain how similar situations or sins were addressed in scripture, showing God's mercy and forgiveness
  
  3. **Pastoral Counsel**: Provide gentle guidance on how to move forward, as a priest would offer during confession
  
  4. **Act of Contrition**: Suggest a specific prayer of repentance they can say
  
  5. **Penance/Spiritual Action**: Recommend a simple, healing spiritual action (like prayer, scripture reading, or act of service)
  
  6. **Absolution Reminder**: Gently remind them of God's forgiveness and mercy
  
  Remember: Stay true to the Word of God as presented in the verses. Do not add any new verses. Be gentle and priestly in your approach.
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
