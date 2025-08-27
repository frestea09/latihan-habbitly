'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import AddHabitForm from '@/components/habits/add-habit-form';
import type { Habit } from '@/lib/types';
import { useState } from 'react';

type HeaderProps = {
  onAddHabit: (habit: Omit<Habit, 'id'>) => void;
};

export default function Header({ onAddHabit }: HeaderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-primary"
            >
              <path d="M2 12a10 10 0 1 0 20 0 10 10 0 1 0-20 0" />
              <path d="M12 2v4" />
              <path d="M12 18v4" />
              <path d="m4.93 4.93 2.83 2.83" />
              <path d="m16.24 16.24 2.83 2.83" />
              <path d="M2 12h4" />
              <path d="M18 12h4" />
              <path d="m4.93 19.07 2.83-2.83" />
              <path d="m16.24 7.76 2.83-2.83" />
            </svg>
            <h1 className="text-2xl font-bold font-headline text-foreground">Habbitly</h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Habit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create a New Habit</DialogTitle>
                <DialogDescription>
                  Define a new habit you want to track. Be specific!
                </DialogDescription>
              </DialogHeader>
              <AddHabitForm onAddHabit={onAddHabit} setDialogOpen={setIsDialogOpen} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
