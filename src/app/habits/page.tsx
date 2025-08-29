
'use client';

import { useEffect, useState, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarInset, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar';
import { LayoutDashboard, BarChart3, Settings, ListTodo, ChevronDown, Wallet, BookOpen, Plus, Trash2, Edit } from 'lucide-react';
import Footer from '@/components/organisms/footer';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import AddHabitForm from '@/components/molecules/add-habit-form';
import type { Habit, HabitCategory, HabitCategoryWithAll } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

const CATEGORY_MAP: Record<HabitCategoryWithAll, string> = {
    morning: 'Pagi',
    after_dhuhr: 'Setelah Dzuhur',
    afternoon_evening: 'Sore & Malam',
    sleep_prep: 'Persiapan & Kualitas Tidur',
    all: 'Semua'
};

export default function HabitsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isActivityOpen, setIsActivityOpen] = useState(true);
    const [isFinanceOpen, setIsFinanceOpen] = useState(false);
    const [isLearningOpen, setIsLearningOpen] = useState(false);

    const [habits, setHabits] = useState<Habit[]>([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

    const loadHabits = async () => {
        const res = await fetch('/api/habits', { cache: 'no-store' });
        if (res.ok) {
            const data = await res.json();
            setHabits(data);
        }
    };

    useEffect(() => {
        const loggedIn = sessionStorage.getItem('isLoggedIn');
        if (loggedIn !== 'true') {
            router.push('/login');
        } else {
            setIsAuthenticated(true);
            loadHabits();
        }
    }, [router]);
    
    const handleAddHabit = async (newHabitData: Omit<Habit, 'id'>) => {
        const res = await fetch('/api/habits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newHabitData),
        });
        if (res.ok) {
            const habit = await res.json();
            setHabits(prev => [...prev, habit]);
            toast({
                title: "Kebiasaan Ditambahkan!",
                description: `"${habit.name}" telah ditambahkan.`,
            });
        }
    };

    const handleUpdateHabit = async (updatedHabitData: Omit<Habit, 'id'>) => {
        if (!editingHabit) return;
        const res = await fetch(`/api/habits/${editingHabit.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedHabitData),
        });
        if (res.ok) {
            const habit = await res.json();
            setHabits(prev => prev.map(h => h.id === habit.id ? habit : h));
            toast({
                title: "Kebiasaan Diperbarui!",
                description: `"${habit.name}" telah berhasil diubah.`,
            });
            setEditingHabit(null);
        }
    };

    const handleDeleteHabit = async (habitId: string) => {
        const habitToDelete = habits.find(h => h.id === habitId);
        const res = await fetch(`/api/habits/${habitId}`, { method: 'DELETE' });
        if (res.ok) {
            await loadHabits();
            toast({
                title: "Kebiasaan Dihapus!",
                description: `"${habitToDelete?.name}" telah dihapus.`,
                variant: "destructive",
            });
        }
    };
    
    const groupedHabits = habits.reduce((acc, habit) => {
        (acc[habit.category] = acc[habit.category] || []).push(habit);
        return acc;
    }, {} as Record<HabitCategory, Habit[]>);
    

    if (!isAuthenticated) {
        return <div className="flex h-screen items-center justify-center bg-background"><p>Memuat...</p></div>;
    }

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarContent className="p-4 overflow-y-auto">
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
                                    <SidebarMenuButton href="/" variant="outline" size="sm">
                                    <LayoutDashboard />
                                    <span>Lacak Hari Ini</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton href="/habits" variant="outline" size="sm" isActive>
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
                    <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center justify-between h-16">
                                <div className="flex items-center gap-4">
                                    <SidebarTrigger className="md:hidden" />
                                    <h1 className="text-xl font-bold">Kelola Kebiasaan</h1>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                        <DialogTrigger asChild>
                                             <Button>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Tambah Kebiasaan
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Buat Kebiasaan Baru</DialogTitle>
                                                <DialogDescription>
                                                    Tentukan kebiasaan baru yang ingin Anda lacak. Jadilah spesifik!
                                                </DialogDescription>
                                            </DialogHeader>
                                            <AddHabitForm onAddHabit={handleAddHabit} setDialogOpen={setIsAddDialogOpen} />
                                        </DialogContent>
                                    </Dialog>
                                    <div className="hidden md:flex">
                                        <SidebarTrigger />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                       {habits.length > 0 ? (
                            <div className="space-y-8">
                                {Object.keys(groupedHabits).map(category => (
                                    <Card key={category}>
                                        <CardHeader>
                                            <CardTitle>{CATEGORY_MAP[category as HabitCategory]}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-3">
                                                {groupedHabits[category as HabitCategory].map((habit, index) => (
                                                   <Fragment key={habit.id}>
                                                   {index > 0 && <Separator />}
                                                    <li className="flex items-center justify-between py-2">
                                                        <span className="font-medium text-lg">{habit.name}</span>
                                                        <div className="flex items-center gap-2">
                                                            <Button variant="outline" size="sm" onClick={() => setEditingHabit(habit)}>
                                                                <Edit className="mr-2 h-4 w-4" /> Ubah
                                                            </Button>
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button variant="destructive" size="sm">
                                                                        <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            Tindakan ini tidak dapat diurungkan. Ini akan menghapus kebiasaan <strong>"{habit.name}"</strong> secara permanen.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                                                        <AlertDialogAction onClick={() => handleDeleteHabit(habit.id)}>
                                                                            Ya, Hapus
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </div>
                                                    </li>
                                                   </Fragment>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                       ): (
                           <div className="text-center py-10 px-4 rounded-lg bg-card border">
                                <h3 className="text-xl font-semibold">Belum Ada Kebiasaan</h3>
                                <p className="text-muted-foreground mt-2 mb-4">Mulai bangun rutinitas positif Anda dengan menambahkan kebiasaan pertama.</p>
                                <Button onClick={() => setIsAddDialogOpen(true)}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Tambah Kebiasaan Pertama
                                </Button>
                            </div>
                       )}
                    </main>
                    <Footer />
                </div>
            </SidebarInset>

            {editingHabit && (
                <Dialog open={!!editingHabit} onOpenChange={() => setEditingHabit(null)}>
                     <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Ubah Kebiasaan</DialogTitle>
                            <DialogDescription>
                                Perbarui detail kebiasaan Anda di sini.
                            </DialogDescription>
                        </DialogHeader>
                        <AddHabitForm
                            onAddHabit={(data) => handleUpdateHabit(data)}
                            setDialogOpen={() => setEditingHabit(null)}
                            // Pass existing values to the form for editing
                            initialData={editingHabit}
                        />
                    </DialogContent>
                </Dialog>
            )}

        </SidebarProvider>
    );
}
