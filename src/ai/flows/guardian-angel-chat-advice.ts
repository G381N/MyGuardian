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

const GuardianAngelChatAdviceInputSchema = z.object({
  question: z.string().describe('The user\'s question seeking guidance.'),
});
export type GuardianAngelChatAdviceInput = z.infer<typeof GuardianAngelChatAdviceInputSchema>;

const GuardianAngelChatAdviceOutputSchema = z.object({
  advice: z.string().describe('Empathetic, pastoral advice based on scripture.'),
});
export type GuardianAngelChatAdviceOutput = z.infer<typeof GuardianAngelChatAdviceOutputSchema>;

export async function guardianAngelChatAdvice(input: GuardianAngelChatAdviceInput): Promise<GuardianAngelChatAdviceOutput> {
  return guardianAngelChatAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'guardianAngelChatAdvicePrompt',
  input: {schema: GuardianAngelChatAdviceInputSchema},
  output: {schema: GuardianAngelChatAdviceOutputSchema},
  prompt: `You are a guardian angel offering empathetic, pastoral advice based on the King James Version of the Bible.

  User Question: {{{question}}}

  Provide advice that is compassionate, supportive, and grounded in biblical principles.  Cite specific scriptures where relevant.
  `,
});

const guardianAngelChatAdviceFlow = ai.defineFlow(
  {
    name: 'guardianAngelChatAdviceFlow',
    inputSchema: GuardianAngelChatAdviceInputSchema,
    outputSchema: GuardianAngelChatAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
