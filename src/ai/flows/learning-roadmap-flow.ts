
'use server';

/**
 * @fileOverview A flow for generating a learning roadmap.
 *
 * - generateLearningRoadmap - A function that creates a structured learning plan.
 * - LearningRoadmapInput - The input type for the learning roadmap generation.
 * - LearningRoadbandOutput - The return type for the learning roadmap generation.
 */

import { z } from 'zod';

// This is a placeholder schema, as the AI functionality is currently disabled.
// You can define the expected input structure here if you decide to re-enable AI generation.
const LearningRoadmapInputSchema = z.object({
  topic: z.string().describe('The topic the user wants to learn.'),
  steps: z.array(z.string()).describe('A list of manually entered steps.'),
});
export type LearningRoadmapInput = z.infer<typeof LearningRoadmapInputSchema>;


const LearningRoadmapOutputSchema = z.object({
  topic: z.string().describe('The main topic of the learning roadmap.'),
  steps: z.array(
    z.object({
      title: z.string().describe('A concise title for the learning step.'),
      description: z.string().describe('A short, one-sentence description of what this step entails.'),
    })
  ).describe('A list of actionable steps to learn the topic.'),
});
export type LearningRoadmapOutput = z.infer<typeof LearningRoadmapOutputSchema>;


/**
 * Manually creates a learning roadmap from user input.
 * NOTE: The AI-based generation logic has been temporarily removed.
 * This function now directly transforms the manual input into the required output structure.
 */
export async function generateLearningRoadmap(input: LearningRoadmapInput): Promise<LearningRoadmapOutput> {
  // Directly map the manual input to the output schema.
  // The description for each step is left empty as it's not provided in the manual flow.
  const roadmapSteps = input.steps.map(stepTitle => ({
    title: stepTitle,
    description: '', // Manual entry doesn't require a description from AI.
  }));

  return {
    topic: input.topic,
    steps: roadmapSteps,
  };
}
