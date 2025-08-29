import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const user = await prisma.user.findFirst();
  if (!user) {
    return NextResponse.json([]);
  }
  const habits = await prisma.habit.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'asc' },
  });
  return NextResponse.json(habits);
}

export async function POST(request: Request) {
  const { name, category } = await request.json();
  const user = await prisma.user.findFirst();
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 400 });
  }
  const habit = await prisma.habit.create({
    data: { name, category, userId: user.id },
  });
  return NextResponse.json(habit, { status: 201 });
}
