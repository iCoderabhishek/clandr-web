# Calendr API Backend

Backend API for Calendr React Native mobile application built with Next.js API routes.

## Features

- 🔐 **Authentication** - Clerk integration with webhook sync
- 📅 **Event Management** - CRUD operations for calendar events
- ⏰ **Schedule Management** - User availability and time slots
- 📱 **Meeting Booking** - Public booking system
- 🔗 **Google Calendar** - Integration for calendar events
- 🗄️ **Database** - PostgreSQL with Drizzle ORM
- 🚀 **TypeScript** - Full type safety

## API Endpoints

### Authentication
- `POST /api/auth/webhook` - Clerk user sync webhook

### Events
- `GET /api/events` - Get user's events
- `POST /api/events` - Create new event
- `GET /api/events/[id]` - Get specific event
- `PUT /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Delete event

### Schedule
- `GET /api/schedule` - Get user's schedule
- `POST /api/schedule` - Save user's schedule

### Meetings
- `POST /api/meetings` - Create meeting

### Public Booking
- `GET /api/book/[userId]` - Get user's public events
- `GET /api/book/[userId]/[eventId]` - Get booking availability

### Health Check
- `GET /api/health` - API health status

## Setup

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env.local
# Fill in your environment variables
```

3. **Set up database:**
```bash
npm run db:generate
npm run db:migrate
```

4. **Start development server:**
```bash
npm run dev
```

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Google OAuth
GOOGLE_OAUTH_CLIENT_ID=...
GOOGLE_OAUTH_CLIENT_SECRET=...
GOOGLE_OAUTH_REDIRECT_URL=...
```

## Deployment

Deploy to Vercel:

```bash
vercel --prod
```

## React Native Integration

This API is designed to work with a React Native Expo app using:

- **@clerk/clerk-expo** for authentication
- **@tanstack/react-query** for data fetching
- **fetch** or **axios** for HTTP requests

Example usage in React Native:

```typescript
// API Client
const apiClient = {
  get: async (endpoint: string) => {
    const token = await getToken()
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.json()
  }
}

// React Query Hook
const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: () => apiClient.get('/api/events')
  })
}
```

## Database Schema

- **Users** - Synced from Clerk via webhooks
- **Events** - User's calendar events
- **Schedules** - User availability settings
- **Schedule Availabilities** - Time slots for each day

## Tech Stack

- **Next.js 15** - API routes and server functions
- **TypeScript** - Type safety
- **Clerk** - Authentication and user management
- **Drizzle ORM** - Database ORM
- **PostgreSQL** - Database (Neon)
- **Google APIs** - Calendar integration
- **Zod** - Schema validation
- **date-fns** - Date manipulation

## License

MIT