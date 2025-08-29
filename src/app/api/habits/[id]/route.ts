import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params {
  params: { id: string };
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = params;
  const { name, category } = await request.json();
  const habit = await prisma.habit.update({
    where: { id },
    data: { name, category },
  });
  return NextResponse.json(habit);
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = params;
  await prisma.habit.delete({ where: { id } });
  return NextResponse.json(null, { status: 204 });
}
