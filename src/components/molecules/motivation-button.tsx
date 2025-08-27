'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BrainCircuit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { generateHabitMotivation, GenerateHabitMotivationOutput } from '@/ai/flows/generate-habit-motivation';
import { Skeleton } from '../ui/skeleton';

type MotivationButtonProps = {
  habitName: string;
  reasonForMiss?: string;
};

export default function MotivationButton({ habitName, reasonForMiss }: MotivationButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<GenerateHabitMotivationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setIsOpen(true);
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await generateHabitMotivation({ habitName, reasonForMiss });
      setResponse(res);
    } catch (e) {
      console.error(e);
      setError('Maaf, asisten AI sedang tidak dapat dihubungi. Silakan coba lagi nanti.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button variant="link" size="sm" className="h-auto p-0 text-base text-blue-600" onClick={handleClick}>
        <BrainCircuit className="mr-1.5 h-4 w-4" />
        Butuh Motivasi
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Analisis & Motivasi dari Asisten AI</DialogTitle>
            <DialogDescription>
              Berikut adalah beberapa pemikiran untuk membantu Anda kembali ke jalur yang benar.
            </DialogDescription>
          </DialogHeader>

          {isLoading && (
            <div className="space-y-4 pt-4">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-8 w-full" />
                 <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-8 w-full" />
                 <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-8 w-full" />
            </div>
          )}

          {error && (
            <div className="text-red-600 bg-red-100 p-4 rounded-md">{error}</div>
          )}
          
          {response && (
             <div className="space-y-4 pt-4">
                <div>
                    <h3 className="font-semibold text-lg">Analisis Singkat</h3>
                    <p className="text-muted-foreground">{response.analysis}</p>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg">Saran Praktis</h3>
                    <p className="text-muted-foreground">{response.suggestion}</p>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg">Kata Penyemangat</h3>
                    <p className="text-muted-foreground font-medium italic">"{response.encouragement}"</p>
                </div>
             </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button">Tutup</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
