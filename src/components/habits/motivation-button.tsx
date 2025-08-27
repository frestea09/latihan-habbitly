'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Sparkles } from 'lucide-react';
import {
  generateHabitMotivation,
  type GenerateHabitMotivationInput,
} from '@/ai/flows/generate-habit-motivation';
import type { Habit, HabitLog } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

type MotivationButtonProps = {
  habit: Habit;
  logs: HabitLog[];
};

export default function MotivationButton({
  habit,
  logs,
}: MotivationButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [motivation, setMotivation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsOpen(true);
    setIsLoading(true);
    setMotivation('');

    const completionCount = logs.filter((log) => log.completed).length;
    const completionRate = logs.length > 0 ? completionCount / logs.length : 0;
    const reasonsForMissing = logs
      .filter((log) => !log.completed && log.reasonForMiss)
      .map((log) => log.reasonForMiss)
      .join(', ');

    const input: GenerateHabitMotivationInput = {
      habitName: habit.name,
      completionRate,
      reasonsForMissing: reasonsForMissing || 'No reasons provided.',
    };

    try {
      const result = await generateHabitMotivation(input);
      setMotivation(result.motivationTip);
    } catch (error) {
      console.error(error);
      setMotivation(
        "Sorry, I couldn't generate a tip right now. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={handleClick} size="sm" variant="outline" className="text-accent-foreground bg-accent/80 hover:bg-accent border-accent/50">
        <Sparkles className="mr-2 h-4 w-4" />
        AI Tip
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your Personal Motivation Tip</DialogTitle>
            <DialogDescription>
              Here is some AI-powered advice for your habit: "{habit.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4">
            {isLoading ? (
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            ) : (
                <p className="leading-relaxed">{motivation}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
