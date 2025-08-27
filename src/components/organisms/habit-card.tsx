'use client';

import type { Habit, HabitLog } from '@/lib/types';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import HabitLogger from '@/components/molecules/habit-logger';
import MotivationButton from '@/components/molecules/motivation-button';
import { HabitIcon } from '../atoms/habit-icon';
import { Badge } from '../ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import HabitTrendChart from '../molecules/habit-trend-chart';

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
      id: `placeholder-${habit.id}-${date}`,
      habitId: habit.id,
      date,
      completed: false
    };
  });

  const completionCount = sevenDayLogs.filter(log => log.completed).length;
  const completionRate = (completionCount / 7) * 100;
  const isTrendingUp = completionRate >= 50;

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-grow">
          <HabitIcon />
          <span className="font-semibold text-lg">{habit.name}</span>
        </div>
        <div className="flex items-center gap-3">
            <Popover>
                <PopoverTrigger asChild>
                    <Badge variant={isTrendingUp ? 'secondary' : 'outline'} className={`cursor-pointer ${isTrendingUp ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-50 text-red-700'}`}>
                        {isTrendingUp ? <TrendingUp className="mr-1.5 h-4 w-4" /> : <TrendingDown className="mr-1.5 h-4 w-4" />}
                        {completionCount}/7 hari
                    </Badge>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <h4 className="font-medium text-center mb-2">Tren 7 Hari Terakhir</h4>
                    <HabitTrendChart logs={sevenDayLogs} />
                </PopoverContent>
            </Popover>
          
          <HabitLogger
            habitId={habit.id}
            todayLog={todayLog}
            onLogHabit={onLogHabit}
          />
          <MotivationButton habit={habit} logs={sevenDayLogs} />
        </div>
      </CardContent>
    </Card>
  );
}
