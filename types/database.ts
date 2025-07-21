// Database Types
import { EventTable, ScheduleTable, ScheduleAvailabilityTable, UserTable } from '@/drizzle/schema'

export type EventRow = typeof EventTable.$inferSelect
export type EventInsert = typeof EventTable.$inferInsert

export type ScheduleRow = typeof ScheduleTable.$inferSelect
export type ScheduleInsert = typeof ScheduleTable.$inferInsert

export type AvailabilityRow = typeof ScheduleAvailabilityTable.$inferSelect
export type AvailabilityInsert = typeof ScheduleAvailabilityTable.$inferInsert

export type UserRow = typeof UserTable.$inferSelect
export type UserInsert = typeof UserTable.$inferInsert

export type FullSchedule = ScheduleRow & {
  availabilities: AvailabilityRow[]
}

export type PublicEvent = Omit<EventRow, "isActive"> & { isActive: true }