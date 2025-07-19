import { auth } from '@clerk/nextjs/server'
import { db } from '@/drizzle/db'
import { EventTable } from '@/drizzle/schema'
import { eventFormSchema } from '@/schema/events'
import { eq, and } from 'drizzle-orm'
import { NextRequest } from 'next/server'

// GET /api/events/[id] - Get specific event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    const { id } = await params
    
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const event = await db.query.EventTable.findFirst({
      where: ({ id: eventId, clerkUserId }, { and, eq }) =>
        and(eq(clerkUserId, userId), eq(eventId, id)),
    })

    if (!event) {
      return new Response('Event not found', { status: 404 })
    }

    return Response.json(event)
  } catch (error: any) {
    console.error('Error fetching event:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

// PUT /api/events/[id] - Update event
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    const { id } = await params
    
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const { success, data } = eventFormSchema.safeParse(body)

    if (!success) {
      return new Response('Invalid event data', { status: 400 })
    }

    const { rowCount } = await db
      .update(EventTable)
      .set({ ...data })
      .where(and(eq(EventTable.id, id), eq(EventTable.clerkUserId, userId)))

    if (rowCount === 0) {
      return new Response('Event not found or unauthorized', { status: 404 })
    }

    const updatedEvent = await db.query.EventTable.findFirst({
      where: ({ id: eventId, clerkUserId }, { and, eq }) =>
        and(eq(clerkUserId, userId), eq(eventId, id)),
    })

    return Response.json(updatedEvent)
  } catch (error: any) {
    console.error('Error updating event:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

// DELETE /api/events/[id] - Delete event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    const { id } = await params
    
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { rowCount } = await db
      .delete(EventTable)
      .where(and(eq(EventTable.id, id), eq(EventTable.clerkUserId, userId)))

    if (rowCount === 0) {
      return new Response('Event not found or unauthorized', { status: 404 })
    }

    return new Response('Event deleted successfully', { status: 200 })
  } catch (error: any) {
    console.error('Error deleting event:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}