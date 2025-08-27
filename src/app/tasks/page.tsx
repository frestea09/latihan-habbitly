
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarInset, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar';
import { LayoutDashboard, BarChart3, Settings, ListTodo, Plus, Trash2, Edit, ArrowUp, ArrowDown } from 'lucide-react';
import Footer from '@/components/organisms/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
};

export default function TasksPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [movedTaskId, setMovedTaskId] = useState<string | null>(null);

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn');
    if (loggedIn !== 'true') {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);
  
  useEffect(() => {
    if (movedTaskId) {
      const timer = setTimeout(() => setMovedTaskId(null), 500); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [movedTaskId]);


  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim() === '') return;
    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim(),
      completed: false,
    };
    setTasks(prev => [task, ...prev]);
    setNewTaskTitle('');
    setNewTaskDescription('');
  };

  const handleUpdateTask = () => {
    if (!editingTask) return;
    setTasks(prev =>
      prev.map(task =>
        task.id === editingTask.id ? editingTask : task
      )
    );
    setEditingTask(null);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    setEditingTask(null);
  };

  const handleMoveTask = (taskId: string, direction: 'up' | 'down') => {
    setTasks(prev => {
      const taskIndex = prev.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return prev;

      const newTasks = [...prev];
      const task = newTasks[taskIndex];
      const swapIndex = direction === 'up' ? taskIndex - 1 : taskIndex + 1;

      if (swapIndex < 0 || swapIndex >= newTasks.length) return prev;

      newTasks[taskIndex] = newTasks[swapIndex];
      newTasks[swapIndex] = task;

      setMovedTaskId(taskId);
      return newTasks;
    });
  };
  
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p>Memuat...</p>
      </div>
    );
  }

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent className="p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/">
                <LayoutDashboard />
                <span>Lacak Hari Ini</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/tasks" isActive>
                <ListTodo />
                <span>Tugas Harian</span>
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
          <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-4">
                        <SidebarTrigger className="md:hidden" />
                        <h1 className="text-xl font-bold">Tugas Harian</h1>
                    </div>
                     <SidebarTrigger className="hidden md:flex" />
                </div>
            </div>
           </header>
          <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Buat Daftar Tugas Hari Ini</CardTitle>
                    <p className="text-muted-foreground">Tambahkan pekerjaan dengan judul dan deskripsi (opsional) yang perlu Anda selesaikan hari ini.</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddTask} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                        <div className="md:col-span-2 space-y-2">
                             <label htmlFor="task-title" className="text-sm font-medium">Judul Tugas</label>
                             <Input 
                                id="task-title"
                                type="text"
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                placeholder="misal: Bayar tagihan"
                                className="h-11 text-base"
                                required
                            />
                        </div>
                       <div className="md:col-span-2 space-y-2">
                            <label htmlFor="task-desc" className="text-sm font-medium">Deskripsi (Opsional)</label>
                            <Input 
                                id="task-desc"
                                type="text"
                                value={newTaskDescription}
                                onChange={(e) => setNewTaskDescription(e.target.value)}
                                placeholder="misal: lewat m-banking"
                                className="h-11 text-base"
                            />
                        </div>
                        <div className="md:col-span-1 flex items-end">
                            <Button type="submit" className="h-11 w-full">
                                <Plus className="mr-2 h-4 w-4"/>
                                Tambah
                            </Button>
                        </div>
                    </form>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Harus Dilakukan ({pendingTasks.length})</h3>
                            {pendingTasks.length > 0 ? (
                                <ul className="space-y-3">
                                    {pendingTasks.map((task, index) => (
                                        <li 
                                           key={task.id} 
                                           className={cn(
                                             "flex items-center gap-3 p-3 bg-background rounded-md border transition-colors duration-300",
                                             movedTaskId === task.id && "bg-primary/20"
                                           )}
                                         >
                                            <Checkbox id={`task-${task.id}`} className="mt-1" onCheckedChange={() => handleToggleTask(task.id)} />
                                            <div className="flex-grow cursor-pointer" onClick={() => setEditingTask(task)}>
                                                <label htmlFor={`task-${task.id}`} className="font-semibold text-base">{task.title}</label>
                                                {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
                                            </div>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleMoveTask(task.id, 'up')} disabled={index === 0}>
                                                    <ArrowUp className="h-4 w-4" />
                                                    <span className="sr-only">Naik</span>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleMoveTask(task.id, 'down')} disabled={index === pendingTasks.length - 1}>
                                                    <ArrowDown className="h-4 w-4" />
                                                    <span className="sr-only">Turun</span>
                                                </Button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted-foreground text-center py-4">Tidak ada tugas yang harus dilakukan. Selamat menikmati waktumu!</p>
                            )}
                        </div>

                        {completedTasks.length > 0 && (
                            <div>
                                <Separator className="my-4"/>
                                <h3 className="text-lg font-semibold mb-3">Selesai ({completedTasks.length})</h3>
                                <ul className="space-y-3">
                                    {completedTasks.map(task => (
                                        <li key={task.id} className="flex items-center gap-3 p-3 bg-slate-100 rounded-md">
                                            <Checkbox id={`task-${task.id}`} className="mt-1" checked onCheckedChange={() => handleToggleTask(task.id)} />
                                            <div className="flex-grow cursor-pointer" onClick={() => setEditingTask(task)}>
                                                <label htmlFor={`task-${task.id}`} className="font-semibold text-base text-muted-foreground line-through">{task.title}</label>
                                                {task.description && <p className="text-sm text-muted-foreground line-through">{task.description}</p>}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
          </main>
          <Footer />
        </div>
      </SidebarInset>
      
      {editingTask && (
        <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Detail Tugas</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                     <div className="space-y-2">
                        <label htmlFor="edit-task-title" className="text-sm font-medium">Judul Tugas</label>
                        <Input 
                            id="edit-task-title"
                            value={editingTask.title} 
                            onChange={(e) => setEditingTask({...editingTask, title: e.target.value})} 
                            className="text-base"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="edit-task-desc" className="text-sm font-medium">Deskripsi</label>
                        <Textarea 
                            id="edit-task-desc"
                            value={editingTask.description} 
                            onChange={(e) => setEditingTask({...editingTask, description: e.target.value ?? ''})}
                            placeholder="Tambahkan deskripsi..."
                            className="text-base"
                            rows={3}
                        />
                    </div>
                </div>
                <DialogFooter className="sm:justify-between">
                     <Button 
                        type="button"
                        variant="destructive" 
                        onClick={() => handleDeleteTask(editingTask.id)} 
                        className="sm:mr-auto"
                    >
                        <Trash2 className="mr-2 h-4 w-4"/> Hapus
                    </Button>
                    <div className="flex gap-2">
                        <Button type="button" variant="secondary" onClick={() => setEditingTask(null)}>Batal</Button>
                        <Button onClick={handleUpdateTask}>Simpan Perubahan</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      )}
    </SidebarProvider>
  );
}
