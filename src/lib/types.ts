export type HabitCategory = 'morning' | 'after_dhuhr' | 'afternoon_evening' | 'sleep_prep';
export type HabitCategoryWithAll = HabitCategory | 'all';

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

export type LearningStep = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
};

export type LearningRoadmap = {
  id: string;
  topic: string;
  steps: LearningStep[];
};

export type Transaction = {
  id: string;
  date: string; // YYYY-MM-DD
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
};
