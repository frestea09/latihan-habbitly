
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarInset, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar';
import { LayoutDashboard, BarChart3, Settings, ListTodo, ChevronDown, Wallet, BookOpen, Plus, Loader2, MoreHorizontal, Trash2, ListChecks } from 'lucide-react';
import Footer from '@/components/organisms/footer';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import type { LearningRoadmap, LearningStep } from '@/lib/types';
import { generateLearningRoadmap } from '@/ai/flows/learning-roadmap-flow';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';


export default function LearningPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [isLearningOpen, setIsLearningOpen] = useState(true);
  const [roadmaps, setRoadmaps] = useState<LearningRoadmap[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isNewRoadmapDialogOpen, setIsNewRoadmapDialogOpen] = useState(false);
  const [editingRoadmap, setEditingRoadmap] = useState<LearningRoadmap | null>(null);

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn');
    if (loggedIn !== 'true') {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
      // Load roadmaps from session storage
      const storedRoadmaps = sessionStorage.getItem('learningRoadmaps');
      if (storedRoadmaps) {
        setRoadmaps(JSON.parse(storedRoadmaps));
      }
    }
  }, [router]);

  // Persist roadmaps to session storage whenever they change
  useEffect(() => {
    if (isAuthenticated) {
      sessionStorage.setItem('learningRoadmaps', JSON.stringify(roadmaps));
    }
  }, [roadmaps, isAuthenticated]);


  const handleCreateRoadmap = async (topic: string, steps: string[]) => {
    setIsGenerating(true);
    try {
      const result = await generateLearningRoadmap({ topic, steps });
      const newRoadmap: LearningRoadmap = {
        id: `roadmap-${Date.now()}`,
        topic: result.topic,
        steps: result.steps.map((step, index) => ({
          id: `step-${Date.now()}-${index}`,
          title: step.title,
          description: step.description, // Will be empty in manual mode
          completed: false,
        })),
      };
      setRoadmaps(prev => [newRoadmap, ...prev]);
      setIsNewRoadmapDialogOpen(false);
    } catch (error) {
      console.error("Failed to create learning roadmap:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateRoadmap = (roadmapId: string, topic: string, steps: string[]) => {
    setIsGenerating(true);
    try {
      setRoadmaps(prev =>
        prev.map(roadmap => {
          if (roadmap.id === roadmapId) {
            return {
              ...roadmap,
              topic: topic,
              steps: steps.map((stepTitle, index) => {
                // Try to preserve existing steps to not lose completion status
                const existingStep = roadmap.steps.find(s => s.title === stepTitle);
                return existingStep || {
                    id: `step-${Date.now()}-${index}`,
                    title: stepTitle,
                    description: '',
                    completed: false,
                };
              }),
            };
          }
          return roadmap;
        })
      );
      setEditingRoadmap(null);
    } catch (error) {
        console.error("Failed to update learning roadmap:", error);
    } finally {
        setIsGenerating(false);
    }
  };

  const handleDeleteRoadmap = (roadmapId: string) => {
    setRoadmaps(prev => prev.filter(r => r.id !== roadmapId));
    setEditingRoadmap(null);
  }

  const handleToggleStep = (roadmapId: string, stepId: string) => {
    setRoadmaps(prev =>
      prev.map(roadmap => {
        if (roadmap.id === roadmapId) {
          return {
            ...roadmap,
            steps: roadmap.steps.map(step =>
              step.id === stepId ? { ...step, completed: !step.completed } : step
            ),
          };
        }
        return roadmap;
      })
    );
  };

  const calculateProgress = (steps: LearningStep[]) => {
    if (steps.length === 0) return 0;
    const completedSteps = steps.filter(step => step.completed).length;
    return Math.round((completedSteps / steps.length) * 100);
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
                    <SidebarMenuButton href="/habits" variant="outline" size="sm">
                      <ListChecks />
                      <span>Manajemen Kebiasaan</span>
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
                    <SidebarMenuButton href="/learning" variant="outline" size="sm" isActive>
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
          <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-4">
                        <SidebarTrigger className="md:hidden" />
                        <h1 className="text-xl font-bold">Progres Belajar</h1>
                    </div>
                     <div className="flex items-center gap-4">
                        <Dialog open={isNewRoadmapDialogOpen} onOpenChange={setIsNewRoadmapDialogOpen}>
                          <DialogTrigger asChild>
                            <Button>
                              <Plus className="mr-2 h-4 w-4" />
                              Tambah Topik Belajar
                            </Button>
                          </DialogTrigger>
                          <NewRoadmapDialog
                            onCreate={handleCreateRoadmap}
                            isCreating={isGenerating}
                          />
                        </Dialog>
                        <div className="hidden md:flex">
                           <SidebarTrigger />
                        </div>
                    </div>
                </div>
            </div>
           </header>
          <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {roadmaps.length === 0 ? (
              <div className="text-center py-10 px-4 rounded-lg bg-card border">
                <h3 className="text-xl font-semibold">Mulai Petualangan Belajar Anda!</h3>
                <p className="text-muted-foreground mt-2 mb-4">Apa yang ingin Anda kuasai? Tambahkan topik belajar baru untuk memulai.</p>
                <Dialog open={isNewRoadmapDialogOpen} onOpenChange={setIsNewRoadmapDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Topik Belajar Pertama Anda
                    </Button>
                  </DialogTrigger>
                  <NewRoadmapDialog
                    onCreate={handleCreateRoadmap}
                    isCreating={isGenerating}
                  />
                </Dialog>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roadmaps.map(roadmap => (
                  <Card key={roadmap.id} className="flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle>{roadmap.topic}</CardTitle>
                          <CardDescription>
                            {roadmap.steps.filter(s => s.completed).length} dari {roadmap.steps.length} langkah selesai
                          </CardDescription>
                        </div>
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onSelect={() => setEditingRoadmap(roadmap)}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Kelola Topik</span>
                                </DropdownMenuItem>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                            <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                                            <span className="text-red-500">Hapus</span>
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Tindakan ini tidak dapat diurungkan. Ini akan menghapus topik belajar
                                                <span className="font-semibold"> {roadmap.topic}</span> secara permanen.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteRoadmap(roadmap.id)}>
                                                Ya, Hapus Topik
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                      <Progress value={calculateProgress(roadmap.steps)} />
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {roadmap.steps.map(step => (
                          <div key={step.id} className="flex items-start gap-3">
                            <Checkbox 
                              id={`step-${step.id}`} 
                              className="mt-1"
                              checked={step.completed}
                              onCheckedChange={() => handleToggleStep(roadmap.id, step.id)}
                            />
                            <label
                                htmlFor={`step-${step.id}`}
                                className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", step.completed && "line-through text-muted-foreground")}
                              >
                                {step.title}
                            </label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </main>
          <Footer />
        </div>
      </SidebarInset>
       {editingRoadmap && (
        <EditRoadmapDialog
          key={editingRoadmap.id} // Re-mount component when editingRoadmap changes
          roadmap={editingRoadmap}
          onUpdate={handleUpdateRoadmap}
          onDelete={handleDeleteRoadmap}
          isProcessing={isGenerating}
          onClose={() => setEditingRoadmap(null)}
        />
      )}
    </SidebarProvider>
  );
}


type NewRoadmapDialogProps = {
  onCreate: (topic: string, steps: string[]) => void;
  isCreating: boolean;
};

function NewRoadmapDialog({ onCreate, isCreating }: NewRoadmapDialogProps) {
  const [topic, setTopic] = useState('');
  const [steps, setSteps] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stepsArray = steps.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    if (topic.trim() && stepsArray.length > 0) {
      onCreate(topic.trim(), stepsArray);
    }
  };

  return (
    <DialogContent>
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Tambah Topik Belajar Baru</DialogTitle>
          <DialogDescription>
            Tentukan apa yang ingin Anda pelajari dan tuliskan langkah-langkah untuk mencapainya.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="topic" className="font-medium">Topik</label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="misal: Belajar memasak masakan Italia"
              disabled={isCreating}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="steps" className="font-medium">Langkah-langkah</label>
            <Textarea
              id="steps"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder="Tulis setiap langkah di baris baru..."
              disabled={isCreating}
              required
              rows={5}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={isCreating || !topic.trim() || !steps.trim()} className="w-full">
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              'Simpan Rencana Belajar'
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}


type EditRoadmapDialogProps = {
  roadmap: LearningRoadmap;
  onUpdate: (roadmapId: string, topic: string, steps: string[]) => void;
  onDelete: (roadmapId: string) => void;
  isProcessing: boolean;
  onClose: () => void;
};

function EditRoadmapDialog({ roadmap, onUpdate, onDelete, isProcessing, onClose }: EditRoadmapDialogProps) {
  const [topic, setTopic] = useState(roadmap.topic);
  const [steps, setSteps] = useState(roadmap.steps.map(s => s.title).join('\n'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stepsArray = steps.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    if (topic.trim() && stepsArray.length > 0) {
      onUpdate(roadmap.id, topic.trim(), stepsArray);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Kelola Topik Belajar</DialogTitle>
            <DialogDescription>
              Perbarui judul atau langkah-langkah untuk topik ini.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="edit-topic" className="font-medium">Topik</label>
              <Input
                id="edit-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={isProcessing}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-steps" className="font-medium">Langkah-langkah</label>
              <Textarea
                id="edit-steps"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                placeholder="Tulis setiap langkah di baris baru..."
                disabled={isProcessing}
                required
                rows={5}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-between flex-col-reverse sm:flex-row gap-2">
              <AlertDialog>
                  <AlertDialogTrigger asChild>
                      <Button type="button" variant="destructive" className="sm:mr-auto">
                        <Trash2 className="mr-2 h-4 w-4" /> Hapus Topik
                      </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                      <AlertDialogHeader>
                          <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                          <AlertDialogDescription>
                              Tindakan ini akan menghapus topik <span className="font-semibold">{roadmap.topic}</span> secara permanen.
                          </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(roadmap.id)}>Ya, Hapus</AlertDialogAction>
                      </AlertDialogFooter>
                  </AlertDialogContent>
              </AlertDialog>
             <div className="flex gap-2 justify-end">
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Batal</Button>
                </DialogClose>
                <Button type="submit" disabled={isProcessing || !topic.trim() || !steps.trim()}>
                    {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Simpan Perubahan
                </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
