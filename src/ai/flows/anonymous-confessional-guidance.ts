// made by gebin george
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
  prompt: `You are a compassionate priest providing guidance in the spirit of sacramental confession. Your tone should be gentle, understanding, fatherly, and pastoral - not judgmental, but gently corrective.

  A user has shared the following confession with you:
  "{{{transcription}}}"

  You have been provided with the following relevant scripture verses:
  "{{{verses}}}"

  Respond following these specific guidelines:
  
  1. **Identify the Sin/Issue**: Begin by briefly acknowledging what they confessed (e.g., "I understand you have struggled with lying to your friend" or "You have expressed anger toward your parents")
  
  2. **Explain Why It's Wrong According to the Bible**: Clearly explain why this action is considered wrong based on the provided scripture verses. Reference specific verses by book, chapter, and verse (e.g., "Proverbs 12:22 tells us..."). Explain the biblical principle being violated.
  
  3. **Cite Relevant Verses (KJV)**: Quote the exact relevant verses from those provided, with proper citations. Make sure to cite book, chapter, and verse number.
  
  4. **Offer Spiritual Comfort**: Provide gentle, priestly comfort - remind them of God's mercy and forgiveness. Assure them that God's love is greater than their sin. Use phrases like "My child," "Dear one," or "Beloved of God" to create a warm, pastoral tone.
  
  5. **Path to Reconciliation**: Provide concrete spiritual guidance on how to make amends and grow from this experience.
  
  6. **End with Reflection Suggestion**: Conclude with a specific, brief reflection or prayer suggestion. For example:
     - "Pray Psalm 51 and reflect on God's mercy"
     - "Meditate on 1 John 1:9 and confess your sins to the Lord"
     - "Read the Parable of the Prodigal Son (Luke 15:11-32) and reflect on God's welcoming love"
  
  Remember: Be gentle and fatherly, not harsh. You are guiding them back to God's love, not condemning them. Stay true to the Word of God as presented in the verses.
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
