import { auth } from '@clerk/nextjs/server'
import { getUserProfile, getOrCreateUser } from '@/server/actions/users'

// GET /api/users/profile - Get current user's profile
export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Get or create user in database
    const user = await getOrCreateUser()

    return Response.json(user)
  } catch (error: any) {
    console.error('Error fetching user profile:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}