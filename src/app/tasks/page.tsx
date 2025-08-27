
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarInset, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar';
import { LayoutDashboard, BarChart3, Settings, ListTodo, Plus, Trash2 } from 'lucide-react';
import Footer from '@/components/organisms/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type Task = {
  id: string;
  text: string;
  completed: boolean;
};

export default function TasksPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn');
    if (loggedIn !== 'true') {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim() === '') return;
    const task: Task = {
      id: `task-${Date.now()}`,
      text: newTask.trim(),
      completed: false,
    };
    setTasks(prev => [task, ...prev]);
    setNewTask('');
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
                </div>
            </div>
           </header>
          <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Buat Daftar Tugas Hari Ini</CardTitle>
                    <p className="text-muted-foreground">Tambahkan pekerjaan atau kegiatan yang perlu Anda selesaikan hari ini.</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddTask} className="flex items-center gap-2 mb-6">
                        <Input 
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="misal: Membayar tagihan listrik"
                            className="h-11 text-base"
                        />
                        <Button type="submit" className="h-11">
                            <Plus className="mr-2 h-4 w-4"/>
                            Tambah
                        </Button>
                    </form>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Harus Dilakukan ({pendingTasks.length})</h3>
                            {pendingTasks.length > 0 ? (
                                <ul className="space-y-3">
                                    {pendingTasks.map(task => (
                                        <li key={task.id} className="flex items-center gap-3 p-3 bg-background rounded-md border">
                                            <Checkbox id={`task-${task.id}`} onCheckedChange={() => handleToggleTask(task.id)} />
                                            <label htmlFor={`task-${task.id}`} className="flex-grow text-base">{task.text}</label>
                                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => handleDeleteTask(task.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
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
                                            <Checkbox id={`task-${task.id}`} checked onCheckedChange={() => handleToggleTask(task.id)} />
                                            <label htmlFor={`task-${task.id}`} className="flex-grow text-base text-muted-foreground line-through">{task.text}</label>
                                             <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => handleDeleteTask(task.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
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
    </SidebarProvider>
  );
}
