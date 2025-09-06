'use server';
/**
 * @fileOverview An AI agent to transcribe user's voice recording.
 *
 * - anonymousConfessionalTranscription - A function that handles the transcription process.
 * - AnonymousConfessionalTranscriptionInput - The input type for the anonymousConfessionalTranscription function.
 * - AnonymousConfessionalTranscriptionOutput - The return type for the anonymousConfessionalTranscription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const AnonymousConfessionalTranscriptionInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "A voice recording of the user's thoughts, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnonymousConfessionalTranscriptionInput = z.infer<typeof AnonymousConfessionalTranscriptionInputSchema>;

const AnonymousConfessionalTranscriptionOutputSchema = z.object({
  transcription: z.string().describe('The transcription of the audio recording.'),
});
export type AnonymousConfessionalTranscriptionOutput = z.infer<typeof AnonymousConfessionalTranscriptionOutputSchema>;

export async function anonymousConfessionalTranscription(input: AnonymousConfessionalTranscriptionInput): Promise<AnonymousConfessionalTranscriptionOutput> {
  return anonymousConfessionalTranscriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'anonymousConfessionalTranscriptionPrompt',
  input: {schema: AnonymousConfessionalTranscriptionInputSchema},
  output: {schema: AnonymousConfessionalTranscriptionOutputSchema},
  prompt: `Transcribe the following audio recording:\n\n{{media url=audioDataUri}}`,
});

const anonymousConfessionalTranscriptionFlow = ai.defineFlow(
  {
    name: 'anonymousConfessionalTranscriptionFlow',
    inputSchema: AnonymousConfessionalTranscriptionInputSchema,
    outputSchema: AnonymousConfessionalTranscriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
