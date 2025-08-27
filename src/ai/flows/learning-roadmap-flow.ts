
'use server';

/**
 * @fileOverview A flow for generating a learning roadmap.
 *
 * - generateLearningRoadmap - A function that creates a structured learning plan.
 * - LearningRoadmapInput - The input type for the learning roadmap generation.
 * - LearningRoadmapOutput - The return type for the learning roadmap generation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const LearningRoadmapInputSchema = z.object({
  topic: z.string().describe('The topic the user wants to learn.'),
});
export type LearningRoadmapInput = z.infer<typeof LearningRoadmapInputSchema>;

const LearningRoadmapOutputSchema = z.object({
  topic: z.string().describe('The main topic of the learning roadmap, often a refined version of the user input.'),
  steps: z.array(
    z.object({
      title: z.string().describe('A concise title for the learning step (e.g., "Mastering Basic Chords").'),
      description: z.string().describe('A short, one-sentence description of what this step entails.'),
    })
  ).describe('A list of actionable steps to learn the topic. Aim for 5-7 steps.'),
});
export type LearningRoadmapOutput = z.infer<typeof LearningRoadmapOutputSchema>;

export async function generateLearningRoadmap(input: LearningRoadmapInput): Promise<LearningRoadmapOutput> {
  return generateLearningRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'learningRoadmapPrompt',
  input: { schema: LearningRoadmapInputSchema },
  output: { schema: LearningRoadmapOutputSchema },
  prompt: `You are an expert curriculum designer who creates simple, actionable learning roadmaps for beginners. A user wants to learn about a new topic.

Your task is to create a learning roadmap with 5 to 7 clear, sequential steps. Each step should have a concise title and a brief one-sentence description. The language should be simple and encouraging, suitable for non-technical users and older adults.

The output should be in Bahasa Indonesia.

Topic to learn: {{{topic}}}
`,
});

const generateLearningRoadmapFlow = ai.defineFlow(
  {
    name: 'generateLearningRoadmapFlow',
    inputSchema: LearningRoadmapInputSchema,
    outputSchema: LearningRoadmapOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
