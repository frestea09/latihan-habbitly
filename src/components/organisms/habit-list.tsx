'use client';

import type { Habit, HabitLog } from '@/lib/types';
import HabitCard from './habit-card';
import { HabitIcon } from '@/components/atoms/habit-icon';

type HabitListProps = {
  title: string;
  habits: Habit[];
  logs: HabitLog[];
  onLogHabit: (
    habitId: string,
    date: string,
    completed: boolean,
    details: { journal?: string; reasonForMiss?: string }
  ) => void;
};

export default function HabitList({
  title,
  habits,
  logs,
  onLogHabit,
}: HabitListProps) {
  if (habits.length === 0) {
    return null;
  }
  
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-bold font-headline text-slate-600">{title}</h2>
      </div>
      <div className="flex flex-col gap-3">
        {habits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            logs={logs.filter((log) => log.habitId === habit.id)}
            onLogHabit={onLogHabit}
          />
        ))}
      </div>
    </section>
  );
}
