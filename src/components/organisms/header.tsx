
'use client';

import { Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import AddHabitForm from '@/components/molecules/add-habit-form';
import type { Habit } from '@/lib/types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/atoms/logo';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';


type HeaderProps = {
  onAddHabit: (habit: Omit<Habit, 'id'>) => Promise<void>;
};

export default function Header({ onAddHabit }: HeaderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.clear();
    router.push('/login');
  };

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
            <Logo />
          </div>
          <div className="flex items-center gap-2">
             <SidebarTrigger className="hidden md:flex" />
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Tambah Kebiasaan
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Buat Kebiasaan Baru</DialogTitle>
                  <DialogDescription>
                    Tentukan kebiasaan baru yang ingin Anda lacak. Jadilah spesifik!
                  </DialogDescription>
                </DialogHeader>
                <AddHabitForm onAddHabit={onAddHabit} setDialogOpen={setIsDialogOpen} />
              </DialogContent>
            </Dialog>

             <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="outline">
                        <LogOut className="mr-2 h-4 w-4" />
                        Keluar
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin ingin keluar?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Anda akan dikembalikan ke halaman login. Semua data yang belum tersimpan mungkin akan hilang.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLogout}>Ya, Keluar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </header>
  );
}
