'use client';

import type { HabitWithLogs } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import HabitTrendChart from '../molecules/habit-trend-chart';
import { Badge } from '../ui/badge';

type ReportCardProps = {
  habit: HabitWithLogs;
};

export default function ReportCard({ habit }: ReportCardProps) {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const sevenDayLogs = last7Days.map(date => {
        return habit.logs.find(log => log.date === date) || {
        id: `placeholder-${habit.id}-${date}`,
        habitId: habit.id,
        date,
        completed: false
        };
    });

    const completionCount = sevenDayLogs.filter(log => log.completed).length;
    const completionRate = Math.round((completionCount / 7) * 100);

    const getBadgeColor = (rate: number) => {
        if (rate > 75) return 'bg-green-100 text-green-800 border-green-200';
        if (rate > 40) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        return 'bg-red-100 text-red-800 border-red-200';
    }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>{habit.name}</CardTitle>
                <CardDescription>Ringkasan 7 Hari Terakhir</CardDescription>
            </div>
            <Badge className={getBadgeColor(completionRate)}>{completionRate}% Selesai</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <HabitTrendChart logs={sevenDayLogs} />
      </CardContent>
    </Card>
  );
}
