
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarInset, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar';
import { LayoutDashboard, BarChart3, Settings, ListTodo, ChevronDown, Wallet, BookOpen, Download, Printer } from 'lucide-react';
import Footer from '@/components/organisms/footer';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import type { LearningRoadmap } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import LearningReportCard from '@/components/organisms/learning-report-card';
import LearningPrintPreviewModal from '@/components/organisms/learning-print-preview-modal';

export default function LearningReportsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [isLearningOpen, setIsLearningOpen] = useState(true);
  const [roadmaps, setRoadmaps] = useState<LearningRoadmap[]>([]);
  const { toast } = useToast();
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn');
    if (loggedIn !== 'true') {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
      const storedRoadmaps = sessionStorage.getItem('learningRoadmaps');
      if (storedRoadmaps) {
        setRoadmaps(JSON.parse(storedRoadmaps));
      }
    }
  }, [router]);

  // Listen for changes in session storage from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'learningRoadmaps' && event.newValue) {
        setRoadmaps(JSON.parse(event.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleDownload = () => {
    if (roadmaps.length === 0) {
      toast({
        title: "Tidak Ada Data",
        description: "Tidak ada data progres belajar untuk diunduh.",
        variant: "destructive",
      });
      return;
    }

    const dataToExport = roadmaps.flatMap(roadmap => {
      if (roadmap.steps.length === 0) {
        return [{
          'Topik': roadmap.topic,
          'Langkah': 'Tidak ada langkah',
          'Status': 'N/A',
        }];
      }
      return roadmap.steps.map(step => ({
        'Topik': roadmap.topic,
        'Langkah': step.title,
        'Status': step.completed ? 'Selesai' : 'Belum Selesai',
      }));
    });

    const csvContent = "data:text/csv;charset=utf-8,"
      + [Object.keys(dataToExport[0]), ...dataToExport.map(item => Object.values(item).map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Progres_Belajar.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Laporan Diunduh!",
      description: `Laporan progres belajar Anda telah berhasil diunduh.`,
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
        <SidebarContent className="p-4 overflow-y-auto">
          <SidebarMenu>
            <Collapsible open={isActivityOpen} onOpenChange={setIsActivityOpen}>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-2 rounded-md hover:bg-sidebar-accent">
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
                    <SidebarMenuButton href="/" variant="outline" size="sm">
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
                <div className="flex items-center justify-between p-2 rounded-md hover:bg-sidebar-accent bg-sidebar-accent">
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
                    <SidebarMenuButton href="/learning/reports" variant="outline" size="sm" isActive>
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
          <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="md:hidden" />
                  <h1 className="text-xl font-bold">Laporan Progres Belajar</h1>
                </div>
                <div className="hidden md:flex items-center gap-4">
                  <SidebarTrigger />
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Ringkasan Pembelajaran</h2>
                <p className="text-muted-foreground text-lg">Analisis kemajuan belajar Anda di semua topik.</p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button onClick={handleDownload} variant="outline" className="w-full sm:w-auto flex-1 sm:flex-none">
                  <Download className="mr-2 h-4 w-4" />
                  Unduh CSV
                </Button>
                <Button onClick={() => setIsPrintModalOpen(true)} className="w-full sm:w-auto flex-1 sm:flex-none">
                  <Printer className="mr-2 h-4 w-4" />
                  Cetak Laporan
                </Button>
              </div>
            </div>

            {roadmaps.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roadmaps.map(roadmap => (
                  <LearningReportCard key={roadmap.id} roadmap={roadmap} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 px-4 rounded-lg bg-card border">
                <h3 className="text-xl font-semibold">Belum Ada Laporan</h3>
                <p className="text-muted-foreground mt-2">Mulai tambahkan dan selesaikan topik belajar untuk melihat laporan progres Anda di sini.</p>
              </div>
            )}
          </main>
          <Footer />
        </div>
      </SidebarInset>
      <LearningPrintPreviewModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        roadmaps={roadmaps}
      />
    </SidebarProvider>
  );
}
