import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const user = await prisma.user.findFirst()
  if (!user) return NextResponse.json([])
  const habits = await prisma.habit.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json(habits)
}

export async function POST(request: NextRequest) {
  const user = await prisma.user.findFirst()
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 400 })
  }
  const body = await request.json()
  const habit = await prisma.habit.create({
    data: {
      userId: user.id,
      name: body.name,
      category: body.category,
    },
  })
  return NextResponse.json(habit, { status: 201 })
}
