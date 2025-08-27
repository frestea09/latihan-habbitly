
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { initialHabits, initialLogs } from '@/lib/data';
import type { Habit, HabitLog, HabitWithLogs } from '@/lib/types';
import { SidebarProvider, Sidebar, SidebarInset, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar';
import { LayoutDashboard, BarChart3, Settings } from 'lucide-react';
import Footer from '@/components/organisms/footer';
import ReportCard from '@/components/organisms/report-card';
import { useToast } from '@/hooks/use-toast';

export default function ReportsPage() {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [logs, setLogs] = useState<HabitLog[]>(initialLogs);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn');
    if (loggedIn !== 'true') {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogHabit = (
    habitId: string,
    date: string,
    completed: boolean,
    details: { journal?: string; reasonForMiss?: string }
  ) => {
    setLogs((prevLogs) => {
      const existingLogIndex = prevLogs.findIndex(
        (log) => log.habitId === habitId && log.date === date
      );

      if (existingLogIndex > -1) {
        const updatedLogs = [...prevLogs];
        const currentLog = updatedLogs[existingLogIndex];
        updatedLogs[existingLogIndex] = {
          ...currentLog,
          completed,
          journal: completed ? details.journal : undefined,
          reasonForMiss: !completed ? details.reasonForMiss : undefined,
        };
        return updatedLogs;
      } else {
        const newLog: HabitLog = {
          id: `log-${Date.now()}`,
          habitId,
          date,
          completed,
          ...details,
        };
        return [...prevLogs, newLog];
      }
    });
    toast({
      title: "Log Diperbarui!",
      description: `Progres Anda untuk tanggal ${date} telah disimpan.`,
    });
  };

  const habitsWithLogs: HabitWithLogs[] = habits.map(habit => ({
    ...habit,
    logs: logs.filter(log => log.habitId === habit.id)
  }));
  
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p>Memuat...</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent className="p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/">
                <LayoutDashboard />
                Dasbor
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/reports" isActive>
                <BarChart3 />
                Laporan
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#">
                <Settings />
                Pengaturan
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen bg-slate-50 text-foreground">
          <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-4">
                        <SidebarTrigger className="md:hidden" />
                        <h1 className="text-xl font-bold">Laporan Kebiasaan</h1>
                    </div>
                </div>
            </div>
           </header>
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
                <h2 className="text-2xl font-bold">Ringkasan Kinerja</h2>
                <p className="text-muted-foreground">Analisis performa kebiasaan Anda selama 7 hari terakhir. Anda bisa mengubah log jika ada kesalahan input.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {habitsWithLogs.map(habit => (
                    <ReportCard key={habit.id} habit={habit} onLogHabit={handleLogHabit} />
                ))}
            </div>
          </main>
          <Footer />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
