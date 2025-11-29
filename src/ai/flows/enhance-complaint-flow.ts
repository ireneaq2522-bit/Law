'use server';
/**
 * @fileOverview An AI flow to enhance and rephrase a user's complaint for clarity.
 *
 * - enhanceComplaint - A function that takes a user's complaint and returns a clearer, more structured version.
 * - EnhanceComplaintInput - The input type for the enhanceComplaint function.
 * - EnhanceComplaintOutput - The return type for the enhanceComplaint function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const EnhanceComplaintInputSchema = z.object({
  problem: z.string().describe("The user's raw, unstructured complaint description."),
});
export type EnhanceComplaintInput = z.infer<typeof EnhanceComplaintInputSchema>;

const EnhanceComplaintOutputSchema = z.object({
  enhancedProblem: z.string().describe('A clearer, well-structured version of the complaint, summarized for easy understanding.'),
});
export type EnhanceComplaintOutput = z.infer<typeof EnhanceComplaintOutputSchema>;

export async function enhanceComplaint(input: EnhanceComplaintInput): Promise<EnhanceComplaintOutput> {
  return enhanceComplaintFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhanceComplaintPrompt',
  input: { schema: EnhanceComplaintInputSchema },
  output: { schema: EnhanceComplaintOutputSchema },
  prompt: `You are an expert at summarizing and structuring information. A user has submitted a complaint. Your task is to rephrase it to be as clear and concise as possible for the person who will handle it.

Focus on:
- Identifying the key issue.
- Structuring the information logically.
- Removing any emotional or extraneous language, while preserving the core facts.
- Formatting the output for readability.

Original Complaint: {{{problem}}}

Provide the enhanced, clear version of the complaint below.`,
});

const enhanceComplaintFlow = ai.defineFlow(
  {
    name: 'enhanceComplaintFlow',
    inputSchema: EnhanceComplaintInputSchema,
    outputSchema: EnhanceComplaintOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
