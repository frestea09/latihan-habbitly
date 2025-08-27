export type HabitCategory = 'morning' | 'after_dhuhr' | 'afternoon_evening' | 'sleep_prep' | 'all';

export type Habit = {
  id: string;
  name: string;
  category: HabitCategory;
};

export type HabitLog = {
  id:string;
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  journal?: string;
  reasonForMiss?: string;
};

export type HabitWithLogs = Habit & {
    logs: HabitLog[];
};

export type TimeRange = 'weekly' | 'monthly' | 'yearly';
