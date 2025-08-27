'use client';

import type { HabitWithLogs, TimeRange } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import HabitTrendChart from '../molecules/habit-trend-chart';
import { Badge } from '../ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import HabitLogger from '../molecules/habit-logger';
import { getDatesInRange } from '@/lib/utils';


type ReportCardProps = {
  habit: HabitWithLogs;
  onLogHabit: (
    habitId: string,
    date: string,
    completed: boolean,
    details: { journal?: string; reasonForMiss?: string }
  ) => void;
  timeRange: TimeRange;
};

export default function ReportCard({ habit, onLogHabit, timeRange }: ReportCardProps) {
    const dateList = getDatesInRange(timeRange);

    const rangeLogs = dateList.map(date => {
        return habit.logs.find(log => log.date === date) || {
        id: `placeholder-${habit.id}-${date}`,
        habitId: habit.id,
        date,
        completed: false
        };
    });

    const completionCount = habit.logs.filter(log => log.completed && dateList.includes(log.date)).length;
    const completionRate = Math.round((completionCount / dateList.length) * 100);

    const getBadgeColor = (rate: number) => {
        if (rate > 75) return 'bg-green-100 text-green-800 border-green-200';
        if (rate > 40) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        return 'bg-red-100 text-red-800 border-red-200';
    }

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const today = new Date();
      today.setHours(0,0,0,0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() -1);

      if(date.getTime() === today.getTime()) return "Hari Ini";
      if(date.getTime() === yesterday.getTime()) return "Kemarin";

      return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
    }
    
    const timeRangeTextMap = {
        weekly: '7 Hari Terakhir',
        monthly: 'Bulan Ini',
        yearly: 'Tahun Ini'
    }

  return (
    <Card className="shadow-sm flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>{habit.name}</CardTitle>
                <CardDescription>Ringkasan {timeRangeTextMap[timeRange]}</CardDescription>
            </div>
            <Badge className={getBadgeColor(completionRate)}>{completionRate}% Selesai</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <HabitTrendChart logs={rangeLogs} />
      </CardContent>
      <Accordion type="single" collapsible className="w-full border-t">
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="p-4 text-base font-semibold hover:no-underline">
            Ubah Log Harian
          </AccordionTrigger>
          <AccordionContent className="p-0">
            <ul className="divide-y max-h-96 overflow-y-auto">
                {dateList.slice().reverse().map(date => {
                    const log = habit.logs.find(l => l.date === date);
                    return (
                        <li key={date} className="flex items-center justify-between p-4">
                           <span className="font-medium text-muted-foreground">{formatDate(date)}</span>
                           <HabitLogger
                                habitId={habit.id}
                                date={date}
                                todayLog={log}
                                onLogHabit={onLogHabit}
                           />
                        </li>
                    )
                })}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
