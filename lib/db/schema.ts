import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core"
import { v7 as uuidv7 } from "uuid"

const uuidv7pk = (column = "id") => uuid(column).primaryKey().$defaultFn(uuidv7)

// Better-Auth managed tables
// NOTE: Better Auth's Drizzle adapter looks up tables by export name (user, session, verification)
export const user = pgTable("user", {
  createdAt: timestamp("created_at").notNull().defaultNow(),
  email: text("email").unique().notNull(),
  emailVerified: boolean("email_verified").notNull().default(false),
  id: uuidv7pk(),
  image: text("image"),
  isAdmin: boolean("is_admin").notNull().default(false),
  name: text("name"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const session = pgTable("session", {
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
  id: uuidv7pk(),
  ipAddress: text("ip_address"),
  token: text("token").unique().notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  userAgent: text("user_agent"),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const verification = pgTable("verification", {
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
  id: uuidv7pk(),
  identifier: text("identifier").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
  value: text("value").notNull(),
})

// Application tables
export const memberLists = pgTable("member_lists", {
  createdAt: timestamp("created_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
  deletedBy: text("deleted_by").references(() => user.id),
  description: text("description"),
  id: uuidv7pk(),
  name: text("name").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const members = pgTable(
  "members",
  {
    createdAt: timestamp("created_at").notNull().defaultNow(),
    email: text("email").notNull(),
    id: uuidv7pk(),
    memberListId: uuid("member_list_id")
      .notNull()
      .references(() => memberLists.id, { onDelete: "cascade" }),
  },
  (table) => [
    unique("members_email_list_unique").on(table.email, table.memberListId),
    index("members_email_idx").on(table.email),
    index("members_list_id_idx").on(table.memberListId),
  ],
)

export const topics = pgTable(
  "topics",
  {
    closesAt: timestamp("closes_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
    deletedBy: text("deleted_by").references(() => user.id),
    description: text("description"),
    id: uuidv7pk(),
    isActive: boolean("is_active").notNull().default(false),
    memberListId: uuid("member_list_id")
      .notNull()
      .references(() => memberLists.id),
    opensAt: timestamp("opens_at").notNull(),
    title: text("title").notNull(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("topics_member_list_id_idx").on(table.memberListId)],
)

export const votes = pgTable(
  "votes",
  {
    createdAt: timestamp("created_at").notNull().defaultNow(),
    id: uuidv7pk(),
    topicId: uuid("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id),
    vote: text("vote").notNull(), // 'yes' or 'no'
  },
  (table) => [
    unique("votes_topic_user_unique").on(table.topicId, table.userId),
    index("votes_topic_id_idx").on(table.topicId),
    index("votes_user_id_idx").on(table.userId),
  ],
)
