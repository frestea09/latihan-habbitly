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
import AddHabitForm from '@/components/molecules/add-habit-form';
import type { Habit } from '@/lib/types';
import { useState } from 'react';
import { Logo } from '@/components/atoms/logo';

type HeaderProps = {
  onAddHabit: (habit: Omit<Habit, 'id'>) => void;
};

export default function Header({ onAddHabit }: HeaderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Logo />
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
