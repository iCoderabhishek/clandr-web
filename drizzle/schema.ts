import { DAYS_OF_WEEK_IN_ORDER } from "@/constants";
import { relations } from "drizzle-orm";
import { boolean, index, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";


// Define a reusable `createdAt` timestamp column with default value set to now
const createdAt = timestamp("createdAt").notNull().defaultNow()

// Define a reusable `updatedAt` timestamp column with automatic update on modification
const updatedAt = timestamp("updatedAt")
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date()) // automatically updates to current time on update

// Define the "events" table with fields like name, description, and duration
export const EventTable = pgTable(
    "events", // table name in the database
    {
        id: uuid("id").primaryKey().defaultRandom(),            
      // unique ID with default UUID
      // uuid("id"): Defines a column named "id" with the UUID type.
  
      // .primaryKey(): Makes this UUID the primary key of the table.
  
      // .defaultRandom(): Automatically fills this column with a randomly generated UUID (v4) if no value is provided.
      name: text("name").notNull(), // event name
      description: text("description"), // optional description
      durationInMinutes: integer("durationInMinutes").notNull(), // duration of the event
      clerkUserId: text("clerkUserId").notNull(),// ID of the user who created it (from Clerk)
      isActive: boolean("isActive").notNull().default(true),// whether the event is currently active
      createdAt,// timestamp when event was created
      updatedAt,// timestamp when event was last updated

    },
    table => ([
        index("clerkUserIdIndex").on(table.clerkUserId),// index on clerkUserId for faster querying
      ])
)

export const ScheduleTable = pgTable("schedules", {
    id: uuid("id").primaryKey().defaultRandom(),
    timezone: text("timezone").notNull(),
    clerkUserId: text("clerkUserId").notNull().unique(),
    createdAt,
    updatedAt,
  },
)

// define relationship for the ScheduleTable ; a schedule has many availabilities
export const scheduleRelations = relations(ScheduleTable, ({ many }) => ({
    availabilities: many(ScheduleAvailabilityTable)
}))


export const scheduleOfTheWeekEnum = pgEnum("day", DAYS_OF_WEEK_IN_ORDER)

export const ScheduleAvailabilityTable = pgTable("scheduleAvailabilities", {
    id: uuid("id").primaryKey().defaultRandom(),
    scheduleId: uuid("scheduleId").notNull().references(() => ScheduleTable.id, { onDelete: "cascade" }),
    startTime: text("startTime").notNull(),
    endTime: text("endTime").notNull(),
    dayOfWeek: scheduleOfTheWeekEnum("dayOfWeek").notNull(),
},
    table => ([
    index("ScheduleIdIndex").on(table.scheduleId)
    ])
)

export const ScheduleAvailabilityRelations = relations(ScheduleAvailabilityTable, ({ one }) => ({
    schedule: one(ScheduleTable, {
        fields: [ScheduleAvailabilityTable.scheduleId],
        references: [ScheduleTable.id]
    })
})
)