'use server';
/**
 * @fileOverview A flow to generate motivation and analysis for a missed habit.
 *
 * - generateHabitMotivation - A function that handles the motivation generation process.
 * - GenerateHabitMotivationInput - The input type for the generateHabitMotivation function.
 * - GenerateHabitMotivationOutput - The return type for the generateHabitMotivation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateHabitMotivationInputSchema = z.object({
  habitName: z.string().describe('The name of the habit that was missed.'),
  reasonForMiss: z.string().optional().describe('The reason the user provided for missing the habit.'),
});
export type GenerateHabitMotivationInput = z.infer<typeof GenerateHabitMotivationInputSchema>;

const GenerateHabitMotivationOutputSchema = z.object({
    analysis: z.string().describe("A brief, empathetic analysis of why the user might be struggling with the habit. Written in Indonesian."),
    suggestion: z.string().describe("A simple, actionable suggestion to help the user succeed next time. Written in Indonesian."),
    encouragement: z.string().describe("A short, uplifting motivational quote or phrase. Written in Indonesian."),
});
export type GenerateHabitMotivationOutput = z.infer<typeof GenerateHabitMotivationOutputSchema>;


export async function generateHabitMotivation(input: GenerateHabitMotivationInput): Promise<GenerateHabitMotivationOutput> {
  return generateHabitMotivationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHabitMotivationPrompt',
  input: {schema: GenerateHabitMotivationInputSchema},
  output: {schema: GenerateHabitMotivationOutputSchema},
  prompt: `You are a friendly and empathetic habit coach. A user missed their habit and needs some help.
Your task is to provide a brief analysis, a concrete suggestion, and some encouragement.
The user is likely a non-tech person or an elderly individual, so keep the language extremely simple, supportive, and easy to understand. The entire response must be in Indonesian.

Habit they missed: {{{habitName}}}
{{#if reasonForMiss}}
Reason they provided: {{{reasonForMiss}}}
{{/if}}

Based on this, generate a response.

Example:
- Habit: "Baca buku sebelum tidur"
- Reason: "Terlalu lelah dan ketiduran"
- Your analysis should be something like: "Tidak apa-apa merasa lelah. Sepertinya energi Anda sudah habis di penghujung hari, sehingga sulit untuk fokus membaca."
- Your suggestion should be something like: "Bagaimana jika besok mencoba membaca hanya satu atau dua halaman saja? Atau mungkin memindahkan waktu membaca sedikit lebih awal, sebelum Anda terlalu mengantuk."
- Your encouragement should be something like: "Setiap langkah kecil berarti. Besok adalah hari baru untuk mencoba lagi!"
`,
});

const generateHabitMotivationFlow = ai.defineFlow(
  {
    name: 'generateHabitMotivationFlow',
    inputSchema: GenerateHabitMotivationInputSchema,
    outputSchema: GenerateHabitMotivationOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
