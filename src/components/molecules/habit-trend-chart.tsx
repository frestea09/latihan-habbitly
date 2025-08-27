'use client';

import type { HabitLog } from '@/lib/types';
import { TrendingUp } from 'lucide-react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';

type HabitTrendChartProps = {
  logs: HabitLog[];
};

const chartConfig = {
  completed: {
    label: 'Completed',
    color: 'hsl(var(--accent))',
  },
} satisfies ChartConfig;

export default function HabitTrendChart({ logs }: HabitTrendChartProps) {
  const chartData = logs.map((log) => ({
    date: new Date(log.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    completed: log.completed ? 1 : 0,
  }));

  const completionCount = logs.filter(log => log.completed).length;

  if(completionCount === 0 && logs.length > 0) {
    return (
      <div className="h-40 flex flex-col items-center justify-center text-center text-muted-foreground bg-slate-50 rounded-lg p-4">
        <TrendingUp className="h-8 w-8 mb-2" />
        <p className="font-semibold">No completions yet.</p>
        <p className="text-sm">Start logging to see your trend!</p>
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="h-40 w-full">
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          domain={[0, 1]}
          tickCount={2}
          tickFormatter={(value) => (value === 1 ? 'Yes' : 'No')}
          tick={{ fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" hideLabel />}
        />
        <Line
          dataKey="completed"
          type="monotone"
          stroke="var(--color-completed)"
          strokeWidth={3}
          dot={{
            r: 5,
            fill: "var(--color-completed)",
            strokeWidth: 2,
            stroke: "hsl(var(--background))",
          }}
        />
      </LineChart>
    </ChartContainer>
  );
}
