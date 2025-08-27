
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import type { HabitWithLogs, TimeRange } from '@/lib/types';
import ReportCard from './report-card';
import { Logo } from '../atoms/logo';

type PrintPreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  habitsWithLogs: HabitWithLogs[];
  timeRange: TimeRange;
};

export default function PrintPreviewModal({
  isOpen,
  onClose,
  habitsWithLogs,
  timeRange,
}: PrintPreviewModalProps) {
  
  const handlePrint = () => {
    const printContent = document.getElementById('print-area');
    if (printContent) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      // We need to reload to re-attach React listeners
      window.location.reload(); 
    }
  };

  const timeRangeTextMap: Record<TimeRange, string> = { weekly: '7 Hari Terakhir', monthly: 'Bulan Ini', yearly: 'Tahun Ini' };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Pratinjau Cetak Laporan</DialogTitle>
        </DialogHeader>
        <div id="print-area" className="flex-grow overflow-y-auto p-2 bg-white text-black">
           <div className="print-content-only">
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-4">
                        <Logo />
                    </div>
                    <h1 className="text-3xl font-bold text-black">Laporan Kinerja Kebiasaan</h1>
                    <p className="text-lg text-slate-600">Ringkasan untuk periode: <span className="font-semibold">{timeRangeTextMap[timeRange]}</span></p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {habitsWithLogs.map(habit => (
                        <ReportCard 
                            key={habit.id} 
                            habit={habit} 
                            onLogHabit={() => {}} 
                            timeRange={timeRange}
                            isInteractive={false}
                         />
                    ))}
                </div>
                <footer className="text-center mt-12 text-sm text-slate-500">
                    <p>Laporan ini dibuat pada {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}. © {new Date().getFullYear()} Habbitly.</p>
                </footer>
           </div>
        </div>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary">Tutup</Button>
          </DialogClose>
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Cetak
          </Button>
        </DialogFooter>
        <style jsx global>{`
          .print-content-only {
            display: none;
          }
          @media print {
            body > *:not(.print-container) {
              display: none !important;
            }
            .print-container {
              display: block !important;
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
            }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
