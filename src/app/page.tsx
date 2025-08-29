
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Habit, HabitLog, HabitCategory } from '@/lib/types';
import Header from '@/components/organisms/header';
import HabitList from '@/components/organisms/habit-list';
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider, Sidebar, SidebarInset, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarTrigger } from '@/components/ui/sidebar';
import { LayoutDashboard, BarChart3, Settings, Clock, List, ListTodo, ChevronDown, Wallet, BookOpen, Edit } from 'lucide-react';
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

const getCurrentCategory = (): HabitCategory => {
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
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('focus');
  const [isActivityOpen, setIsActivityOpen] = useState(true);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [isLearningOpen, setIsLearningOpen] = useState(false);


  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn');
    if (loggedIn !== 'true') {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true);
      const today = new Date().toISOString().split('T')[0];
      Promise.all([
        fetch('/api/habits').then(res => res.json()),
        fetch(`/api/habit-logs?date=${today}`).then(res => res.json())
      ]).then(([habitsData, logsData]) => {
        setHabits(habitsData);
        setLogs(logsData);
        setIsLoading(false);
      });
    }
  }, [isAuthenticated]);

  const handleAddHabit = async (newHabit: Omit<Habit, 'id'>) => {
    const res = await fetch('/api/habits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newHabit),
    });
    if (res.ok) {
      const habit: Habit = await res.json();
      setHabits((prev) => [...prev, habit]);
      toast({
        title: "Kebiasaan Ditambahkan!",
        description: `"${habit.name}" telah ditambahkan ke daftar Anda.`,
      });
    }
  };

  const handleLogHabit = async (
    habitId: string,
    date: string,
    completed: boolean,
    details: { journal?: string; reasonForMiss?: string }
  ) => {
    const res = await fetch('/api/habit-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ habitId, date, completed, ...details }),
    });
    if (res.ok) {
      const log: HabitLog = await res.json();
      setLogs((prevLogs) => {
        const index = prevLogs.findIndex((l) => l.id === log.id);
        if (index > -1) {
          const updated = [...prevLogs];
          updated[index] = log;
          return updated;
        }
        return [...prevLogs, log];
      });
      toast({
        title: "Log Diperbarui!",
        description: `Progres Anda untuk hari ini telah disimpan.`,
      });
    }
  };
  
  if (!isAuthenticated || isLoading) {
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
                    <SidebarMenuButton href="/habits" variant="outline" size="sm">
                      <Edit />
                      <span>Kelola Kebiasaan</span>
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
            <Collapsible open={isFinanceOpen} onOpenChange={setIsFinanceOpen}>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-2 rounded-md hover:bg-sidebar-accent">
                  <div className="flex items-center gap-4">
                    <Wallet />
                    <span className="font-semibold">Keuangan</span>
                  </div>
                  <ChevronDown className={cn("h-5 w-5 transition-transform", isFinanceOpen && "rotate-180")} />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="pl-6 mt-2 space-y-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/finance" variant="outline" size="sm">
                      <ListTodo />
                      <span>Money Stream</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/finance/reports" variant="outline" size="sm">
                      <BarChart3 />
                      <span>Laporan Keuangan</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </div>
              </CollapsibleContent>
            </Collapsible>
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
