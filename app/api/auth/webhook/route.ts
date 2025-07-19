import { db } from '@/drizzle/db'
import { UserTable } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextRequest } from 'next/server'
import { Webhook } from 'svix'

// Clerk webhook to sync user data
export async function POST(request: NextRequest) {
  try {
    // Get the headers
    const headerPayload = await headers()
    const svix_id = headerPayload.get('svix-id')
    const svix_timestamp = headerPayload.get('svix-timestamp')
    const svix_signature = headerPayload.get('svix-signature')

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response('Error occurred -- no svix headers', {
        status: 400,
      })
    }

    // Get the body
    const payload = await request.json()
    const body = JSON.stringify(payload)

    // Create a new Svix instance with your secret
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)

    let evt: any

    // Verify the payload with the headers
    try {
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as any
    } catch (err) {
      console.error('Error verifying webhook:', err)
      return new Response('Error occurred', {
        status: 400,
      })
    }

    // Handle the webhook
    const { id, email_addresses, first_name, last_name, image_url } = evt.data
    const eventType = evt.type

    console.log(`Webhook with an ID of ${id} and type of ${eventType}`)

    switch (eventType) {
      case 'user.created':
        // Create user in database
        await db.insert(UserTable).values({
          clerkUserId: id,
          email: email_addresses[0]?.email_address || '',
          firstName: first_name || null,
          lastName: last_name || null,
          imageUrl: image_url || null,
        })
        console.log('User created:', id)
        break

      case 'user.updated':
        // Update user in database
        await db
          .update(UserTable)
          .set({
            email: email_addresses[0]?.email_address || '',
            firstName: first_name || null,
            lastName: last_name || null,
            imageUrl: image_url || null,
            updatedAt: new Date(),
          })
          .where(eq(UserTable.clerkUserId, id))
        console.log('User updated:', id)
        break

      case 'user.deleted':
        // Delete user from database (this will cascade delete events and schedules)
        await db.delete(UserTable).where(eq(UserTable.clerkUserId, id))
        console.log('User deleted:', id)
        break

      default:
        console.log(`Unhandled event type: ${eventType}`)
    }

    return new Response('Webhook processed successfully', { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}