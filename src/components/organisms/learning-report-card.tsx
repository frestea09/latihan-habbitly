
'use client';

import type { LearningRoadmap } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Check, X } from 'lucide-react';

type LearningReportCardProps = {
  roadmap: LearningRoadmap;
};

const COLORS = ['#4ade80', '#f1f5f9']; // green-400, slate-100

export default function LearningReportCard({ roadmap }: LearningReportCardProps) {
  const completedSteps = roadmap.steps.filter(step => step.completed).length;
  const totalSteps = roadmap.steps.length;
  const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const chartData = [
    { name: 'Selesai', value: completedSteps },
    { name: 'Belum Selesai', value: totalSteps - completedSteps },
  ];

  return (
    <Card className="shadow-sm flex flex-col h-full print:shadow-none print:border print:break-inside-avoid">
      <CardHeader>
        <CardTitle className="text-xl">{roadmap.topic}</CardTitle>
        <CardDescription>
          {completedSteps} dari {totalSteps} langkah selesai ({progress}%)
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center">
        {totalSteps > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={50}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} langkah`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full mt-4 space-y-2 text-sm">
                {roadmap.steps.map(step => (
                    <div key={step.id} className="flex items-center gap-2">
                        {step.completed ? 
                            <Check className="h-4 w-4 text-green-500 flex-shrink-0"/> : 
                            <X className="h-4 w-4 text-red-500 flex-shrink-0"/> 
                        }
                        <span className={cn(step.completed && "line-through text-muted-foreground")}>
                            {step.title}
                        </span>
                    </div>
                ))}
            </div>
          </>
        ) : (
          <p className="text-muted-foreground text-center">Belum ada langkah yang ditambahkan untuk topik ini.</p>
        )}
      </CardContent>
    </Card>
  );
}
