'use client';

import { ClipboardList } from 'lucide-react';

export function HabitIcon() {
  return (
    <div className="p-2 bg-primary/20 rounded-lg">
      <ClipboardList className="h-6 w-6 text-primary-foreground" />
    </div>
  );
}
