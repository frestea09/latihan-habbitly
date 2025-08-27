'use client';

import type { Habit, HabitLog } from '@/lib/types';
import HabitCard from './habit-card';
import { ClipboardList } from 'lucide-react';

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
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/20 rounded-lg">
          <ClipboardList className="h-6 w-6 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold font-headline text-foreground">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
