
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
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ThumbsDown, ThumbsUp, CheckCircle2, XCircle, PencilLine, Loader2 } from 'lucide-react';

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
  type: 'journal' | 'reason' | 'edit_journal' | 'edit_reason' | null;
  text: string;
}

export default function HabitLogger({
  habitId,
  date,
  todayLog,
  onLogHabit,
}: HabitLoggerProps) {
  const [dialogState, setDialogState] = useState<DialogState>({ open: false, type: null, text: '' });
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenDialog = (type: 'journal' | 'reason' | 'edit_journal' | 'edit_reason') => {
    let text = '';
    if(type === 'edit_journal') {
        text = todayLog?.journal || '';
    } else if (type === 'edit_reason') {
        text = todayLog?.reasonForMiss || '';
    }
    setDialogState({ open: true, type, text });
  };
  
  const handleSave = async () => {
    if (dialogState.type) {
      setIsSaving(true);
      const completed = dialogState.type === 'journal' || dialogState.type === 'edit_journal';
      const details = completed
        ? { journal: dialogState.text }
        : { reasonForMiss: dialogState.text };
      await onLogHabit(habitId, date, completed, details);
      setIsSaving(false);
    }
    setDialogState({ open: false, type: null, text: '' });
  };
  
  if (todayLog) {
    return (
      <div className="flex items-center gap-4">
        {todayLog.completed ? (
          <Badge variant="secondary" className="border-green-300 bg-green-100 text-green-800 hover:bg-green-200 text-base py-1 px-3">
            <CheckCircle2 className="mr-2 h-5 w-5"/> Selesai
          </Badge>
        ) : (
          <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200 text-base py-1 px-3">
            <XCircle className="mr-2 h-5 w-5"/> Terlewat
          </Badge>
        )}
        <Button 
            variant="link" 
            size="sm" 
            className="h-auto p-0 text-base text-muted-foreground" 
            onClick={() => handleOpenDialog(todayLog.completed ? 'edit_journal' : 'edit_reason')}
        >
          <PencilLine className="mr-1.5 h-4 w-4"/>
          Edit Catatan
        </Button>

        <Dialog open={dialogState.open && (dialogState.type === 'edit_journal' || dialogState.type === 'edit_reason')} onOpenChange={(open) => setDialogState(prev => ({ ...prev, open }))}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit log harian</DialogTitle>
              <DialogDescription>Perbarui status dan catatan hari ini.</DialogDescription>
            </DialogHeader>
            <RadioGroup
              value={dialogState.type as 'edit_journal' | 'edit_reason'}
              onValueChange={(value) =>
                setDialogState((prev) => ({ ...prev, type: value as 'edit_journal' | 'edit_reason', text: '' }))
              }
              className="flex gap-4 mb-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="edit_journal" id="edit-completed" />
                <Label htmlFor="edit-completed">Selesai</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="edit_reason" id="edit-missed" />
                <Label htmlFor="edit-missed">Terlewat</Label>
              </div>
            </RadioGroup>
            <Textarea
              value={dialogState.text}
              onChange={(e) => setDialogState(prev => ({ ...prev, text: e.target.value }))}
              placeholder={
                dialogState.type === 'edit_journal'
                  ? 'Tuliskan catatanmu di sini...'
                  : 'Tuliskan alasanmu di sini...'
              }
              rows={4}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Batal</Button>
              </DialogClose>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
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
       <Dialog open={dialogState.open && (dialogState.type === 'journal' || dialogState.type === 'reason')} onOpenChange={(open) => setDialogState(prev => ({ ...prev, open }))}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {dialogState.type === 'journal' ? 'Hebat! Tulis jurnalmu' : 'Tidak apa-apa, tulis alasanmu'}
              </DialogTitle>
              <DialogDescription>
                {dialogState.type === 'journal'
                  ? 'Ceritakan tentang pencapaianmu hari ini. Ini akan membantumu saat evaluasi.'
                  : "Ceritakan mengapa kamu melewatkannya. Ini adalah langkah pertama untuk perbaikan."}
              </DialogDescription>
            </DialogHeader>
            <Textarea
              value={dialogState.text}
              onChange={(e) => setDialogState(prev => ({ ...prev, text: e.target.value }))}
              placeholder={
                dialogState.type === 'journal' ? 'Bagaimana rasanya? Apa yang membuatmu berhasil?' : 'misal: Saya terlalu lelah karena...'
              }
              rows={4}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Batal</Button>
              </DialogClose>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </>
  );
}
