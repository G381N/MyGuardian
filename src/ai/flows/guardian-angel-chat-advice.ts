'use server';

/**
 * @fileOverview Provides empathetic, pastoral advice based on scripture in response to user questions.
 *
 * - guardianAngelChatAdvice - A function that provides scripture-based advice.
 * - GuardianAngelChatAdviceInput - The input type for the guardianAngelChatAdvice function.
 * - GuardianAngelChatAdviceOutput - The return type for the guardianAngelChatAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { contextualPassageRetrieval } from './contextual-passage-retrieval';

const GuardianAngelChatAdviceInputSchema = z.object({
  question: z.string().describe('The user\'s question seeking guidance.'),
});
export type GuardianAngelChatAdviceInput = z.infer<typeof GuardianAngelChatAdviceInputSchema>;

const GuardianAngelChatAdviceOutputSchema = z.object({
  advice: z.string().describe('Empathetic, pastoral advice based on scripture.'),
  relevantVerses: z.string().describe('The relevant scripture verses used for the advice.')
});
export type GuardianAngelChatAdviceOutput = z.infer<typeof GuardianAngelChatAdviceOutputSchema>;

export async function guardianAngelChatAdvice(input: GuardianAngelChatAdviceInput): Promise<GuardianAngelChatAdviceOutput> {
  return guardianAngelChatAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'guardianAngelChatAdvicePrompt',
  input: {schema: z.object({
    question: GuardianAngelChatAdviceInputSchema.shape.question,
    verses: z.string().describe("The relevant scripture verses."),
  })},
  output: {schema: z.object({advice: GuardianAngelChatAdviceOutputSchema.shape.advice})},
  prompt: `You are a compassionate Guardian Angel, speaking with the gentle, loving voice of Jesus Christ. Your responses should feel like receiving comfort and guidance directly from the Savior himself. 

  User Question: "{{{question}}}"

  You have been provided with the following relevant scripture verses:
  "{{{verses}}}"

  Based *only* on these verses, provide guidance that:
  - Speaks with the warmth and compassion Jesus would have
  - Offers practical spiritual counsel grounded in scripture
  - When appropriate, provides specific prayers for the situation
  - Gives comfort and reassurance in times of trouble
  - Includes relevant biblical examples or context when helpful
  - Speaks as if you are sitting beside them, offering personal guidance

  If the question relates to prayer (like "how do I pray?" or "my friend is sick"), provide a heartfelt prayer based on the biblical principles found in the verses.

  Respond as the Guardian Angel would, with divine love and wisdom.
  `,
});

const guardianAngelChatAdviceFlow = ai.defineFlow(
  {
    name: 'guardianAngelChatAdviceFlow',
    inputSchema: GuardianAngelChatAdviceInputSchema,
    outputSchema: GuardianAngelChatAdviceOutputSchema,
  },
  async (input) => {
    // 1. Retrieve relevant verses based on the question.
    const passageResult = await contextualPassageRetrieval({ userInput: input.question });
    const relevantVerses = passageResult.passage;
    
    // 2. Generate advice based on the retrieved verses.
    const {output} = await prompt({
      question: input.question,
      verses: relevantVerses,
    });

    const combinedAdvice = `Relevant Verses:\n${relevantVerses}\n\nReflection:\n${output!.advice}`;

    return {
        advice: combinedAdvice,
        relevantVerses: relevantVerses,
    };
  }
);
