import { PrismaClient, HabitCategory, TransactionType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Clean up existing data
  await prisma.habitLog.deleteMany();
  await prisma.habit.deleteMany();
  await prisma.task.deleteMany();
  await prisma.learningStep.deleteMany();
  await prisma.learningRoadmap.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.user.deleteMany();

  // Create a demo user
  const user = await prisma.user.create({
    data: {
      username: 'admin',
      password: '123456', // In a real app, hash this!
    },
  })
  console.log(`Created user with id: ${user.id}`)

  // Seed Habits and Habit Logs
  const habitsData = [
    { name: 'Jurnal Pagi', category: HabitCategory.morning },
    { name: 'Baca Quran setelah Subuh', category: HabitCategory.morning },
    { name: 'Sholat Sunnah Dzuhur', category: HabitCategory.after_dhuhr },
    { name: 'Dzikir Sore', category: HabitCategory.afternoon_evening },
    { name: 'Evaluasi tugas harian', category: HabitCategory.afternoon_evening },
    { name: 'Baca buku sebelum tidur', category: HabitCategory.sleep_prep },
    { name: 'Menilai Kualitas Tidur', category: HabitCategory.sleep_prep },
  ];

  for (const habitData of habitsData) {
    const habit = await prisma.habit.create({
      data: {
        userId: user.id,
        ...habitData,
      },
    });

    // Create logs for the last 7 days for this habit
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const shouldComplete = Math.random() > 0.3; // 70% chance

      await prisma.habitLog.create({
        data: {
          habitId: habit.id,
          date: date,
          completed: shouldComplete,
          journal: shouldComplete ? `Menyelesaikan ${habit.name} dengan baik.` : null,
          reasonForMiss: !shouldComplete ? `Terlalu sibuk.` : null,
        },
      });
    }
  }
  console.log('Seeded habits and habit logs.');

  // Seed Tasks
  const tasksData = [
    { title: 'Bayar tagihan internet', description: 'via m-banking', completed: false, position: 0 },
    { title: 'Beli bahan makanan untuk seminggu', description: 'Daftar belanja ada di catatan', completed: false, position: 1 },
    { title: 'Selesaikan laporan bulanan', description: '', completed: true, position: 2 },
  ];

  for (const taskData of tasksData) {
    await prisma.task.create({
      data: {
        userId: user.id,
        ...taskData
      }
    });
  }
  console.log('Seeded tasks.');

  // Seed Learning Roadmaps
  const roadmap = await prisma.learningRoadmap.create({
    data: {
      userId: user.id,
      topic: 'Belajar Memasak Masakan Italia',
      steps: {
        create: [
          { title: 'Menguasai Saus Tomat Dasar', completed: true },
          { title: 'Membuat Pasta Segar dari Awal', completed: true },
          { title: 'Teknik Memanggang Pizza Sempurna', completed: false },
          { title: 'Mempelajari Risotto', completed: false },
        ]
      }
    }
  });
  console.log('Seeded learning roadmaps.');
  
  // Seed Transactions
  const transactionsData = [
    { date: new Date(new Date().setDate(new Date().getDate() - 2)), type: TransactionType.income, amount: 5000000, category: 'Gaji', description: 'Gaji bulanan' },
    { date: new Date(new Date().setDate(new Date().getDate() - 2)), type: TransactionType.expense, amount: 50000, category: 'Makanan', description: 'Makan siang di kantor' },
    { date: new Date(new Date().setDate(new Date().getDate() - 1)), type: TransactionType.expense, amount: 15000, category: 'Transportasi', description: 'Ojek online' },
    { date: new Date(), type: TransactionType.expense, amount: 75000, category: 'Hiburan', description: 'Nonton film' },
  ];
  
  for(const txData of transactionsData) {
      await prisma.transaction.create({
          data: {
              userId: user.id,
              ...txData
          }
      });
  }
  console.log('Seeded transactions.');


  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
