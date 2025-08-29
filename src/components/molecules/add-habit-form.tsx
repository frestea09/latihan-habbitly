
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Habit, HabitCategory } from '@/lib/types';
import { useEffect } from 'react';

const formSchema = z.object({
  name: z.string().min(3, 'Nama kebiasaan minimal 3 karakter.'),
  category: z.enum(['morning', 'after_dhuhr', 'afternoon_evening', 'sleep_prep']),
});

type AddHabitFormProps = {
  onAddHabit: (habit: Omit<Habit, 'id'>) => void;
  setDialogOpen: (open: boolean) => void;
  initialData?: Habit;
};

export default function AddHabitForm({ onAddHabit, setDialogOpen, initialData }: AddHabitFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      category: initialData?.category || 'morning',
    },
  });
  
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAddHabit({
      name: values.name,
      category: values.category as HabitCategory,
    });
    form.reset();
    setDialogOpen(false);
  }

  const isEditing = !!initialData;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Kebiasaan</FormLabel>
              <FormControl>
                <Input placeholder="misal: Membaca buku 15 menit" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="morning">Pagi</SelectItem>
                  <SelectItem value="after_dhuhr">Setelah Dzuhur</SelectItem>
                  <SelectItem value="afternoon_evening">Sore & Malam</SelectItem>
                  <SelectItem value="sleep_prep">Persiapan & Kualitas Tidur</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full h-11">
          {isEditing ? 'Simpan Perubahan' : 'Tambah Kebiasaan'}
        </Button>
      </form>
    </Form>
  );
}
