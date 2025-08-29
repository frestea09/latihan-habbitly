'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarInset, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar';
import { LayoutDashboard, BarChart3, Settings, ListTodo, ChevronDown, Wallet, BookOpen } from 'lucide-react';
import Footer from '@/components/organisms/footer';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Transaction } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ChartConfig } from '@/components/ui/chart';

type FilterRange = 'this-month' | 'last-month' | 'all';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff4d4d', '#4dff4d', '#4d4dff'];

const chartConfig = {
  pemasukan: {
    label: "Pemasukan",
    color: "hsl(var(--chart-2))",
  },
  pengeluaran: {
    label: "Pengeluaran",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function FinanceReportsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(true);
  const [isLearningOpen, setIsLearningOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<FilterRange>('this-month');

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn');
    if (loggedIn !== 'true') {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
      const storedTransactions = sessionStorage.getItem('transactions');
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }
    }
  }, [router]);
  
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p>Memuat...</p>
      </div>
    );
  }

  const filteredTransactions = transactions.filter(tx => {
    const today = new Date();
    const txDate = new Date(tx.date);
    
    switch (filter) {
        case 'this-month':
            return txDate.getMonth() === today.getMonth() && txDate.getFullYear() === today.getFullYear();
        case 'last-month': {
            const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            return txDate.getMonth() === lastMonth.getMonth() && txDate.getFullYear() === lastMonth.getFullYear();
        }
        case 'all':
        default:
            return true;
    }
  });
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const getMonthlySummary = (txs: Transaction[]): { month: string, pemasukan: number, pengeluaran: number }[] => {
    const summary: Record<string, { pemasukan: number, pengeluaran: number }> = {};

    txs.forEach(tx => {
        const month = new Date(tx.date).toLocaleString('id-ID', { month: 'short', year: '2-digit' });
        if (!summary[month]) {
            summary[month] = { pemasukan: 0, pengeluaran: 0 };
        }
        if (tx.type === 'income') {
            summary[month].pemasukan += tx.amount;
        } else {
            summary[month].pengeluaran += tx.amount;
        }
    });

    return Object.entries(summary).map(([month, data]) => ({ month, ...data })).reverse();
  };
  
  const getCategorySummary = (txs: Transaction[]): { name: string, value: number }[] => {
      const summary: Record<string, number> = {};
      
      txs.filter(tx => tx.type === 'expense').forEach(tx => {
          if (!summary[tx.category]) {
              summary[tx.category] = 0;
          }
          summary[tx.category] += tx.amount;
      });

      return Object.entries(summary).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }

  const barChartData = getMonthlySummary(filteredTransactions);
  const pieChartData = getCategorySummary(filteredTransactions);
  
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
                <div className="flex items-center justify-between p-2 rounded-md hover:bg-sidebar-accent bg-sidebar-accent">
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
                    <SidebarMenuButton href="/finance/reports" variant="outline" size="sm" isActive>
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
                        <h1 className="text-xl font-bold">Laporan Keuangan</h1>
                    </div>
                     <div className="hidden md:flex items-center gap-4">
                        <SidebarTrigger />
                    </div>
                </div>
            </div>
           </header>
          <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
             <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                <div className="w-full">
                    <h2 className="text-2xl font-bold">Ringkasan Keuangan</h2>
                    <p className="text-muted-foreground text-lg">Analisis kondisi keuangan Anda berdasarkan periode.</p>
                </div>
                <Tabs defaultValue={filter} onValueChange={(value) => setFilter(value as FilterRange)} className="w-full md:w-auto">
                    <TabsList className="grid w-full grid-cols-3 md:w-auto">
                        <TabsTrigger value="this-month">Bulan Ini</TabsTrigger>
                        <TabsTrigger value="last-month">Bulan Lalu</TabsTrigger>
                        <TabsTrigger value="all">Semua</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            
            {filteredTransactions.length > 0 ? (
                 <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pemasukan vs Pengeluaran</CardTitle>
                             <CardDescription>Perbandingan total pemasukan dan pengeluaran per bulan.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={barChartData}>
                                     <XAxis
                                        dataKey="month"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `Rp${Number(value) / 1000}k`}
                                    />
                                    <Tooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{backgroundColor: 'hsl(var(--background))'}} formatter={(value) => formatCurrency(Number(value))}/>
                                    <Legend />
                                    <Bar dataKey="pemasukan" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Pemasukan"/>
                                    <Bar dataKey="pengeluaran" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Pengeluaran"/>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Rincian Pengeluaran per Kategori</CardTitle>
                            <CardDescription>Lihat ke mana saja uang Anda dibelanjakan.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           {pieChartData.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={pieChartData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={120}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                                                  const RADIAN = Math.PI / 180;
                                                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                                  return (
                                                    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                                                      {`${(percent * 100).toFixed(0)}%`}
                                                    </text>
                                                  );
                                                }}
                                            >
                                                {pieChartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                             <Tooltip formatter={(value) => formatCurrency(Number(value))}/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="space-y-3">
                                        {pieChartData.map((entry, index) => (
                                            <div key={`legend-${index}`} className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                                    <span>{entry.name}</span>
                                                </div>
                                                <span className="font-medium">{formatCurrency(entry.value)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                             ) : (
                                <p className="text-muted-foreground text-center py-6">Tidak ada data pengeluaran pada periode ini.</p>
                             )}
                        </CardContent>
                    </Card>
                 </div>
            ) : (
                 <div className="text-center py-10 px-4 rounded-lg bg-card border">
                    <h3 className="text-xl font-semibold">Data Tidak Ditemukan</h3>
                    <p className="text-muted-foreground mt-2">Mulai catat transaksi Anda di halaman Money Stream untuk melihat laporannya di sini.</p>
                  </div>
            )}
          </main>
          <Footer />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
