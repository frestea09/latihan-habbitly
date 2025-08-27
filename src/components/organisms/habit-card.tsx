
'use client';

import type { Habit, HabitLog } from '@/lib/types';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import HabitLogger from '@/components/molecules/habit-logger';
import { HabitIcon } from '../atoms/habit-icon';
import MotivationButton from '../molecules/motivation-button';
import { Badge } from '../ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';

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
            date={today}
            todayLog={todayLog}
            onLogHabit={onLogHabit}
          />
           {todayLog && !todayLog.completed && (
             <>
                <div className="h-6 w-px bg-slate-200"></div>
                <MotivationButton habitName={habit.name} reasonForMiss={todayLog.reasonForMiss}/>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
