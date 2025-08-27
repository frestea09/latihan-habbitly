import type { Habit, HabitLog } from './types';

export const initialHabits: Habit[] = [
  { id: '1', name: 'Jurnal Pagi', category: 'morning' },
  { id: '2', name: 'Baca Quran setelah Subuh', category: 'morning' },
  { id: '3', name: 'Sholat Sunnah Dzuhur', category: 'after_dhuhr' },
  { id: '4', name: 'Dzikir Sore', category: 'afternoon_evening' },
  { id: '5', name: 'Evaluasi tugas harian', category: 'afternoon_evening' },
  { id: '6', name: 'Baca buku sebelum tidur', category: 'sleep_prep' },
  { id: '7', name: 'Menilai Kualitas Tidur', category: 'sleep_prep' },
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
          journal: `Senang sekali bisa menyelesaikan ${habit.name} hari ini.`,
        });
      } else {
        logs.push({
          id: `log-${habit.id}-${i}`,
          habitId: habit.id,
          date: dateString,
          completed: false,
          reasonForMiss: `Terlalu sibuk dengan hal lain.`,
        });
      }
    }
  });

  return logs;
};


export const initialLogs: HabitLog[] = generateLast7DaysLogs();
