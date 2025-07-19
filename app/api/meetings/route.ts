import { auth } from '@clerk/nextjs/server'
import { db } from '@/drizzle/db'
import { meetingActionSchema } from '@/schema/meetings'
import { fromZonedTime } from 'date-fns-tz'
import { getValidTimesFromSchedule } from '@/server/actions/schedule'
import { createCalendarEvent } from '@/server/google/googleCalender'
import { NextRequest } from 'next/server'

// POST /api/meetings - Create a new meeting
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { success, data } = meetingActionSchema.safeParse(body)

    if (!success) {
      return new Response('Invalid meeting data', { status: 400 })
    }

    // Find the event
    const event = await db.query.EventTable.findFirst({
      where: ({ clerkUserId, isActive, id }, { eq, and }) =>
        and(
          eq(isActive, true),
          eq(clerkUserId, data.clerkUserId),
          eq(id, data.eventId)
        ),
    })

    if (!event) {
      return new Response('Event not found', { status: 404 })
    }

    // Convert time to UTC
    const startInTimezone = fromZonedTime(data.startTime, data.timezone)

    // Validate time slot
    const validTimes = await getValidTimesFromSchedule([startInTimezone], event)

    if (validTimes.length === 0) {
      return new Response('Selected time is not available', { status: 400 })
    }

    // Create Google Calendar event
    const calendarEvent = await createCalendarEvent({
      ...data,
      startTime: startInTimezone,
      durationInMinutes: event.durationInMinutes,
      eventName: event.name,
    })

    return Response.json({
      success: true,
      calendarEvent,
      redirectUrl: `/book/${data.clerkUserId}/${data.eventId}/success?startTime=${data.startTime.toISOString()}`
    })
  } catch (error: any) {
    console.error('Error creating meeting:', error)
    return new Response('Failed to create meeting', { status: 500 })
  }
}