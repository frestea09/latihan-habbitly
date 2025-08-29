import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params {
  params: { id: string };
}

export async function GET(_request: Request, { params }: Params) {
  const log = await prisma.habitLog.findUnique({ where: { id: params.id } });
  if (!log) {
    return NextResponse.json(null, { status: 404 });
  }
  return NextResponse.json({
    ...log,
    date: log.date.toISOString().split('T')[0],
  });
}

export async function PUT(request: Request, { params }: Params) {
  const { completed, journal, reasonForMiss } = await request.json();
  const log = await prisma.habitLog.update({
    where: { id: params.id },
    data: { completed, journal, reasonForMiss },
  });
  return NextResponse.json({
    ...log,
    date: log.date.toISOString().split('T')[0],
  });
}

export async function DELETE(_request: Request, { params }: Params) {
  await prisma.habitLog.delete({ where: { id: params.id } });
  return NextResponse.json(null, { status: 204 });
}

