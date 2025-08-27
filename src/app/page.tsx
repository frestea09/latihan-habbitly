
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { initialHabits, initialLogs } from '@/lib/data';
import type { Habit, HabitLog, HabitCategory } from '@/lib/types';
import Header from '@/components/organisms/header';
import HabitList from '@/components/organisms/habit-list';
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider, Sidebar, SidebarInset, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarTrigger } from '@/components/ui/sidebar';
import { LayoutDashboard, BarChart3, Settings, Clock, List, ListTodo, ChevronDown, Wallet, BookOpen } from 'lucide-react';
import Footer from '@/components/organisms/footer';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

type ViewMode = 'focus' | 'all';

const CATEGORIES: { title: string; category: HabitCategory; startHour: number, endHour: number }[] = [
  { title: 'Pagi', category: 'morning', startHour: 4, endHour: 11 },
  { title: 'Setelah Dzuhur', category: 'after_dhuhr', startHour: 12, endHour: 15 },
  { title: 'Sore & Malam', category: 'afternoon_evening', startHour: 16, endHour: 21 },
  { title: 'Persiapan & Kualitas Tidur', category: 'sleep_prep', startHour: 22, endHour: 3 },
];

const getCurrentCategory = (): HabitCategory | 'all' => {
    const currentHour = new Date().getHours();
    for (const cat of CATEGORIES) {
        if (cat.startHour <= cat.endHour) {
            if (currentHour >= cat.startHour && currentHour <= cat.endHour) {
                return cat.category;
            }
        } else { // Handles overnight categories like sleep_prep
            if (currentHour >= cat.startHour || currentHour <= cat.endHour) {
                return cat.category;
            }
        }
    }
    return 'morning'; // Default fallback
};


export default function Home() {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [logs, setLogs] = useState<HabitLog[]>(initialLogs);
  const { toast } = useToast();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('focus');
  const [isActivityOpen, setIsActivityOpen] = useState(true);
  const [isLearningOpen, setIsLearningOpen] = useState(false);


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
          journal: completed ? details.journal : currentLog.journal,
          reasonForMiss: !completed ? details.reasonForMiss : currentLog.reasonForMiss,
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
  
  const currentCategory = getCurrentCategory();
  const filteredCategories = viewMode === 'focus' 
    ? CATEGORIES.filter(c => c.category === currentCategory) 
    : CATEGORIES;


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent className="p-4">
          <SidebarMenu>
            <Collapsible open={isActivityOpen} onOpenChange={setIsActivityOpen}>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-2 rounded-md hover:bg-sidebar-accent bg-sidebar-accent">
                    <div className="flex items-center gap-4">
                        <LayoutDashboard />
                        <span className="font-semibold">Aktivitas Harian</span>
                    </div>
                    <ChevronDown className={cn("h-5 w-5 transition-transform", isActivityOpen && "rotate-180")} />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="pl-6 mt-2 space-y-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/" variant="outline" size="sm" isActive>
                      <LayoutDashboard />
                      <span>Lacak Hari Ini</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/tasks" variant="outline" size="sm">
                      <ListTodo />
                      <span>Tugas Harian</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/reports" variant="outline" size="sm">
                      <BarChart3 />
                      <span>Laporan</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </div>
              </CollapsibleContent>
            </Collapsible>
            <SidebarMenuItem>
              <SidebarMenuButton href="/finance">
                <Wallet />
                <span>Keuangan</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <Collapsible open={isLearningOpen} onOpenChange={setIsLearningOpen}>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-2 rounded-md hover:bg-sidebar-accent">
                  <div className="flex items-center gap-4">
                    <BookOpen />
                    <span className="font-semibold">Progres Belajar</span>
                  </div>
                  <ChevronDown className={cn("h-5 w-5 transition-transform", isLearningOpen && "rotate-180")} />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="pl-6 mt-2 space-y-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/learning" variant="outline" size="sm">
                      <ListTodo />
                      <span>Topik Belajar Saya</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/learning/reports" variant="outline" size="sm">
                      <BarChart3 />
                      <span>Laporan Belajar</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </div>
              </CollapsibleContent>
            </Collapsible>
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
             <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Lacak Kebiasaan Hari Ini</h1>
                    <p className="text-muted-foreground text-lg">Tandai kebiasaan yang sudah atau belum Anda lakukan hari ini.</p>
                </div>
                <div className="flex w-full sm:w-auto items-center gap-2 rounded-md bg-muted p-1">
                   <Button variant={viewMode === 'focus' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('focus')} className="h-9 flex-1 sm:flex-none">
                        <Clock className="mr-2 h-4 w-4" />
                        Fokus Waktu Ini
                   </Button>
                   <Button variant={viewMode === 'all' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('all')} className="h-9 flex-1 sm:flex-none">
                       <List className="mr-2 h-4 w-4" />
                       Tampilkan Semua
                   </Button>
                </div>
            </div>
            <div className="space-y-10">
              {filteredCategories.length > 0 ? filteredCategories.map(({ title, category }) => (
                <HabitList
                  key={category}
                  title={title}
                  habits={habits.filter((h) => h.category === category)}
                  logs={logs}
                  onLogHabit={handleLogHabit}
                />
              )) : (
                 <div className="text-center py-10 px-4 rounded-lg bg-card border">
                    <h3 className="text-xl font-semibold">Waktunya Istirahat!</h3>
                    <p className="text-muted-foreground mt-2">Tidak ada kebiasaan yang dijadwalkan untuk waktu ini. Nikmati waktumu!</p>
                 </div>
              )}
            </div>
          </main>
          <Footer />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
