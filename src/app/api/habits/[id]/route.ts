import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const data = await request.json()
  const habit = await prisma.habit.update({
    where: { id: params.id },
    data,
  })
  return NextResponse.json(habit)
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  await prisma.habit.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
