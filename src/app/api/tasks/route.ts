import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const user = await prisma.user.findFirst()
  if (!user) return NextResponse.json([])
  const tasks = await prisma.task.findMany({
    where: { userId: user.id },
    orderBy: { position: 'asc' },
  })
  return NextResponse.json(tasks)
}

export async function POST(request: NextRequest) {
  const user = await prisma.user.findFirst()
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 400 })
  }
  const body = await request.json()
  const count = await prisma.task.count({ where: { userId: user.id } })
  const task = await prisma.task.create({
    data: {
      userId: user.id,
      title: body.title,
      description: body.description,
      completed: false,
      position: count,
    },
  })
  return NextResponse.json(task, { status: 201 })
}
