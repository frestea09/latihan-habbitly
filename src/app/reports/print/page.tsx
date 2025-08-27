
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { initialHabits, initialLogs } from '@/lib/data';
import type { Habit, HabitLog, HabitWithLogs, TimeRange } from '@/lib/types';
import ReportCard from '@/components/organisms/report-card';
import { Button } from '@/components/ui/button';
import { Printer, Loader } from 'lucide-react';
import { Logo } from '@/components/atoms/logo';

function PrintPageContent() {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [logs, setLogs] = useState<HabitLog[]>(initialLogs);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const searchParams = useSearchParams();
  const timeRange = (searchParams.get('range') as TimeRange) || 'weekly';

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn');
    if (loggedIn !== 'true') {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handlePrint = () => {
    window.print();
  };
  
  const habitsWithLogs: HabitWithLogs[] = habits.map(habit => ({
    ...habit,
    logs: logs.filter(log => log.habitId === habit.id)
  }));

  const timeRangeTextMap: Record<TimeRange, string> = { weekly: '7 Hari Terakhir', monthly: 'Bulan Ini', yearly: 'Tahun Ini' };

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader className="h-8 w-8 animate-spin" />
        <p className="ml-2">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white text-black p-8 sm:p-12 print:p-0">
      <header className="flex justify-between items-center mb-8 print:hidden">
        <Logo />
        <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Cetak
        </Button>
      </header>

      <div className="print:block">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold">Laporan Kinerja Kebiasaan</h1>
          <p className="text-lg text-slate-600">Ringkasan untuk periode: <span className="font-semibold">{timeRangeTextMap[timeRange]}</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-8">
            {habitsWithLogs.map(habit => (
                <ReportCard key={habit.id} habit={habit} onLogHabit={() => {}} timeRange={timeRange} />
            ))}
        </div>
      </div>
      
       <footer className="text-center mt-12 text-sm text-slate-500 hidden print:block">
          <p>Laporan ini dibuat pada {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}. © {new Date().getFullYear()} Habbitly.</p>
       </footer>

       <style jsx global>{`
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .no-print {
                display: none;
            }
          }
        `}</style>
    </div>
  );
}


export default function PrintPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PrintPageContent />
        </Suspense>
    )
}
