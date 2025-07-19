import { auth } from '@clerk/nextjs/server'
import { db } from '@/drizzle/db'
import { EventTable } from '@/drizzle/schema'
import { eventFormSchema } from '@/schema/events'
import { eq, and } from 'drizzle-orm'
import { NextRequest } from 'next/server'

// GET /api/events - Get all events for authenticated user
export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const events = await db.query.EventTable.findMany({
      where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
      orderBy: ({ name }, { asc, sql }) => asc(sql`lower(${name})`),
    })

    return Response.json(events)
  } catch (error: any) {
    console.error('Error fetching events:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

// POST /api/events - Create new event
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const { success, data } = eventFormSchema.safeParse(body)

    if (!success) {
      return new Response('Invalid event data', { status: 400 })
    }

    const [event] = await db.insert(EventTable)
      .values({ ...data, clerkUserId: userId })
      .returning()

    return Response.json(event)
  } catch (error: any) {
    console.error('Error creating event:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}