'use client';

import type { Habit, HabitLog } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import HabitTrendChart from '@/components/molecules/habit-trend-chart';
import HabitLogger from '@/components/molecules/habit-logger';
import MotivationButton from '@/components/molecules/motivation-button';

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
  const todayLog = logs.find((log) => log.date === today);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const sevenDayLogs = last7Days.map(date => {
    return logs.find(log => log.date === date) || {
      id: '',
      habitId: habit.id,
      date,
      completed: false
    };
  });

  return (
    <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="font-headline">{habit.name}</CardTitle>
        <CardDescription>7-Day Trend</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <HabitTrendChart logs={sevenDayLogs} />
      </CardContent>
      <CardFooter className="flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t">
        <HabitLogger
          habitId={habit.id}
          todayLog={todayLog}
          onLogHabit={onLogHabit}
        />
        <MotivationButton habit={habit} logs={sevenDayLogs} />
      </CardFooter>
    </Card>
  );
}
