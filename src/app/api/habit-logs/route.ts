import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const user = await prisma.user.findFirst();
  if (!user) {
    return NextResponse.json([]);
  }
  const logs = await prisma.habitLog.findMany({
    where: {
      habit: { userId: user.id },
      ...(date ? { date: new Date(date) } : {}),
    },
    orderBy: { date: 'asc' },
  });
  return NextResponse.json(
    logs.map((log) => ({
      ...log,
      date: log.date.toISOString().split('T')[0],
    }))
  );
}

export async function POST(request: Request) {
  const { habitId, date, completed, journal, reasonForMiss } = await request.json();
  const log = await prisma.habitLog.upsert({
    where: { habitId_date: { habitId, date: new Date(date) } },
    update: { completed, journal, reasonForMiss },
    create: { habitId, date: new Date(date), completed, journal, reasonForMiss },
  });
  return NextResponse.json({
    ...log,
    date: log.date.toISOString().split('T')[0],
  }, { status: 201 });
}

