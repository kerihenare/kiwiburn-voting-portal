import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  unique,
} from "drizzle-orm/pg-core"

// Better-Auth managed tables
export const users = pgTable("user", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  name: text("name"),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").unique().notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Application tables
export const memberLists = pgTable("member_lists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const members = pgTable(
  "members",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    memberListId: integer("member_list_id")
      .notNull()
      .references(() => memberLists.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [unique("members_email_list_unique").on(table.email, table.memberListId)]
)

export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  memberListId: integer("member_list_id")
    .notNull()
    .references(() => memberLists.id),
  opensAt: timestamp("opens_at").notNull(),
  closesAt: timestamp("closes_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const votes = pgTable(
  "votes",
  {
    id: serial("id").primaryKey(),
    topicId: integer("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    vote: text("vote").notNull(), // 'yes' or 'no'
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [unique("votes_topic_user_unique").on(table.topicId, table.userId)]
)
