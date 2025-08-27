'use server';

/**
 * @fileOverview A flow to generate personalized motivational tips based on user's habit tracking data.
 *
 * - generateHabitMotivation - A function that generates motivational tips.
 * - GenerateHabitMotivationInput - The input type for the generateHabitMotivation function.
 * - GenerateHabitMotivationOutput - The return type for the generateHabitMotivation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHabitMotivationInputSchema = z.object({
  habitName: z.string().describe('The name of the habit.'),
  completionRate: z.number().describe('The completion rate of the habit over the last 7 days (0 to 1).'),
  reasonsForMissing: z.string().describe('Reasons for missing the habit in the last 7 days.'),
});
export type GenerateHabitMotivationInput = z.infer<typeof GenerateHabitMotivationInputSchema>;

const GenerateHabitMotivationOutputSchema = z.object({
  motivationTip: z.string().describe('A personalized motivational tip to encourage habit completion.'),
});
export type GenerateHabitMotivationOutput = z.infer<typeof GenerateHabitMotivationOutputSchema>;

export async function generateHabitMotivation(input: GenerateHabitMotivationInput): Promise<GenerateHabitMotivationOutput> {
  return generateHabitMotivationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHabitMotivationPrompt',
  input: {schema: GenerateHabitMotivationInputSchema},
  output: {schema: GenerateHabitMotivationOutputSchema},
  prompt: `You are a motivational coach providing personalized tips to users based on their habit tracking data.

  Habit Name: {{{habitName}}}
  Completion Rate (last 7 days): {{{completionRate}}}
  Reasons for Missing (last 7 days): {{{reasonsForMissing}}}

  Generate a motivational tip to encourage the user to stay consistent with their habit. The tip should be personalized and take into account the completion rate and reasons for missing the habit.
  Focus on being encouraging, understanding, and offering practical advice to overcome the challenges they are facing.
  Do not make up information, stick to the data provided. Do not offer generic advice.
  `,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const generateHabitMotivationFlow = ai.defineFlow(
  {
    name: 'generateHabitMotivationFlow',
    inputSchema: GenerateHabitMotivationInputSchema,
    outputSchema: GenerateHabitMotivationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
