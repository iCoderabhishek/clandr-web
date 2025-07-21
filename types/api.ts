// API Response Types for React Native App

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

export interface HealthResponse {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  version: string
  environment: string
  error?: string
}

export interface EventResponse {
  id: string
  name: string
  description: string | null
  durationInMinutes: number
  clerkUserId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ScheduleResponse {
  id: string
  timezone: string
  clerkUserId: string
  createdAt: string
  updatedAt: string
  availabilities: AvailabilityResponse[]
}

export interface AvailabilityResponse {
  id: string
  scheduleId: string
  startTime: string
  endTime: string
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
}

export interface MeetingResponse {
  success: boolean
  calendarEvent?: any
  redirectUrl?: string
  error?: string
}

export interface BookingResponse {
  event: EventResponse
  user: {
    id: string
    fullName: string | null
    firstName: string | null
    lastName: string | null
  }
  validTimes?: string[]
}

export interface PublicEventsResponse {
  user: {
    id: string
    fullName: string | null
    firstName: string | null
    lastName: string | null
  }
  events: EventResponse[]
}

export interface UserProfileResponse {
  id: string
  clerkUserId: string
  email: string
  firstName: string | null
  lastName: string | null
  imageUrl: string | null
  createdAt: string
  updatedAt: string
}