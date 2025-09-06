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
  prompt: `You are a guardian angel offering empathetic, pastoral advice based on the King James Version of the Bible. Your tone should be gentle, empathetic, and comforting, like Jesus speaking gently.

  User Question: "{{{question}}}"

  You have been provided with the following relevant scripture verses:
  "{{{verses}}}"

  Based *only* on these verses, provide advice that is compassionate, supportive, and grounded in biblical principles. Your reflection should stay true to the Word of God as presented in the verses. Do not add any new verses.

  Give only the advice in your response.
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
