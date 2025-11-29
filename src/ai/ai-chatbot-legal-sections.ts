'use server';

/**
 * @fileOverview An AI chatbot flow that identifies relevant legal sections based on user input.
 *
 * - identifyRelevantLegalSections - A function that handles the identification of relevant legal sections.
 * - IdentifyRelevantLegalSectionsInput - The input type for the identifyRelevantLegalSections function.
 * - IdentifyRelevantLegalSectionsOutput - The return type for the identifyRelevantLegalSections function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyRelevantLegalSectionsInputSchema = z.object({
  userIssue: z.string().describe('The user-described issue or problem.'),
});
export type IdentifyRelevantLegalSectionsInput = z.infer<typeof IdentifyRelevantLegalSectionsInputSchema>;

const IdentifyRelevantLegalSectionsOutputSchema = z.object({
  caseType: z.string().describe('The potential case type (civil/criminal).'),
  sectionNumber: z.string().describe('The relevant section number.'),
  explanation: z.string().describe('A concise explanation of the section.'),
  nextSteps: z.string().describe('A markdown list of immediate next steps the user should consider taking.'),
  escalationPath: z.string().describe('A markdown list of how the user can escalate the issue if initial steps are not effective.')
});
export type IdentifyRelevantLegalSectionsOutput = z.infer<typeof IdentifyRelevantLegalSectionsOutputSchema>;

export async function identifyRelevantLegalSections(input: IdentifyRelevantLegalSectionsInput): Promise<IdentifyRelevantLegalSectionsOutput> {
  return identifyRelevantLegalSectionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyRelevantLegalSectionsPrompt',
  input: {schema: IdentifyRelevantLegalSectionsInputSchema},
  output: {schema: IdentifyRelevantLegalSectionsOutputSchema},
  prompt: `You are a legal expert. A user will describe their issue. You must provide the most relevant:

- case type (civil/criminal)
- section number
- A small explanation of that section
- A markdown list of next steps the user should take.
- A markdown list of how the user can escalate the issue.

User issue: {{{userIssue}}}

Make sure you only provide real articles or parts thereof.
`,
});

const identifyRelevantLegalSectionsFlow = ai.defineFlow(
  {
    name: 'identifyRelevantLegalSectionsFlow',
    inputSchema: IdentifyRelevantLegalSectionsInputSchema,
    outputSchema: IdentifyRelevantLegalSectionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
