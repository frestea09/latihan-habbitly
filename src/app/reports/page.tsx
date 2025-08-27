
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { initialHabits, initialLogs } from '@/lib/data';
import type { Habit, HabitLog, HabitWithLogs, TimeRange } from '@/lib/types';
import { SidebarProvider, Sidebar, SidebarInset, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar';
import { LayoutDashboard, BarChart3, Settings, ListTodo, Download, Printer } from 'lucide-react';
import Footer from '@/components/organisms/footer';
import ReportCard from '@/components/organisms/report-card';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { getDatesInRange } from '@/lib/utils';
import PrintPreviewModal from '@/components/organisms/print-preview-modal';

export default function ReportsPage() {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [logs, setLogs] = useState<HabitLog[]>(initialLogs);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState<TimeRange>('weekly');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

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

  const handleDownload = () => {
    const dateList = getDatesInRange(timeRange);
    
    const dataToExport = habits.flatMap(habit => {
        return dateList.map(date => {
            const log = logs.find(l => l.habitId === habit.id && l.date === date);
            return {
                'Nama Kebiasaan': habit.name,
                'Kategori': habit.category,
                'Tanggal': date,
                'Status': log ? (log.completed ? 'Selesai' : 'Terlewat') : 'Belum Dicatat',
                'Jurnal/Catatan': log ? (log.completed ? log.journal : log.reasonForMiss) || '' : ''
            };
        });
    });

    if(dataToExport.length === 0) {
        toast({
            title: "Tidak Ada Data",
            description: "Tidak ada data untuk diunduh pada rentang waktu ini.",
            variant: "destructive"
        });
        return;
    }

    const csvContent = "data:text/csv;charset=utf-8," 
        + [Object.keys(dataToExport[0]), ...dataToExport.map(item => Object.values(item).map(val => `"${val}"`))].map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const timeRangeTextMap: Record<TimeRange, string> = { weekly: '7_Hari_Terakhir', monthly: 'Bulan_Ini', yearly: 'Tahun_Ini' };
    link.setAttribute("download", `Laporan_Kebiasaan_${timeRangeTextMap[timeRange]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
        title: "Laporan Diunduh!",
        description: `Laporan kebiasaan untuk ${timeRangeTextMap[timeRange].replace(/_/g, ' ')} telah berhasil diunduh.`
    });
  }


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
        <SidebarContent className="p-4 overflow-y-auto">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/">
                <LayoutDashboard />
                <span>Lacak Hari Ini</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/tasks">
                <ListTodo />
                <span>Tugas Harian</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/reports" isActive>
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
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Ringkasan Kinerja</h2>
                    <p className="text-muted-foreground text-lg">Analisis performa kebiasaan Anda.</p>
                </div>
                <SidebarTrigger className="hidden md:flex" />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                <Tabs defaultValue="weekly" onValueChange={(value) => setTimeRange(value as TimeRange)} className="w-full md:w-auto">
                    <TabsList className="grid w-full grid-cols-3 md:max-w-md">
                        <TabsTrigger value="weekly">7 Hari Terakhir</TabsTrigger>
                        <TabsTrigger value="monthly">Bulan Ini</TabsTrigger>
                        <TabsTrigger value="yearly">Tahun Ini</TabsTrigger>
                    </TabsList>
                </Tabs>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Button onClick={handleDownload} variant="outline" className="w-1/2 md:w-auto">
                        <Download className="mr-2 h-4 w-4" />
                        Unduh CSV
                    </Button>
                    <Button onClick={() => setIsPrintModalOpen(true)} className="w-1/2 md:w-auto">
                      <Printer className="mr-2 h-4 w-4" />
                      Cetak Laporan
                    </Button>
                </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {habitsWithLogs.map(habit => (
                    <ReportCard key={habit.id} habit={habit} onLogHabit={handleLogHabit} timeRange={timeRange} isInteractive={true} />
                ))}
            </div>
          </main>
          <Footer />
        </div>
      </SidebarInset>
       <PrintPreviewModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        habitsWithLogs={habitsWithLogs}
        timeRange={timeRange}
      />
    </SidebarProvider>
  );
}
