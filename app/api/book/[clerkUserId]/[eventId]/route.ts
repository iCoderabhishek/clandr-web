import { db } from '@/drizzle/db'
import { clerkClient } from '@clerk/nextjs/server'
import { getValidTimesFromSchedule } from '@/server/actions/schedule'
import {
  addYears,
  eachMinuteOfInterval,
  endOfDay,
  roundToNearestMinutes,
} from 'date-fns'
import { NextRequest } from 'next/server'

// GET /api/book/[clerkUserId]/[eventId] - Get available times for booking
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clerkUserId: string; eventId: string }> }
) {
  try {
    const { clerkUserId, eventId } = await params

    // Get event details
    const event = await db.query.EventTable.findFirst({
      where: ({ clerkUserId: userIdCol, id, isActive }, { eq, and }) =>
        and(eq(userIdCol, clerkUserId), eq(id, eventId), eq(isActive, true)),
    })

    if (!event) {
      return new Response('Event not found', { status: 404 })
    }

    // Get user info
    const client = await clerkClient()
    const user = await client.users.getUser(clerkUserId)

    // Generate time slots for the next year
    const startDate = roundToNearestMinutes(new Date(), {
      nearestTo: 15,
      roundingMethod: 'ceil',
    })
    const endDate = endOfDay(addYears(startDate, 1))

    const validTimes = await getValidTimesFromSchedule(
      eachMinuteOfInterval({ start: startDate, end: endDate }, { step: 15 }),
      event
    )

    return Response.json({
      event,
      user: {
        id: user.id,
        fullName: user.fullName,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      validTimes,
    })
  } catch (error: any) {
    console.error('Error fetching booking data:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}