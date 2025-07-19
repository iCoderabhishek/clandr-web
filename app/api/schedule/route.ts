import { auth } from '@clerk/nextjs/server'
import { db } from '@/drizzle/db'
import { ScheduleTable, ScheduleAvailabilityTable } from '@/drizzle/schema'
import { scheduleFormSchema } from '@/schema/schedule'
import { eq } from 'drizzle-orm'
import { NextRequest } from 'next/server'
import { BatchItem } from 'drizzle-orm/batch'

// GET /api/schedule - Get user's schedule
export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const schedule = await db.query.ScheduleTable.findFirst({
      where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
      with: {
        availabilities: true,
      },
    })

    return Response.json(schedule || null)
  } catch (error: any) {
    console.error('Error fetching schedule:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

// POST /api/schedule - Save user's schedule
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const { success, data } = scheduleFormSchema.safeParse(body)

    if (!success) {
      return new Response('Invalid schedule data', { status: 400 })
    }

    const { availabilities, ...scheduleData } = data

    // Insert or update schedule
    const [{ id: scheduleId }] = await db
      .insert(ScheduleTable)
      .values({ ...scheduleData, clerkUserId: userId })
      .onConflictDoUpdate({
        target: ScheduleTable.clerkUserId,
        set: scheduleData,
      })
      .returning({ id: ScheduleTable.id })

    // Prepare batch statements
    const statements: [BatchItem<"pg">] = [
      db
        .delete(ScheduleAvailabilityTable)
        .where(eq(ScheduleAvailabilityTable.scheduleId, scheduleId)),
    ]

    if (availabilities.length > 0) {
      statements.push(
        db.insert(ScheduleAvailabilityTable).values(
          availabilities.map(availability => ({
            ...availability,
            scheduleId,
          }))
        )
      )
    }

    await db.batch(statements)

    // Return updated schedule
    const updatedSchedule = await db.query.ScheduleTable.findFirst({
      where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
      with: {
        availabilities: true,
      },
    })

    return Response.json(updatedSchedule)
  } catch (error: any) {
    console.error('Error saving schedule:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}