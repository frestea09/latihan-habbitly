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

const formSchema = z.object({
  name: z.string().min(3, 'Habit name must be at least 3 characters.'),
  category: z.enum(['morning', 'after_dhuhr', 'afternoon_evening', 'sleep_prep']),
});

type AddHabitFormProps = {
  onAddHabit: (habit: Omit<Habit, 'id'>) => void;
  setDialogOpen: (open: boolean) => void;
};

export default function AddHabitForm({ onAddHabit, setDialogOpen }: AddHabitFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      category: 'morning',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAddHabit({
      name: values.name,
      category: values.category as HabitCategory,
    });
    form.reset();
    setDialogOpen(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Habit Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Read for 15 minutes" {...field} />
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
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="after_dhuhr">After Dhuhr</SelectItem>
                  <SelectItem value="afternoon_evening">Afternoon & Evening</SelectItem>
                  <SelectItem value="sleep_prep">Sleep Prep & Quality</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Add Habit
        </Button>
      </form>
    </Form>
  );
}
