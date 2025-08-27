import type { Habit, HabitLog } from './types';

export const initialHabits: Habit[] = [
  { id: '1', name: 'Morning Journaling', category: 'morning' },
  { id: '2', name: 'Read Quran after Fajr', category: 'morning' },
  { id: '3', name: 'Quick Dhuhr Sunnah Prayer', category: 'after_dhuhr' },
  { id: '4', name: 'Evening Dhikr', category: 'afternoon_evening' },
  { id: '5', name: 'Review daily tasks', category: 'afternoon_evening' },
  { id: '6', name: 'Read a book before sleep', category: 'sleep_prep' },
  { id: '7', name: 'Rate Sleep Quality', category: 'sleep_prep' },
];

const generateLast7DaysLogs = (): HabitLog[] => {
  const logs: HabitLog[] = [];
  const today = new Date();

  initialHabits.forEach(habit => {
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const shouldComplete = Math.random() > 0.3; // 70% chance of completion
      
      if (shouldComplete) {
        logs.push({
          id: `log-${habit.id}-${i}`,
          habitId: habit.id,
          date: dateString,
          completed: true,
          journal: `Felt good completing ${habit.name} today.`,
        });
      } else {
        logs.push({
          id: `log-${habit.id}-${i}`,
          habitId: habit.id,
          date: dateString,
          completed: false,
          reasonForMiss: `Was too busy with other things.`,
        });
      }
    }
  });

  return logs;
};


export const initialLogs: HabitLog[] = generateLast7DaysLogs();
