'use client';

import { useState } from 'react';
import type { HabitLog } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsDown, ThumbsUp } from 'lucide-react';

type HabitLoggerProps = {
  habitId: string;
  todayLog?: HabitLog;
  onLogHabit: (
    habitId: string,
    date: string,
    completed: boolean,
    details: { journal?: string; reasonForMiss?: string }
  ) => void;
};

type DialogState = {
  open: boolean;
  type: 'journal' | 'reason' | null;
  text: string;
}

export default function HabitLogger({
  habitId,
  todayLog,
  onLogHabit,
}: HabitLoggerProps) {
  const [dialogState, setDialogState] = useState<DialogState>({ open: false, type: null, text: '' });
  const today = new Date().toISOString().split('T')[0];

  const handleOpenDialog = (type: 'journal' | 'reason') => {
    const text = type === 'journal' ? todayLog?.journal : todayLog?.reasonForMiss;
    setDialogState({ open: true, type, text: text || '' });
  };

  const handleSave = () => {
    if (dialogState.type) {
      const completed = dialogState.type === 'journal';
      const details = {
        [completed ? 'journal' : 'reasonForMiss']: dialogState.text,
      };
      onLogHabit(habitId, today, completed, details);
    }
    setDialogState({ open: false, type: null, text: '' });
  };
  
  if (todayLog) {
    return (
      <div className="flex items-center gap-2">
        {todayLog.completed ? (
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Completed</Badge>
        ) : (
          <Badge variant="destructive">Missed</Badge>
        )}
        <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(todayLog.completed ? 'journal' : 'reason')}>
          Edit
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={() => handleOpenDialog('journal')} className="bg-green-500 hover:bg-green-600 text-white">
          <ThumbsUp className="mr-2 h-4 w-4" />
          Done
        </Button>
        <Button size="sm" variant="outline" onClick={() => handleOpenDialog('reason')}>
          <ThumbsDown className="mr-2 h-4 w-4" />
          Missed
        </Button>
      </div>

      <Dialog open={dialogState.open} onOpenChange={(open) => setDialogState(prev => ({ ...prev, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogState.type === 'journal' ? 'Log your experience' : 'What happened?'}
            </DialogTitle>
            <DialogDescription>
              {dialogState.type === 'journal'
                ? 'Great job! Add a note about your achievement.'
                : "It's okay. Note down why you missed it to learn for next time."}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={dialogState.text}
            onChange={(e) => setDialogState(prev => ({ ...prev, text: e.target.value }))}
            placeholder={
              dialogState.type === 'journal' ? 'How did it feel?' : 'e.g., I was too tired...'
            }
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
