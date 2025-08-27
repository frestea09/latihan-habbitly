
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import type { LearningRoadmap } from '@/lib/types';
import { Logo } from '../atoms/logo';
import LearningReportCard from './learning-report-card';

type LearningPrintPreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  roadmaps: LearningRoadmap[];
};

export default function LearningPrintPreviewModal({
  isOpen,
  onClose,
  roadmaps,
}: LearningPrintPreviewModalProps) {
  
  const handlePrint = () => {
    const printContent = document.getElementById('learning-print-area');
    if (printContent) {
      const originalContents = document.body.innerHTML;
      const styles = Array.from(document.styleSheets)
        .map(s => {
          try {
            return Array.from(s.cssRules).map(r => r.cssText).join('\n');
          } catch {
            return '';
          }
        })
        .join('\n');
      
      document.body.innerHTML = `
        <html>
          <head>
            <title>Cetak Laporan Belajar</title>
            <style>
              @media print {
                @page {
                  size: A4;
                  margin: 1.5cm;
                }
                body {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                .print-container {
                   break-inside: avoid;
                }
              }
              ${styles}
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); 
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Pratinjau Cetak Laporan Belajar</DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto p-2 bg-white text-black rounded-md">
           <div id="learning-print-area">
                <div className="text-center mb-10 pt-8 px-8">
                    <div className="flex justify-center mb-4">
                        <Logo />
                    </div>
                    <h1 className="text-3xl font-bold text-black">Laporan Progres Belajar</h1>
                    <p className="text-lg text-slate-600">Ringkasan Kemajuan Semua Topik Pembelajaran</p>
                </div>
                <div className="grid grid-cols-2 gap-4 px-8">
                    {roadmaps.map(roadmap => (
                        <div key={roadmap.id} className="print-container">
                            <LearningReportCard roadmap={roadmap} />
                        </div>
                    ))}
                </div>
                <footer className="text-center mt-12 text-sm text-slate-500 pb-8 px-8">
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
      </DialogContent>
    </Dialog>
  );
}
