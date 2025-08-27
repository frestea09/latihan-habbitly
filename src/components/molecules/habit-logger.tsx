
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
import { ThumbsDown, ThumbsUp, CheckCircle2, XCircle, Edit } from 'lucide-react';

type HabitLoggerProps = {
  habitId: string;
  date: string;
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
  date,
  todayLog,
  onLogHabit,
}: HabitLoggerProps) {
  const [dialogState, setDialogState] = useState<DialogState>({ open: false, type: null, text: '' });

  const handleOpenDialog = (type: 'journal' | 'reason') => {
    const text = type === 'journal' ? todayLog?.journal : todayLog?.reasonForMiss;
    setDialogState({ open: true, type, text: text || '' });
  };

  const handleSave = () => {
    if (dialogState.type) {
      const completed = dialogState.type === 'journal';
      onLogHabit(habitId, date, completed, { 
        [completed ? 'journal' : 'reasonForMiss']: dialogState.text 
      });
    }
    setDialogState({ open: false, type: null, text: '' });
  };
  
  if (todayLog) {
    return (
      <>
        <div className="flex items-center gap-2">
            {todayLog.completed ? (
            <Badge variant="secondary" className="border-green-300 bg-green-100 text-green-800 hover:bg-green-200 text-base py-1 px-3">
                <CheckCircle2 className="mr-2 h-5 w-5"/> Selesai
            </Badge>
            ) : (
            <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200 text-base py-1 px-3">
                <XCircle className="mr-2 h-5 w-5"/> Terlewat
            </Badge>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenDialog(todayLog.completed ? 'journal' : 'reason')}>
                <Edit className="h-5 w-5 text-slate-500"/>
                <span className="sr-only">Edit Log</span>
            </Button>
        </div>
        <Dialog open={dialogState.open} onOpenChange={(open) => setDialogState(prev => ({ ...prev, open }))}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {dialogState.type === 'journal' ? 'Edit catatanmu' : 'Edit alasanmu'}
              </DialogTitle>
              <DialogDescription>
                {dialogState.type === 'journal'
                  ? 'Ubah catatan tentang pencapaianmu.'
                  : "Perbarui alasan mengapa kamu melewatkannya."}
              </DialogDescription>
            </DialogHeader>
            <Textarea
              value={dialogState.text}
              onChange={(e) => setDialogState(prev => ({ ...prev, text: e.target.value }))}
              placeholder={
                dialogState.type === 'journal' ? 'Bagaimana rasanya?' : 'misal: Saya terlalu lelah...'
              }
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Batal</Button>
              </DialogClose>
              <Button onClick={handleSave}>Simpan Perubahan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={() => handleOpenDialog('journal')} className="bg-green-500 hover:bg-green-600 text-white h-9">
          <ThumbsUp className="mr-2 h-4 w-4" />
          Selesai
        </Button>
        <Button size="sm" variant="outline" onClick={() => handleOpenDialog('reason')} className="h-9">
          <ThumbsDown className="mr-2 h-4 w-4" />
          Terlewat
        </Button>
      </div>

      <Dialog open={dialogState.open} onOpenChange={(open) => setDialogState(prev => ({ ...prev, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogState.type === 'journal' ? 'Catat pengalamanmu' : 'Apa yang terjadi?'}
            </DialogTitle>
            <DialogDescription>
              {dialogState.type === 'journal'
                ? 'Kerja bagus! Tambahkan catatan tentang pencapaianmu.'
                : "Tidak apa-apa. Catat mengapa kamu melewatkannya untuk belajar di kemudian hari."}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={dialogState.text}
            onChange={(e) => setDialogState(prev => ({ ...prev, text: e.target.value }))}
            placeholder={
              dialogState.type === 'journal' ? 'Bagaimana rasanya?' : 'misal: Saya terlalu lelah...'
            }
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Batal</Button>
            </DialogClose>
            <Button onClick={handleSave}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
