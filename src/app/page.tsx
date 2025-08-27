
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { initialHabits, initialLogs } from '@/lib/data';
import type { Habit, HabitLog, HabitCategory } from '@/lib/types';
import Header from '@/components/organisms/header';
import HabitList from '@/components/organisms/habit-list';
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider, Sidebar, SidebarInset, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { LayoutDashboard, BarChart3, Settings } from 'lucide-react';
import Footer from '@/components/organisms/footer';

const CATEGORIES: { title: string; category: HabitCategory }[] = [
  { title: 'Pagi', category: 'morning' },
  { title: 'Setelah Dzuhur', category: 'after_dhuhr' },
  { title: 'Sore & Malam', category: 'afternoon_evening' },
  { title: 'Persiapan & Kualitas Tidur', category: 'sleep_prep' },
];

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [logs, setLogs] = useState<HabitLog[]>(initialLogs);
  const { toast } = useToast();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn');
    if (loggedIn !== 'true') {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleAddHabit = (newHabit: Omit<Habit, 'id'>) => {
    const habitWithId = { ...newHabit, id: `habit-${Date.now()}` };
    setHabits((prev) => [...prev, habitWithId]);
    toast({
      title: "Kebiasaan Ditambahkan!",
      description: `"${newHabit.name}" telah ditambahkan ke daftar Anda.`,
    });
  };

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
      description: `Progres Anda untuk hari ini telah disimpan.`,
    });
  };
  
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
              <SidebarMenuButton href="/" isActive>
                <LayoutDashboard />
                <span>Lacak Hari Ini</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/reports">
                <BarChart3 />
                <span>Laporan</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#">
                <Settings />
                <span>Pengaturan</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen bg-slate-50 text-foreground">
          <Header onAddHabit={handleAddHabit} />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
             <div className="mb-6">
                <h1 className="text-3xl font-bold">Lacak Kebiasaan Hari Ini</h1>
                <p className="text-muted-foreground text-lg">Tandai kebiasaan yang sudah atau belum Anda lakukan hari ini.</p>
            </div>
            <div className="space-y-10">
              {CATEGORIES.map(({ title, category }) => (
                <HabitList
                  key={category}
                  title={title}
                  habits={habits.filter((h) => h.category === category)}
                  logs={logs}
                  onLogHabit={handleLogHabit}
                />
              ))}
            </div>
          </main>
          <Footer />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
