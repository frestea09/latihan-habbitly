'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Habit, HabitCategory } from '@/lib/types';
import Footer from '@/components/organisms/footer';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ListTodo,
  BarChart3,
  Wallet,
  BookOpen,
  ChevronDown,
  ListChecks,
  Settings,
} from 'lucide-react';

const CATEGORY_OPTIONS: { value: HabitCategory; label: string }[] = [
  { value: 'morning', label: 'Pagi' },
  { value: 'after_dhuhr', label: 'Setelah Dzuhur' },
  { value: 'afternoon_evening', label: 'Sore & Malam' },
  { value: 'sleep_prep', label: 'Persiapan Tidur' },
]

export default function HabitsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [habits, setHabits] = useState<Habit[]>([])
  const [name, setName] = useState('')
  const [category, setCategory] = useState<HabitCategory>('morning')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isActivityOpen, setIsActivityOpen] = useState(true)
  const [isFinanceOpen, setIsFinanceOpen] = useState(false)
  const [isLearningOpen, setIsLearningOpen] = useState(false)

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn')
    if (loggedIn !== 'true') {
      router.push('/login')
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  useEffect(() => {
    if (!isAuthenticated) return
    fetch('/api/habits')
      .then(res => res.json())
      .then((data: Habit[]) => setHabits(data))
  }, [isAuthenticated])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      const res = await fetch(`/api/habits/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category }),
      })
      const updated = await res.json()
      setHabits(habits.map(h => (h.id === editingId ? updated : h)))
    } else {
      const res = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category }),
      })
      const created = await res.json()
      setHabits([...habits, created])
    }
    setName('')
    setCategory('morning')
    setEditingId(null)
  }

  const handleEdit = (habit: Habit) => {
    setEditingId(habit.id)
    setName(habit.name)
    setCategory(habit.category)
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/habits/${id}`, { method: 'DELETE' })
    setHabits(habits.filter(h => h.id !== id))
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p>Memuat...</p>
      </div>
    )
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
                  <ChevronDown className={cn('h-5 w-5 transition-transform', isActivityOpen && 'rotate-180')} />
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
                    <SidebarMenuButton href="/habits" variant="outline" size="sm" isActive>
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
                  <ChevronDown className={cn('h-5 w-5 transition-transform', isFinanceOpen && 'rotate-180')} />
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
                  <ChevronDown className={cn('h-5 w-5 transition-transform', isLearningOpen && 'rotate-180')} />
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
                  <h1 className="text-xl font-bold">Manajemen Kebiasaan</h1>
                </div>
                <div className="hidden md:flex items-center gap-4">
                  <SidebarTrigger />
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Nama kebiasaan"
                value={name}
                onChange={e => setName(e.target.value)}
                className="flex-1"
                required
              />
              <Select value={category} onValueChange={(v: HabitCategory) => setCategory(v)}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit" className="w-full md:w-auto">
                {editingId ? 'Simpan' : 'Tambah'}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null)
                    setName('')
                    setCategory('morning')
                  }}
                >
                  Batal
                </Button>
              )}
            </form>
            <ul className="space-y-3">
              {habits.map(habit => (
                <li
                  key={habit.id}
                  className="flex items-center justify-between p-3 bg-background rounded-md border"
                >
                  <div>
                    <p className="font-medium">{habit.name}</p>
                    <p className="text-sm text-muted-foreground">{CATEGORY_OPTIONS.find(c => c.value === habit.category)?.label}</p>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(habit)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(habit.id)}>
                      Hapus
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </main>
          <Footer />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
