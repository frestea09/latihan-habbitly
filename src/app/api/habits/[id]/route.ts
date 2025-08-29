import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const { name, category } = await request.json();
  const habit = await prisma.habit.update({
    where: { id },
    data: { name, category },
  });
  return NextResponse.json(habit);
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  await prisma.habit.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
