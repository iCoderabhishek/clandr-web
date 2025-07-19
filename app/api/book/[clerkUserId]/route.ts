import { db } from '@/drizzle/db'
import { clerkClient } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'

// GET /api/book/[clerkUserId] - Get public events for a user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clerkUserId: string }> }
) {
  try {
    const { clerkUserId } = await params

    // Get user info from Clerk
    const client = await clerkClient()
    const user = await client.users.getUser(clerkUserId)

    // Get public events
    const events = await db.query.EventTable.findMany({
      where: ({ clerkUserId: userIdCol, isActive }, { eq, and }) =>
        and(eq(userIdCol, clerkUserId), eq(isActive, true)),
      orderBy: ({ name }, { asc, sql }) => asc(sql`lower(${name})`),
    })

    return Response.json({
      user: {
        id: user.id,
        fullName: user.fullName,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      events,
    })
  } catch (error: any) {
    console.error('Error fetching public profile:', error)
    return new Response('User not found', { status: 404 })
  }
}