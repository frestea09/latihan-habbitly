import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const log = await prisma.habitLog.findUnique({ where: { id } });
  if (!log) {
    return NextResponse.json(null, { status: 404 });
  }
  return NextResponse.json({
    ...log,
    date: log.date.toISOString().split('T')[0],
  });
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const { completed, journal, reasonForMiss } = await request.json();
  const log = await prisma.habitLog.update({
    where: { id },
    data: { completed, journal, reasonForMiss },
  });
  return NextResponse.json({
    ...log,
    date: log.date.toISOString().split('T')[0],
  });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  await prisma.habitLog.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}

