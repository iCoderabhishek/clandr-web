'use server'

import { db } from '@/drizzle/db'
import { UserTable } from '@/drizzle/schema'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'

// Get or create user in database
export async function getOrCreateUser() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      throw new Error('User not authenticated')
    }

    // Check if user exists in database
    let user = await db.query.UserTable.findFirst({
      where: eq(UserTable.clerkUserId, userId),
    })

    // If user doesn't exist, create them
    if (!user) {
      const client = await clerkClient()
      const clerkUser = await client.users.getUser(userId)
      
      const [newUser] = await db.insert(UserTable).values({
        clerkUserId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        firstName: clerkUser.firstName || null,
        lastName: clerkUser.lastName || null,
        imageUrl: clerkUser.imageUrl || null,
      }).returning()
      
      user = newUser
    }

    return user
  } catch (error: any) {
    console.error('Error getting or creating user:', error)
    throw new Error(`Failed to get or create user: ${error.message}`)
  }
}

// Get user profile
export async function getUserProfile(clerkUserId: string) {
  try {
    const user = await db.query.UserTable.findFirst({
      where: eq(UserTable.clerkUserId, clerkUserId),
    })

    return user
  } catch (error: any) {
    console.error('Error getting user profile:', error)
    throw new Error(`Failed to get user profile: ${error.message}`)
  }
}