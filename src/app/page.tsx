'use client';

import { useState } from 'react';
import { initialHabits, initialLogs } from '@/lib/data';
import type { Habit, HabitLog, HabitCategory } from '@/lib/types';
import Header from '@/components/layout/header';
import HabitList from '@/components/habits/habit-list';
import { useToast } from "@/hooks/use-toast";

const CATEGORIES: { title: string; category: HabitCategory }[] = [
  { title: 'Morning', category: 'morning' },
  { title: 'After Dhuhr', category: 'after_dhuhr' },
  { title: 'Afternoon & Evening', category: 'afternoon_evening' },
  { title: 'Sleep Prep & Quality', category: 'sleep_prep' },
];

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [logs, setLogs] = useState<HabitLog[]>(initialLogs);
  const { toast } = useToast();

  const handleAddHabit = (newHabit: Omit<Habit, 'id'>) => {
    const habitWithId = { ...newHabit, id: `habit-${Date.now()}` };
    setHabits((prev) => [...prev, habitWithId]);
    toast({
      title: "Habit Added!",
      description: `"${newHabit.name}" has been added to your list.`,
    });
  };

  const handleLogHabit = (
    habitId: string,
    date: string,
    completed: boolean,
    details: { journal?: string; reasonForMiss?: string }
  ) => {
    setLogs((prevLogs) => {
      const existingLogIndex = prevLogs.findIndex(
        (log) => log.habitId === habitId && log.date === date
      );

      if (existingLogIndex > -1) {
        const updatedLogs = [...prevLogs];
        updatedLogs[existingLogIndex] = {
          ...updatedLogs[existingLogIndex],
          completed,
          ...details,
        };
        return updatedLogs;
      } else {
        const newLog: HabitLog = {
          id: `log-${Date.now()}`,
          habitId,
          date,
          completed,
          ...details,
        };
        return [...prevLogs, newLog];
      }
    });
    toast({
      title: "Log Updated!",
      description: `Your progress for today has been saved.`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header onAddHabit={handleAddHabit} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-12">
          {CATEGORIES.map(({ title, category }) => (
            <HabitList
              key={category}
              title={title}
              habits={habits.filter((h) => h.category === category)}
              logs={logs}
              onLogHabit={handleLogHabit}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
