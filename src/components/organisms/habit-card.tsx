
'use client';

import type { Habit, HabitLog } from '@/lib/types';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import HabitLogger from '@/components/molecules/habit-logger';
import { HabitIcon } from '../atoms/habit-icon';

type HabitCardProps = {
  habit: Habit;
  logs: HabitLog[];
  onLogHabit: (
    habitId: string,
    date: string,
    completed: boolean,
    details: { journal?: string; reasonForMiss?: string }
  ) => void;
};

export default function HabitCard({ habit, logs, onLogHabit }: HabitCardProps) {
  const today = new Date().toISOString().split('T')[0];
  const todayLog = logs.find((log) => log.habitId === habit.id && log.date === today);

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-grow">
          <HabitIcon />
          <span className="font-semibold text-lg">{habit.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <HabitLogger
            habitId={habit.id}
            todayLog={todayLog}
            onLogHabit={onLogHabit}
          />
        </div>
      </CardContent>
    </Card>
  );
}
