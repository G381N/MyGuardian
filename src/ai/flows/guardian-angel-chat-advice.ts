// made by gebin george
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

  CRITICAL: Your response MUST follow this exact format:

  **Step 1 - Direct Answer (First Line):**
  - If the question asks for moral guidance or a yes/no answer, BEGIN with a clear, direct stance (e.g., "Yes, according to Scripture..." or "No, the Bible teaches..." or "This is not directly addressed in Scripture, but...")
  - If it's a "how do I" or "what should I do" question, start with a clear action statement
  - Be specific and direct in your opening line

  **Step 2 - Biblical Explanation:**
  - Explain WHY this is the answer, using ONLY the scripture verses provided
  - Reference specific verses by book, chapter, and verse (e.g., "As we see in John 3:16...")
  - Connect the biblical principles to their question

  **Step 3 - Gray Areas (if applicable):**
  - If the Bible doesn't directly mention the specific situation, explicitly state: "The Bible doesn't directly mention [specific topic], but based on related teachings in [cite verses], here's what can be inferred..."
  - Be honest about what is explicitly stated vs. what is inferred from biblical principles

  **Step 4 - Pastoral Comfort:**
  - Provide warm, compassionate guidance
  - Speak as if you are sitting beside them, offering personal guidance
  - When appropriate, include specific prayers for their situation

  Keep responses concise, warm, and Bible-rooted. Do not add verses not provided to you.

  Example Format for a moral question:
  "No, lying to a friend goes against what Scripture teaches. Proverbs 12:22 tells us 'Lying lips are an abomination to the Lord...' [continue with explanation and comfort]"

  Example Format for a gray area:
  "The Bible doesn't directly mention social media usage, but based on related teachings in Philippians 4:8 about thinking on things that are true and noble, and Proverbs about guarding your heart, here's what can be inferred: [continue with explanation]"
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
