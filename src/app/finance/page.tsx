
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarInset, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar';
import { LayoutDashboard, BarChart3, Settings, ListTodo, ChevronDown, Wallet, BookOpen, Plus, MoreHorizontal, Trash2, Pencil, ArrowDownUp } from 'lucide-react';
import Footer from '@/components/organisms/footer';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Transaction } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const defaultCategories = {
  expense: ['Makanan', 'Transportasi', 'Tagihan', 'Hiburan', 'Belanja', 'Kesehatan', 'Lainnya'],
  income: ['Gaji', 'Bonus', 'Investasi', 'Hadiah', 'Pekerjaan Sampingan', 'Lainnya'],
};

export default function FinancePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(true);
  const [isLearningOpen, setIsLearningOpen] = useState(false);
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const { toast } = useToast();

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

  useEffect(() => {
    if (isAuthenticated) {
      sessionStorage.setItem('transactions', JSON.stringify(transactions));
    }
  }, [transactions, isAuthenticated]);
  
  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: `txn-${Date.now()}` };
    setTransactions(prev => [newTransaction, ...prev].sort((a,b) => b.date.localeCompare(a.date)));
    toast({
      title: "Transaksi Ditambahkan!",
      description: `Transaksi "${transaction.description}" berhasil dicatat.`,
    });
  };

  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
     setTransactions(prev => 
        prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
        .sort((a,b) => b.date.localeCompare(a.date))
     );
     setEditingTransaction(null);
     toast({
      title: "Transaksi Diperbarui!",
      description: `Perubahan pada transaksi "${updatedTransaction.description}" berhasil disimpan.`,
    });
  };

  const handleDeleteTransaction = (transactionId: string) => {
    setTransactions(prev => prev.filter(t => t.id !== transactionId));
    setEditingTransaction(null);
     toast({
      title: "Transaksi Dihapus!",
      variant: "destructive"
    });
  }

  const { totalIncome, totalExpense, balance } = transactions.reduce(
    (acc, curr) => {
      if (curr.type === 'income') {
        acc.totalIncome += curr.amount;
      } else {
        acc.totalExpense += curr.amount;
      }
      acc.balance = acc.totalIncome - acc.totalExpense;
      return acc;
    },
    { totalIncome: 0, totalExpense: 0, balance: 0 }
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
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
                    <SidebarMenuButton href="/finance" variant="outline" size="sm" isActive>
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
                        <h1 className="text-xl font-bold">Money Stream</h1>
                    </div>
                     <div className="hidden md:flex items-center gap-4">
                        <SidebarTrigger />
                    </div>
                </div>
            </div>
           </header>
          <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Tambah Transaksi Baru</CardTitle>
                    <CardDescription>Catat pemasukan atau pengeluaran Anda.</CardDescription>
                </CardHeader>
                <CardContent>
                    <AddTransactionForm onAddTransaction={handleAddTransaction} />
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-center">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-medium text-green-600">Total Pemasukan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{formatCurrency(totalIncome)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-medium text-red-600">Total Pengeluaran</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{formatCurrency(totalExpense)}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-medium text-blue-600">Saldo Akhir</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{formatCurrency(balance)}</p>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Riwayat Transaksi</CardTitle>
                </CardHeader>
                <CardContent>
                    {transactions.length > 0 ? (
                        <ul className="space-y-4">
                            {transactions.map(tx => (
                                <li key={tx.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg border bg-background">
                                    <div className="flex items-center gap-4 mb-2 sm:mb-0">
                                        <div className={cn("flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center", tx.type === 'income' ? 'bg-green-100' : 'bg-red-100')}>
                                            <ArrowDownUp className={cn("h-5 w-5", tx.type === 'income' ? 'text-green-600' : 'text-red-600')} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-base">{tx.description}</p>
                                            <p className="text-sm text-muted-foreground">{new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} • {tx.category}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end gap-2">
                                       <p className={cn("font-bold text-lg", tx.type === 'income' ? 'text-green-600' : 'text-red-600')}>
                                           {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                                       </p>
                                       <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onSelect={() => setEditingTransaction(tx)}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    <span>Ubah</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onSelect={() => handleDeleteTransaction(tx.id)} className="text-red-500">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    <span>Hapus</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted-foreground text-center py-6">Belum ada transaksi. Mulai catat keuangan Anda!</p>
                    )}
                </CardContent>
            </Card>

          </main>
          <Footer />
        </div>
      </SidebarInset>

      {editingTransaction && (
        <EditTransactionDialog
          key={editingTransaction.id}
          transaction={editingTransaction}
          onUpdate={handleUpdateTransaction}
          onClose={() => setEditingTransaction(null)}
        />
      )}
    </SidebarProvider>
  );
}

// --- AddTransactionForm Component ---
type AddTransactionFormProps = {
    onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
};

function AddTransactionForm({ onAddTransaction }: AddTransactionFormProps) {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [category, setCategory] = useState('');
    const [customCategory, setCustomCategory] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !amount || (!category && !customCategory) ) return;
        
        onAddTransaction({
            date: new Date().toISOString().split('T')[0],
            description,
            amount: parseFloat(amount),
            type,
            category: customCategory || category,
        });

        setDescription('');
        setAmount('');
        setCategory('');
        setCustomCategory('');
    };

    const categories = type === 'income' ? defaultCategories.income : defaultCategories.expense;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="desc">Deskripsi</label>
                    <Input id="desc" value={description} onChange={e => setDescription(e.target.value)} placeholder="misal: Makan siang" required />
                </div>
                 <div className="space-y-2">
                    <label htmlFor="amount">Jumlah (Rp)</label>
                    <Input id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="misal: 50000" required />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="type">Jenis</label>
                    <Select value={type} onValueChange={(v: 'income' | 'expense') => setType(v)}>
                        <SelectTrigger id="type">
                            <SelectValue placeholder="Pilih jenis transaksi" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="expense">Pengeluaran</SelectItem>
                            <SelectItem value="income">Pemasukan</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <label htmlFor="category">Kategori</label>
                     <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger id="category">
                            <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
             {category === 'Lainnya' && (
                <div className="space-y-2">
                    <label htmlFor="custom-category">Kategori Lainnya</label>
                    <Input id="custom-category" value={customCategory} onChange={e => setCustomCategory(e.target.value)} placeholder="Tulis kategori Anda" required />
                </div>
            )}
            <Button type="submit" className="w-full md:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Transaksi
            </Button>
        </form>
    );
}

// --- EditTransactionDialog Component ---
type EditTransactionDialogProps = {
  transaction: Transaction;
  onUpdate: (transaction: Transaction) => void;
  onClose: () => void;
};

function EditTransactionDialog({ transaction, onUpdate, onClose }: EditTransactionDialogProps) {
  const [description, setDescription] = useState(transaction.description);
  const [amount, setAmount] = useState(String(transaction.amount));
  const [type, setType] = useState(transaction.type);
  const [category, setCategory] = useState(transaction.category);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
        ...transaction,
        description,
        amount: parseFloat(amount),
        type,
        category,
    });
  };

  const categories = type === 'income' ? defaultCategories.income : defaultCategories.expense;

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Ubah Transaksi</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="edit-desc">Deskripsi</label>
              <Input id="edit-desc" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-amount">Jumlah (Rp)</label>
              <Input id="edit-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-type">Jenis</label>
              <Select value={type} onValueChange={(v: 'income' | 'expense') => setType(v)}>
                <SelectTrigger id="edit-type">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="expense">Pengeluaran</SelectItem>
                    <SelectItem value="income">Pemasukan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
                <label htmlFor="edit-category">Kategori</label>
                <Input id="edit-category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="misal: Makanan" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
            <Button type="submit">Simpan Perubahan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
