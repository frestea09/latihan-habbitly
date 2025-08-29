import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const data = await request.json()
  const task = await prisma.task.update({
    where: { id: params.id },
    data,
  })
  return NextResponse.json(task)
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  await prisma.task.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
