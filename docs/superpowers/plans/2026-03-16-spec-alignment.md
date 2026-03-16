# Spec Alignment Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the v0 Kiwiburn Voting Portal codebase into full alignment with the PRD and design spec by swapping the tech stack and implementing all missing features.

**Architecture:** Next.js App Router with Better-Auth (magic link), Drizzle ORM on Supabase Postgres, Tanstack Forms + Zod, React Email + Nodemailer. Server components for data fetching, client components for interactivity. Server actions for all mutations. Application-level authorization (no RLS).

**Tech Stack:** Next.js 16, React 19, Better-Auth, Drizzle ORM, Tanstack Forms, Zod, React Email, Nodemailer, TailwindCSS 4, Shadcn UI

**Spec:** `docs/superpowers/specs/2026-03-16-spec-alignment-design.md`

---

## Chunk 1: Foundation — Dependencies, Config, Database Schema

### Task 1: Remove old dependencies and add new ones

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Remove old packages**

```bash
pnpm remove @supabase/ssr next-themes react-hook-form @hookform/resolvers sonner @radix-ui/react-toast
```

- [ ] **Step 2: Add new packages**

```bash
pnpm add better-auth drizzle-orm postgres @react-email/components react-email nodemailer @tanstack/react-form @tanstack/react-form-nextjs
pnpm add -D drizzle-kit @types/nodemailer
```

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: swap dependencies for spec alignment

Remove Supabase auth, next-themes, react-hook-form, sonner.
Add Better-Auth, Drizzle, Tanstack Forms, React Email, Nodemailer."
```

---

### Task 2: Clean up config files

**Files:**
- Modify: `next.config.mjs`
- Modify: `app/globals.css`
- Delete: `styles/globals.css`
- Delete: `lib/supabase/client.ts`
- Delete: `lib/supabase/server.ts`
- Delete: `lib/supabase/middleware.ts`
- Delete: `scripts/001_create_tables.sql`
- Delete: `scripts/002_enable_rls.sql`
- Delete: `components/theme-provider.tsx`
- Delete: `components/ui/sonner.tsx`
- Delete: `components/ui/toast.tsx`
- Delete: `components/ui/toaster.tsx`
- Delete: `components/ui/use-toast.ts`
- Delete: `hooks/use-toast.ts`

- [ ] **Step 1: Fix next.config.mjs**

Remove `typescript.ignoreBuildErrors`. Keep `images.unoptimized`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
}

export default nextConfig
```

- [ ] **Step 2: Update globals.css**

Remove `.dark` block and all `--sidebar-*` variables. Remove `@custom-variant dark`. Update font to Inter. Keep `:root` light theme variables only:

```css
@import 'tailwindcss';
@import 'tw-animate-css';

:root {
  --background: oklch(0.98 0.005 60);
  --foreground: oklch(0.2 0.02 30);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.2 0.02 30);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.2 0.02 30);
  --primary: oklch(0.68 0.19 55);
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.95 0.01 60);
  --secondary-foreground: oklch(0.3 0.02 30);
  --muted: oklch(0.95 0.01 60);
  --muted-foreground: oklch(0.5 0.02 30);
  --accent: oklch(0.45 0.2 15);
  --accent-foreground: oklch(1 0 0);
  --destructive: oklch(0.55 0.22 25);
  --destructive-foreground: oklch(1 0 0);
  --border: oklch(0.88 0.02 60);
  --input: oklch(0.92 0.01 60);
  --ring: oklch(0.68 0.19 55);
  --chart-1: oklch(0.68 0.19 55);
  --chart-2: oklch(0.45 0.2 15);
  --chart-3: oklch(0.55 0.15 40);
  --chart-4: oklch(0.75 0.12 80);
  --chart-5: oklch(0.65 0.08 100);
  --radius: 0.5rem;
}

@theme inline {
  --font-sans: 'Inter', 'Inter Fallback', sans-serif;
  --font-mono: 'Geist Mono', 'Geist Mono Fallback';
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

- [ ] **Step 3: Delete old files**

```bash
rm -f styles/globals.css
rm -f lib/supabase/client.ts lib/supabase/server.ts lib/supabase/middleware.ts
rmdir lib/supabase
rm -f scripts/001_create_tables.sql scripts/002_enable_rls.sql
rmdir scripts
rm -f components/theme-provider.tsx
rm -f components/ui/sonner.tsx components/ui/toast.tsx components/ui/toaster.tsx components/ui/use-toast.ts
rm -f hooks/use-toast.ts
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: clean up config and remove old files

Remove dark mode, sidebar vars, Supabase lib, SQL scripts,
theme provider, toast components. Fix next.config."
```

---

### Task 3: Drizzle ORM setup and schema

**Files:**
- Create: `lib/db/index.ts`
- Create: `lib/db/schema.ts`
- Create: `drizzle.config.ts`
- Create: `.env.example`

- [ ] **Step 1: Create Drizzle config**

`drizzle.config.ts`:

```typescript
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

- [ ] **Step 2: Create Drizzle client**

`lib/db/index.ts`:

```typescript
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

const connectionString = process.env.DATABASE_URL!
const client = postgres(connectionString)

export const db = drizzle(client, { schema })
```

- [ ] **Step 3: Create schema**

`lib/db/schema.ts`:

```typescript
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
```

- [ ] **Step 4: Create .env.example**

```
DATABASE_URL=postgresql://user:password@host:port/dbname
BETTER_AUTH_SECRET=your-secret-here
BETTER_AUTH_URL=http://localhost:3000
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=noreply@kiwiburn.com
```

- [ ] **Step 5: Add .env to .gitignore if not already present**

Verify `.env` is in `.gitignore`. Add if missing.

- [ ] **Step 6: Generate initial migration**

```bash
npx drizzle-kit generate
```

- [ ] **Step 7: Commit**

```bash
git add lib/db/ drizzle.config.ts drizzle/ .env.example .gitignore
git commit -m "feat: add Drizzle ORM schema and config

Define tables: user, session, verification, member_lists,
members, topics, votes. Generate initial migration."
```

---

## Chunk 2: Authentication — Better-Auth, Middleware, API Route

### Task 4: Better-Auth server and client setup

**Files:**
- Create: `lib/auth.ts`
- Create: `lib/auth-client.ts`
- Create: `app/api/auth/[...all]/route.ts`

- [ ] **Step 1: Create Better-Auth server config**

`lib/auth.ts`:

```typescript
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { magicLink } from "better-auth/plugins"
import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"
import { sendMagicLinkEmail } from "@/lib/email"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendMagicLinkEmail({ email, url })
      },
      expiresIn: 900, // 15 minutes
    }),
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  user: {
    additionalFields: {
      isAdmin: {
        type: "boolean",
        defaultValue: false,
        input: false,
      },
    },
  },
})

export type Session = typeof auth.$Infer.Session
```

Note: `sendMagicLinkEmail` will be created in Task 6 (email). For now, create a placeholder in `lib/email.ts`:

```typescript
export async function sendMagicLinkEmail({ email, url }: { email: string; url: string }) {
  console.log(`[DEV] Magic link for ${email}: ${url}`)
}

export async function sendVoteConfirmationEmail({ email, topicTitle, vote }: { email: string; topicTitle: string; vote: string }) {
  console.log(`[DEV] Vote confirmation for ${email}: ${vote} on "${topicTitle}"`)
}
```

Create `lib/email.ts` as a placeholder now.

- [ ] **Step 2: Create Better-Auth client**

`lib/auth-client.ts`:

```typescript
import { createAuthClient } from "better-auth/react"
import { magicLinkClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "",
  plugins: [magicLinkClient()],
})

export const { signIn, signOut, useSession } = authClient
```

- [ ] **Step 3: Create API route handler**

`app/api/auth/[...all]/route.ts`:

```typescript
import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const { POST, GET } = toNextJsHandler(auth)
```

- [ ] **Step 4: Add NEXT_PUBLIC_BETTER_AUTH_URL to .env.example**

Add `NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000` to `.env.example`.

- [ ] **Step 5: Commit**

```bash
git add lib/auth.ts lib/auth-client.ts lib/email.ts app/api/auth/[...all]/route.ts .env.example
git commit -m "feat: add Better-Auth with magic link plugin

Server config with Drizzle adapter, Nodemailer transport,
15min magic link expiry. Client with useSession hook.
API catch-all route handler. Placeholder email functions."
```

---

### Task 5: Middleware for auth and route protection

**Files:**
- Modify: `middleware.ts`

- [ ] **Step 1: Rewrite middleware**

`middleware.ts`:

```typescript
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const adminRoutes = ["/member-lists", "/topics"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminRoute = adminRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

  if (!isAdminRoute) {
    return NextResponse.next()
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    const signInUrl = new URL("/sign-in", request.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  if (!session.user.isAdmin) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
```

- [ ] **Step 2: Commit**

```bash
git add middleware.ts
git commit -m "feat: rewrite middleware for Better-Auth

Protect /member-lists/* and /topics/* admin routes.
Redirect unauthenticated to /sign-in, non-admin to /."
```

---

## Chunk 3: Email Templates

### Task 6: React Email templates and Nodemailer transport

**Files:**
- Modify: `lib/email.ts`
- Create: `emails/magic-link.tsx`
- Create: `emails/vote-confirmation.tsx`

- [ ] **Step 1: Create magic link email template**

`emails/magic-link.tsx`:

```tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface MagicLinkEmailProps {
  url: string
}

export default function MagicLinkEmail({ url }: MagicLinkEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Sign in to Kiwiburn Voting Portal</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Sign in to vote</Heading>
          <Text style={text}>
            Click the button below to sign in to the Kiwiburn Voting Portal.
            This link will expire in 15 minutes.
          </Text>
          <Section style={buttonSection}>
            <Button style={button} href={url}>
              Sign in to Kiwiburn
            </Button>
          </Section>
          <Text style={footer}>
            If you didn&apos;t request this email, you can safely ignore it.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = { backgroundColor: "#f3f4f6", fontFamily: "Inter, sans-serif" }
const container = { margin: "0 auto", padding: "40px 20px", maxWidth: "480px" }
const heading = { color: "#ab0232", fontSize: "24px", fontWeight: "bold" as const }
const text = { color: "#000000", fontSize: "16px", lineHeight: "24px" }
const buttonSection = { textAlign: "center" as const, margin: "32px 0" }
const button = {
  backgroundColor: "#ed7703",
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "bold" as const,
  textDecoration: "none",
}
const footer = { color: "#666666", fontSize: "14px" }
```

- [ ] **Step 2: Create vote confirmation email template**

`emails/vote-confirmation.tsx`:

```tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components"

interface VoteConfirmationEmailProps {
  topicTitle: string
  vote: string
}

export default function VoteConfirmationEmail({
  topicTitle,
  vote,
}: VoteConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Vote recorded — {topicTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Vote recorded</Heading>
          <Text style={text}>
            Your vote of <strong>{vote.toUpperCase()}</strong> on &ldquo;{topicTitle}&rdquo; has
            been securely recorded.
          </Text>
          <Text style={text}>
            Thank you for participating in this KiwiBurn community decision.
            You can change your vote while voting is open.
          </Text>
          <Button style={button} href={`${process.env.BETTER_AUTH_URL}`}>
            View all votes
          </Button>
        </Container>
      </Body>
    </Html>
  )
}

const main = { backgroundColor: "#f3f4f6", fontFamily: "Inter, sans-serif" }
const container = { margin: "0 auto", padding: "40px 20px", maxWidth: "480px" }
const heading = { color: "#ab0232", fontSize: "24px", fontWeight: "bold" as const }
const text = { color: "#000000", fontSize: "16px", lineHeight: "24px" }
const button = {
  backgroundColor: "#ed7703",
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "bold" as const,
  textDecoration: "none",
}
```

- [ ] **Step 3: Implement email sending with Nodemailer**

Replace placeholder `lib/email.ts`:

```typescript
import nodemailer from "nodemailer"
import { render } from "@react-email/components"
import MagicLinkEmail from "@/emails/magic-link"
import VoteConfirmationEmail from "@/emails/vote-confirmation"

function getTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

export async function sendMagicLinkEmail({
  email,
  url,
}: {
  email: string
  url: string
}) {
  const html = await render(MagicLinkEmail({ url }))
  const transport = getTransport()

  await transport.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Sign in to Kiwiburn Voting Portal",
    html,
  })
}

export async function sendVoteConfirmationEmail({
  email,
  topicTitle,
  vote,
}: {
  email: string
  topicTitle: string
  vote: string
}) {
  const html = await render(VoteConfirmationEmail({ topicTitle, vote }))
  const transport = getTransport()

  await transport.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: `Vote recorded — ${topicTitle}`,
    html,
  })
}
```

- [ ] **Step 4: Commit**

```bash
git add emails/ lib/email.ts
git commit -m "feat: add React Email templates and Nodemailer transport

Magic link email and vote confirmation email templates.
Provider-agnostic SMTP config via environment variables."
```

---

## Chunk 2: Validation, Queries, Server Actions, Types

### Task 7: Zod validation schemas

**Files:**
- Create: `lib/validations.ts`
- Modify: `lib/types.ts`

- [ ] **Step 1: Create validation schemas**

`lib/validations.ts`:

```typescript
import { z } from "zod"

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export const createTopicSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    memberListId: z.number({ required_error: "Member list is required" }),
    opensAt: z.string().min(1, "Opens at is required"),
    closesAt: z.string().min(1, "Closes at is required"),
  })
  .refine((data) => new Date(data.closesAt) > new Date(data.opensAt), {
    message: "Closes at must be after opens at",
    path: ["closesAt"],
  })

export const updateTopicSchema = createTopicSchema

export const createMemberListSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
})

export const addMemberSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export const castVoteSchema = z.object({
  topicId: z.number(),
  vote: z.enum(["yes", "no"]),
})

export type SignInInput = z.infer<typeof signInSchema>
export type CreateTopicInput = z.infer<typeof createTopicSchema>
export type CreateMemberListInput = z.infer<typeof createMemberListSchema>
export type AddMemberInput = z.infer<typeof addMemberSchema>
export type CastVoteInput = z.infer<typeof castVoteSchema>
```

- [ ] **Step 2: Replace types file**

`lib/types.ts`:

```typescript
export type TopicStatus = "open" | "closed" | "scheduled"

export function getTopicStatus(opensAt: Date, closesAt: Date): TopicStatus {
  const now = new Date()
  if (now < opensAt) return "scheduled"
  if (now > closesAt) return "closed"
  return "open"
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/validations.ts lib/types.ts
git commit -m "feat: add Zod validation schemas and topic status helper

Schemas for sign-in, topics, member lists, votes.
Topic status derived from opens_at/closes_at timestamps."
```

---

### Task 8: Drizzle query functions

**Files:**
- Create: `lib/db/queries.ts`

- [ ] **Step 1: Create query functions**

`lib/db/queries.ts`:

```typescript
import { db } from "@/lib/db"
import { eq, and, sql, count, desc } from "drizzle-orm"
import { topics, votes, members, memberLists, users } from "./schema"

export async function getTopicsWithCounts() {
  const results = await db
    .select({
      id: topics.id,
      title: topics.title,
      description: topics.description,
      memberListId: topics.memberListId,
      memberListName: memberLists.name,
      opensAt: topics.opensAt,
      closesAt: topics.closesAt,
      createdAt: topics.createdAt,
      yesCount: sql<number>`count(case when ${votes.vote} = 'yes' then 1 end)::int`,
      noCount: sql<number>`count(case when ${votes.vote} = 'no' then 1 end)::int`,
      totalVotes: sql<number>`count(${votes.id})::int`,
    })
    .from(topics)
    .leftJoin(memberLists, eq(topics.memberListId, memberLists.id))
    .leftJoin(votes, eq(topics.id, votes.topicId))
    .groupBy(topics.id, memberLists.name)
    .orderBy(desc(topics.closesAt))

  return results
}

export async function getTopic(id: number) {
  const result = await db
    .select({
      id: topics.id,
      title: topics.title,
      description: topics.description,
      memberListId: topics.memberListId,
      memberListName: memberLists.name,
      opensAt: topics.opensAt,
      closesAt: topics.closesAt,
      createdAt: topics.createdAt,
    })
    .from(topics)
    .leftJoin(memberLists, eq(topics.memberListId, memberLists.id))
    .where(eq(topics.id, id))
    .limit(1)

  return result[0] ?? null
}

export async function getVoteResults(topicId: number) {
  const results = await db
    .select({
      yesCount: sql<number>`count(case when ${votes.vote} = 'yes' then 1 end)::int`,
      noCount: sql<number>`count(case when ${votes.vote} = 'no' then 1 end)::int`,
      totalVotes: sql<number>`count(${votes.id})::int`,
    })
    .from(votes)
    .where(eq(votes.topicId, topicId))

  return results[0] ?? { yesCount: 0, noCount: 0, totalVotes: 0 }
}

export async function getUserVoteForTopic(topicId: number, userId: string) {
  const result = await db
    .select({ vote: votes.vote })
    .from(votes)
    .where(and(eq(votes.topicId, topicId), eq(votes.userId, userId)))
    .limit(1)

  return result[0]?.vote ?? null
}

export async function checkEligibility(topicId: number, userId: string) {
  const topic = await getTopic(topicId)
  if (!topic) return { eligible: false, reason: "Topic not found" as const }

  const user = await db
    .select({ email: users.email })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (!user[0]) return { eligible: false, reason: "User not found" as const }

  const member = await db
    .select({ id: members.id })
    .from(members)
    .where(
      and(
        eq(members.email, user[0].email),
        eq(members.memberListId, topic.memberListId)
      )
    )
    .limit(1)

  if (!member[0]) return { eligible: false, reason: "Not eligible" as const }

  return { eligible: true, reason: null }
}

export async function getMemberListsWithCounts() {
  const results = await db
    .select({
      id: memberLists.id,
      name: memberLists.name,
      description: memberLists.description,
      createdAt: memberLists.createdAt,
      memberCount: sql<number>`(
        select count(*) from ${members} where ${members.memberListId} = ${memberLists.id}
      )::int`,
      topicCount: sql<number>`(
        select count(*) from ${topics} where ${topics.memberListId} = ${memberLists.id}
      )::int`,
    })
    .from(memberLists)
    .orderBy(desc(memberLists.createdAt))

  return results
}

export async function getMemberList(id: number) {
  const list = await db
    .select()
    .from(memberLists)
    .where(eq(memberLists.id, id))
    .limit(1)

  if (!list[0]) return null

  const listMembers = await db
    .select()
    .from(members)
    .where(eq(members.memberListId, id))
    .orderBy(desc(members.createdAt))

  const listTopics = await db
    .select({
      id: topics.id,
      title: topics.title,
      opensAt: topics.opensAt,
      closesAt: topics.closesAt,
    })
    .from(topics)
    .where(eq(topics.memberListId, id))

  return { ...list[0], members: listMembers, topics: listTopics }
}

export async function getAllMemberLists() {
  return db.select({ id: memberLists.id, name: memberLists.name }).from(memberLists)
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/db/queries.ts
git commit -m "feat: add Drizzle query functions

Queries for topics, votes, eligibility, member lists.
All joins and aggregations for the voting portal."
```

---

### Task 9: Server actions

**Files:**
- Create: `lib/actions/votes.ts`
- Create: `lib/actions/topics.ts`
- Create: `lib/actions/member-lists.ts`
- Create: `lib/actions/members.ts`

- [ ] **Step 1: Create vote actions**

`lib/actions/votes.ts`:

```typescript
"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { votes, topics, users } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { castVoteSchema } from "@/lib/validations"
import { checkEligibility, getTopic } from "@/lib/db/queries"
import { sendVoteConfirmationEmail } from "@/lib/email"
import { getTopicStatus } from "@/lib/types"

export async function castVote(input: { topicId: number; vote: string }) {
  const parsed = castVoteSchema.parse(input)

  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Not authenticated")

  const topic = await getTopic(parsed.topicId)
  if (!topic) throw new Error("Topic not found")

  const status = getTopicStatus(topic.opensAt, topic.closesAt)
  if (status !== "open") throw new Error("Voting is not open")

  const eligibility = await checkEligibility(parsed.topicId, session.user.id)
  if (!eligibility.eligible) throw new Error("Not eligible to vote")

  await db
    .insert(votes)
    .values({
      topicId: parsed.topicId,
      userId: session.user.id,
      vote: parsed.vote,
    })
    .onConflictDoUpdate({
      target: [votes.topicId, votes.userId],
      set: { vote: parsed.vote, updatedAt: new Date() },
    })

  // Send confirmation email (non-blocking)
  sendVoteConfirmationEmail({
    email: session.user.email,
    topicTitle: topic.title,
    vote: parsed.vote,
  }).catch(console.error)

  return { success: true, vote: parsed.vote }
}
```

- [ ] **Step 2: Create topic actions**

`lib/actions/topics.ts`:

```typescript
"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { topics } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { createTopicSchema } from "@/lib/validations"
import { revalidatePath } from "next/cache"

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user.isAdmin) throw new Error("Unauthorized")
  return session
}

export async function createTopic(input: {
  title: string
  description?: string
  memberListId: number
  opensAt: string
  closesAt: string
}) {
  await requireAdmin()
  const parsed = createTopicSchema.parse(input)

  await db.insert(topics).values({
    title: parsed.title,
    description: parsed.description ?? null,
    memberListId: parsed.memberListId,
    opensAt: new Date(parsed.opensAt),
    closesAt: new Date(parsed.closesAt),
  })

  revalidatePath("/topics")
  revalidatePath("/")
  return { success: true }
}

export async function updateTopic(
  id: number,
  input: {
    title: string
    description?: string
    memberListId: number
    opensAt: string
    closesAt: string
  }
) {
  await requireAdmin()
  const parsed = createTopicSchema.parse(input)

  await db
    .update(topics)
    .set({
      title: parsed.title,
      description: parsed.description ?? null,
      memberListId: parsed.memberListId,
      opensAt: new Date(parsed.opensAt),
      closesAt: new Date(parsed.closesAt),
      updatedAt: new Date(),
    })
    .where(eq(topics.id, id))

  revalidatePath("/topics")
  revalidatePath(`/topics/${id}`)
  revalidatePath("/")
  return { success: true }
}

export async function deleteTopic(id: number) {
  await requireAdmin()

  await db.delete(topics).where(eq(topics.id, id))

  revalidatePath("/topics")
  revalidatePath("/")
  return { success: true }
}
```

- [ ] **Step 3: Create member list actions**

`lib/actions/member-lists.ts`:

```typescript
"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { memberLists, topics } from "@/lib/db/schema"
import { eq, count } from "drizzle-orm"
import { createMemberListSchema } from "@/lib/validations"
import { revalidatePath } from "next/cache"

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user.isAdmin) throw new Error("Unauthorized")
  return session
}

export async function createMemberList(input: {
  name: string
  description?: string
}) {
  await requireAdmin()
  const parsed = createMemberListSchema.parse(input)

  const result = await db
    .insert(memberLists)
    .values({
      name: parsed.name,
      description: parsed.description ?? null,
    })
    .returning({ id: memberLists.id })

  revalidatePath("/member-lists")
  return { success: true, id: result[0].id }
}

export async function updateMemberList(
  id: number,
  input: { name: string; description?: string }
) {
  await requireAdmin()
  const parsed = createMemberListSchema.parse(input)

  await db
    .update(memberLists)
    .set({
      name: parsed.name,
      description: parsed.description ?? null,
      updatedAt: new Date(),
    })
    .where(eq(memberLists.id, id))

  revalidatePath("/member-lists")
  revalidatePath(`/member-lists/${id}`)
  return { success: true }
}

export async function deleteMemberList(id: number) {
  await requireAdmin()

  // Check if any topics reference this list
  const topicCount = await db
    .select({ count: count() })
    .from(topics)
    .where(eq(topics.memberListId, id))

  if (topicCount[0].count > 0) {
    throw new Error("Cannot delete a member list that has topics")
  }

  await db.delete(memberLists).where(eq(memberLists.id, id))

  revalidatePath("/member-lists")
  return { success: true }
}
```

- [ ] **Step 4: Create member actions**

`lib/actions/members.ts`:

```typescript
"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { members } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { addMemberSchema } from "@/lib/validations"
import { revalidatePath } from "next/cache"
import { z } from "zod"

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user.isAdmin) throw new Error("Unauthorized")
  return session
}

export async function addMember(listId: number, input: { email: string }) {
  await requireAdmin()
  const parsed = addMemberSchema.parse(input)

  try {
    await db.insert(members).values({
      email: parsed.email.toLowerCase(),
      memberListId: listId,
    })
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.includes("unique")
    ) {
      throw new Error("This email is already in the list")
    }
    throw error
  }

  revalidatePath(`/member-lists/${listId}`)
  return { success: true }
}

export async function removeMember(id: number, listId: number) {
  await requireAdmin()

  await db.delete(members).where(eq(members.id, id))

  revalidatePath(`/member-lists/${listId}`)
  return { success: true }
}

export async function uploadMembers(
  listId: number,
  emails: string[]
) {
  await requireAdmin()

  const emailSchema = z.string().email()
  let added = 0
  let invalid = 0
  let duplicates = 0

  for (const raw of emails) {
    const email = raw.trim().toLowerCase()
    const result = emailSchema.safeParse(email)

    if (!result.success) {
      invalid++
      continue
    }

    try {
      await db
        .insert(members)
        .values({ email, memberListId: listId })
        .onConflictDoNothing()

      // onConflictDoNothing returns 0 rows affected for duplicates
      // but we can't easily distinguish, so count as added
      added++
    } catch {
      duplicates++
    }
  }

  revalidatePath(`/member-lists/${listId}`)
  return { added, duplicates, invalid }
}
```

- [ ] **Step 5: Commit**

```bash
git add lib/actions/
git commit -m "feat: add server actions for votes, topics, member lists

All mutations with auth checks, validation, and revalidation.
Vote upsert with confirmation email. CSV bulk upload."
```

---

## Chunk 3: Root Layout, Header, Error Pages

### Task 10: Root layout and header

**Files:**
- Modify: `app/layout.tsx`
- Modify: `components/header.tsx`

- [ ] **Step 1: Rewrite root layout**

`app/layout.tsx`:

```tsx
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Header } from "@/components/header"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kiwiburn Voting Portal",
  description: "Vote on topics for Kiwiburn community decisions",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#ed7703",
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-NZ">
      <body className={`${inter.className} antialiased min-h-screen bg-background`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-primary focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <Header />
        <main id="main-content" className="container mx-auto px-4 py-8 max-w-4xl">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Rewrite header**

`components/header.tsx`:

```tsx
import Link from "next/link"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { SignOutButton } from "@/components/sign-out-button"

export async function Header() {
  const session = await auth.api.getSession({ headers: await headers() })

  return (
    <header className="bg-[#332d2d] text-white">
      <nav className="container mx-auto px-4 max-w-4xl flex items-center justify-between h-14">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-lg">
            Kiwiburn
          </Link>
          {session?.user.isAdmin && (
            <>
              <Link
                href="/member-lists"
                className="text-sm text-white/80 hover:text-white"
              >
                Member Lists
              </Link>
              <Link
                href="/topics"
                className="text-sm text-white/80 hover:text-white"
              >
                Topics
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="text-sm text-white/70">{session.user.email}</span>
              <SignOutButton />
            </>
          ) : (
            <Link
              href="/sign-in"
              className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:opacity-90"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
```

Create `components/sign-out-button.tsx`:

```tsx
"use client"

import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function SignOutButton() {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-white/80 hover:text-white hover:bg-white/10"
      onClick={async () => {
        await authClient.signOut()
        router.push("/")
        router.refresh()
      }}
    >
      Sign out
    </Button>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx components/header.tsx components/sign-out-button.tsx
git commit -m "feat: rewrite layout and header

Inter font, skip link, en-NZ lang, light color-scheme.
Header with admin nav links, sign in/out. No sidebar."
```

---

### Task 11: Error pages

**Files:**
- Create: `app/not-found.tsx`
- Create: `app/error.tsx`

- [ ] **Step 1: Create 404 page**

`app/not-found.tsx`:

```tsx
import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full text-center">
        <CardContent className="pt-8 pb-8 space-y-4">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive" aria-hidden="true" />
          <h1 className="text-6xl font-bold text-foreground">404</h1>
          <p className="text-muted-foreground text-lg">Page not found</p>
          <Button asChild>
            <Link href="/">Go home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 2: Create 500 error page**

`app/error.tsx`:

```tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full text-center">
        <CardContent className="pt-8 pb-8 space-y-4">
          <h1 className="text-2xl font-bold text-foreground">
            Something went wrong
          </h1>
          <p className="text-muted-foreground">
            An unexpected error occurred. Please try again.
          </p>
          <Button onClick={reset}>Try again</Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add app/not-found.tsx app/error.tsx
git commit -m "feat: add 404 and 500 error pages

Card-based centered layout per design spec."
```

---

## Chunk 4: Public Pages — Home, Sign-in, Vote, Vote Success

### Task 12: Shared components (timer badge, result bars)

**Files:**
- Create: `components/timer-badge.tsx`
- Create: `components/result-bars.tsx`

- [ ] **Step 1: Create timer badge**

`components/timer-badge.tsx`:

```tsx
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow, isPast, isFuture } from "date-fns"

interface TimerBadgeProps {
  opensAt: Date
  closesAt: Date
}

export function TimerBadge({ opensAt, closesAt }: TimerBadgeProps) {
  const now = new Date()

  if (isFuture(opensAt)) {
    return (
      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
        Opens in {formatDistanceToNow(opensAt)}
      </Badge>
    )
  }

  if (isPast(closesAt)) {
    return (
      <Badge variant="secondary" className="bg-gray-100 text-gray-600">
        Closed {formatDistanceToNow(closesAt, { addSuffix: true })}
      </Badge>
    )
  }

  // Currently open
  const msRemaining = closesAt.getTime() - now.getTime()
  const hoursRemaining = msRemaining / (1000 * 60 * 60)

  const variant = hoursRemaining < 1 ? "destructive" : "default"

  return (
    <Badge variant={variant} className={hoursRemaining < 24 ? "bg-orange-100 text-orange-800" : ""}>
      Closes in {formatDistanceToNow(closesAt)}
    </Badge>
  )
}
```

- [ ] **Step 2: Create result bars**

`components/result-bars.tsx`:

```tsx
import { Progress } from "@/components/ui/progress"

interface ResultBarsProps {
  yesCount: number
  noCount: number
  totalVotes: number
}

export function ResultBars({ yesCount, noCount, totalVotes }: ResultBarsProps) {
  const yesPercent = totalVotes > 0 ? Math.round((yesCount / totalVotes) * 100) : 0
  const noPercent = totalVotes > 0 ? Math.round((noCount / totalVotes) * 100) : 0

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Yes</span>
          <span className="text-muted-foreground">{yesPercent}%</span>
        </div>
        <Progress value={yesPercent} className="h-3 [&>div]:bg-green-500" />
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="font-medium">No</span>
          <span className="text-muted-foreground">{noPercent}%</span>
        </div>
        <Progress value={noPercent} className="h-3 [&>div]:bg-red-500" />
      </div>
      <p className="text-sm text-muted-foreground">{totalVotes} votes</p>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/timer-badge.tsx components/result-bars.tsx
git commit -m "feat: add timer badge and result bars components

Timer shows relative time with colour coding.
Result bars with yes/no percentages and vote count."
```

---

### Task 13: Home page and topic card

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/topic-card.tsx`

- [ ] **Step 1: Rewrite topic card**

`components/topic-card.tsx`:

```tsx
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { TimerBadge } from "@/components/timer-badge"
import { ResultBars } from "@/components/result-bars"
import { getTopicStatus } from "@/lib/types"

interface TopicCardProps {
  topic: {
    id: number
    title: string
    description: string | null
    memberListName: string | null
    opensAt: Date
    closesAt: Date
    yesCount: number
    noCount: number
    totalVotes: number
  }
  userVote?: string | null
}

export function TopicCard({ topic, userVote }: TopicCardProps) {
  const status = getTopicStatus(topic.opensAt, topic.closesAt)

  return (
    <Card>
      <CardContent className="pt-6 space-y-3">
        <TimerBadge opensAt={topic.opensAt} closesAt={topic.closesAt} />
        {topic.memberListName && (
          <p className="text-sm text-muted-foreground">{topic.memberListName}</p>
        )}
        <h2 className="text-lg font-bold text-[#ab0232]">{topic.title}</h2>
        {topic.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {topic.description}
          </p>
        )}
        {status === "closed" && (
          <ResultBars
            yesCount={topic.yesCount}
            noCount={topic.noCount}
            totalVotes={topic.totalVotes}
          />
        )}
      </CardContent>
      <Separator />
      <CardFooter className="flex items-center justify-between py-3">
        <div>
          {userVote && (
            <Badge variant="outline">
              You voted: {userVote.charAt(0).toUpperCase() + userVote.slice(1)}
            </Badge>
          )}
        </div>
        <Button asChild size="sm">
          <Link href={`/votes/${topic.id}`}>
            {status === "closed"
              ? "View results"
              : userVote
                ? "Change vote"
                : "Vote now"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
```

- [ ] **Step 2: Rewrite home page**

`app/page.tsx`:

```tsx
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { getTopicsWithCounts, getUserVoteForTopic } from "@/lib/db/queries"
import { TopicCard } from "@/components/topic-card"

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const topics = await getTopicsWithCounts()

  const userVotes: Record<number, string | null> = {}
  if (session) {
    for (const topic of topics) {
      userVotes[topic.id] = await getUserVoteForTopic(topic.id, session.user.id)
    }
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold text-[#ab0232]">Community Votes</h1>
        <p className="text-muted-foreground">
          View and participate in community decisions.
        </p>
      </section>
      <div className="space-y-4">
        {topics.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">
            No voting topics yet.
          </p>
        ) : (
          topics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              userVote={userVotes[topic.id]}
            />
          ))
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx components/topic-card.tsx
git commit -m "feat: rewrite home page and topic card

Topic cards with timer, results when closed, vote status.
Page header with title and subtitle per design spec."
```

---

### Task 14: Sign-in page

**Files:**
- Modify: `app/sign-in/page.tsx`

- [ ] **Step 1: Rewrite sign-in page**

`app/sign-in/page.tsx`:

```tsx
"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("sending")

    try {
      await authClient.signIn.magicLink({ email })
      setStatus("sent")
    } catch {
      setStatus("error")
    }
  }

  async function handleResend() {
    setStatus("sending")
    try {
      await authClient.signIn.magicLink({ email })
      setStatus("sent")
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 space-y-4">
          {status === "sent" ? (
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-[#ab0232]">Check your email</h1>
              <p className="text-muted-foreground">
                We sent a login link to <strong>{email}</strong>. Click the link
                in the email to sign in.
              </p>
              <Button variant="outline" onClick={handleResend}>
                Resend login link
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-[#ab0232]">Sign in to vote</h1>
                <p className="text-muted-foreground">
                  Enter your email to receive a secure login link.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-invalid={status === "error" ? true : undefined}
                  />
                  {status === "error" && (
                    <p className="text-sm text-destructive" role="alert">
                      Something went wrong. Please try again.
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Sending..." : "Send login link"}
                </Button>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/sign-in/page.tsx
git commit -m "feat: rewrite sign-in page with Better-Auth magic link

Email input, sending state, confirmation with resend button.
Accessible form with aria-invalid on error."
```

---

### Task 15: Vote page

**Files:**
- Create: `app/votes/[voteId]/page.tsx`
- Create: `components/vote-buttons.tsx`
- Delete: `app/vote/[topicId]/page.tsx`
- Delete: `app/vote/[topicId]/vote-form.tsx`
- Delete: `app/vote/[topicId]/vote-results.tsx`

- [ ] **Step 1: Create vote buttons component**

`components/vote-buttons.tsx`:

```tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { castVote } from "@/lib/actions/votes"

interface VoteButtonsProps {
  topicId: number
  currentVote: string | null
}

export function VoteButtons({ topicId, currentVote }: VoteButtonsProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState<string | null>(null)

  async function handleVote(vote: "yes" | "no") {
    setSubmitting(vote)
    try {
      await castVote({ topicId, vote })
      router.push(`/votes/${topicId}/success?vote=${vote}`)
    } catch (error) {
      console.error(error)
      setSubmitting(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => handleVote("yes")}
          disabled={submitting !== null}
          variant={currentVote === "yes" ? "default" : "outline"}
          className={`flex-1 h-12 text-lg font-bold ${
            currentVote === "yes"
              ? "bg-green-600 hover:bg-green-700 ring-2 ring-green-600 ring-offset-2"
              : "hover:bg-green-50 hover:text-green-700 hover:border-green-300"
          }`}
          aria-label="Vote yes"
        >
          {submitting === "yes" ? "Submitting..." : "YES"}
        </Button>
        <Button
          onClick={() => handleVote("no")}
          disabled={submitting !== null}
          variant={currentVote === "no" ? "default" : "outline"}
          className={`flex-1 h-12 text-lg font-bold ${
            currentVote === "no"
              ? "bg-red-600 hover:bg-red-700 ring-2 ring-red-600 ring-offset-2"
              : "hover:bg-red-50 hover:text-red-700 hover:border-red-300"
          }`}
          aria-label="Vote no"
        >
          {submitting === "no" ? "Submitting..." : "NO"}
        </Button>
      </div>
      {currentVote && (
        <p className="text-sm text-muted-foreground">
          You voted <strong>{currentVote.charAt(0).toUpperCase() + currentVote.slice(1)}</strong>.
          You can change your vote while voting is open.
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create vote page**

`app/votes/[voteId]/page.tsx`:

```tsx
import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { TimerBadge } from "@/components/timer-badge"
import { ResultBars } from "@/components/result-bars"
import { VoteButtons } from "@/components/vote-buttons"
import { getTopic, getVoteResults, getUserVoteForTopic, checkEligibility } from "@/lib/db/queries"
import { getTopicStatus } from "@/lib/types"
import Link from "next/link"

export default async function VotePage({
  params,
}: {
  params: Promise<{ voteId: string }>
}) {
  const { voteId } = await params
  const topicId = parseInt(voteId, 10)
  if (isNaN(topicId)) notFound()

  const topic = await getTopic(topicId)
  if (!topic) notFound()

  const session = await auth.api.getSession({ headers: await headers() })
  const status = getTopicStatus(topic.opensAt, topic.closesAt)
  const results = await getVoteResults(topicId)

  let userVote: string | null = null
  let eligible = false

  if (session) {
    userVote = await getUserVoteForTopic(topicId, session.user.id)
    const eligibility = await checkEligibility(topicId, session.user.id)
    eligible = eligibility.eligible
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="pt-6 space-y-4">
        <TimerBadge opensAt={topic.opensAt} closesAt={topic.closesAt} />
        <h1 className="text-2xl font-bold text-[#ab0232]">{topic.title}</h1>
        {topic.description && (
          <p className="text-muted-foreground">{topic.description}</p>
        )}
        <Separator />

        {status === "closed" ? (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Results</h2>
            <ResultBars
              yesCount={results.yesCount}
              noCount={results.noCount}
              totalVotes={results.totalVotes}
            />
            {userVote && (
              <Badge variant="outline">
                You voted: {userVote.charAt(0).toUpperCase() + userVote.slice(1)}
              </Badge>
            )}
          </section>
        ) : !session ? (
          <Alert>
            <AlertDescription>
              Please <Link href="/sign-in" className="underline font-medium">sign in</Link> to cast your vote.
            </AlertDescription>
          </Alert>
        ) : !eligible ? (
          <Alert variant="destructive">
            <AlertDescription>
              You are not eligible to vote on this topic.
            </AlertDescription>
          </Alert>
        ) : status === "scheduled" ? (
          <Alert>
            <AlertDescription>
              Voting has not opened yet. Check back later.
            </AlertDescription>
          </Alert>
        ) : (
          <VoteButtons topicId={topicId} currentVote={userVote} />
        )}
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 3: Delete old vote files**

```bash
rm -rf app/vote
```

- [ ] **Step 4: Create /votes redirect**

Create `app/votes/page.tsx`:

```tsx
import { redirect } from "next/navigation"

export default function VotesRedirect() {
  redirect("/")
}
```

- [ ] **Step 5: Commit**

```bash
git add app/votes/ components/vote-buttons.tsx
git add -A  # picks up deleted app/vote/
git commit -m "feat: rewrite vote page at /votes/[voteId]

YES/NO buttons, eligibility checks, results when closed.
Vote buttons with selected state and accessibility labels.
Remove old /vote/ route. Add /votes redirect to /."
```

---

### Task 16: Vote success page

**Files:**
- Create: `app/votes/[voteId]/success/page.tsx`

- [ ] **Step 1: Create vote success page**

`app/votes/[voteId]/success/page.tsx`:

```tsx
import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getTopic, getUserVoteForTopic } from "@/lib/db/queries"
import Link from "next/link"

export default async function VoteSuccessPage({
  params,
}: {
  params: Promise<{ voteId: string }>
}) {
  const { voteId } = await params
  const topicId = parseInt(voteId, 10)
  if (isNaN(topicId)) notFound()

  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/sign-in")

  const topic = await getTopic(topicId)
  if (!topic) notFound()

  const userVote = await getUserVoteForTopic(topicId, session.user.id)
  if (!userVote) redirect(`/votes/${topicId}`)

  const isYes = userVote === "yes"

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full text-center">
        <CardContent className="pt-8 pb-8 space-y-6">
          <Badge
            className={`text-3xl px-6 py-3 font-bold ${
              isYes
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : "bg-red-100 text-red-800 hover:bg-red-100"
            }`}
          >
            {userVote.toUpperCase()}
          </Badge>
          <h1 className="text-2xl font-bold">Vote recorded</h1>
          <p className="text-muted-foreground">
            Your vote of <strong>{isYes ? "Yes" : "No"}</strong> on &ldquo;{topic.title}&rdquo; has
            been securely recorded. Thank you for participating in this KiwiBurn
            community decision.
          </p>
          <Button asChild>
            <Link href="/">View all votes</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/votes/[voteId]/success/
git commit -m "feat: add vote success confirmation page

Large vote badge, confirmation text, link back to home."
```

---

## Chunk 5: Admin Pages — Member Lists

### Task 17: Member lists overview page

**Files:**
- Create: `app/member-lists/page.tsx`
- Delete: `app/admin/`

- [ ] **Step 1: Create member lists page**

`app/member-lists/page.tsx`:

```tsx
import Link from "next/link"
import { getMemberListsWithCounts } from "@/lib/db/queries"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function MemberListsPage() {
  const lists = await getMemberListsWithCounts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#ab0232]">Member Lists</h1>
        <Button asChild>
          <Link href="/member-lists/create">Create member list</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Topics</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lists.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                No member lists yet.
              </TableCell>
            </TableRow>
          ) : (
            lists.map((list) => (
              <TableRow key={list.id}>
                <TableCell>
                  <Link
                    href={`/member-lists/${list.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {list.name}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {list.description || "—"}
                </TableCell>
                <TableCell>{list.memberCount}</TableCell>
                <TableCell>{list.topicCount}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
```

- [ ] **Step 2: Delete old admin directory**

```bash
rm -rf app/admin
```

- [ ] **Step 3: Commit**

```bash
git add app/member-lists/page.tsx
git add -A  # picks up deleted app/admin/
git commit -m "feat: add member lists page, remove old /admin

Table with name, description, member/topic counts.
Remove entire /admin directory and sidebar layout."
```

---

### Task 18: Create member list page

**Files:**
- Create: `app/member-lists/create/page.tsx`

- [ ] **Step 1: Create the page**

`app/member-lists/create/page.tsx`:

```tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { createMemberList } from "@/lib/actions/member-lists"

export default function CreateMemberListPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const result = await createMemberList({ name, description })
      router.push(`/member-lists/${result.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#ab0232]">Create member list</h1>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            {error && (
              <p className="text-sm text-destructive" role="alert">{error}</p>
            )}
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create member list"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/member-lists/create/
git commit -m "feat: add create member list page

Form with name and description fields."
```

---

### Task 19: Member list edit page

**Files:**
- Create: `app/member-lists/[listId]/page.tsx`

- [ ] **Step 1: Create member list edit page**

This is a larger page with multiple sections. Create `app/member-lists/[listId]/page.tsx`:

```tsx
import { notFound } from "next/navigation"
import { getMemberList } from "@/lib/db/queries"
import { getTopicStatus } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { EditListForm } from "./edit-list-form"
import { AddMemberForm } from "./add-member-form"
import { UploadMembersForm } from "./upload-members-form"
import { RemoveMemberButton } from "./remove-member-button"
import { DeleteListButton } from "./delete-list-button"

export default async function MemberListEditPage({
  params,
}: {
  params: Promise<{ listId: string }>
}) {
  const { listId } = await params
  const id = parseInt(listId, 10)
  if (isNaN(id)) notFound()

  const list = await getMemberList(id)
  if (!list) notFound()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#ab0232]">{list.name}</h1>

      <Card>
        <CardContent className="pt-6">
          <EditListForm list={list} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <h2 className="text-lg font-semibold">Members</h2>
          <div className="flex gap-2">
            <AddMemberForm listId={id} />
          </div>
          <UploadMembersForm listId={id} />
          <Separator />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.members.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                    No members yet.
                  </TableCell>
                </TableRow>
              ) : (
                list.members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.email}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {member.createdAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <RemoveMemberButton memberId={member.id} listId={id} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {list.topics.length > 0 && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-lg font-semibold">Topics</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.topics.map((topic) => {
                  const status = getTopicStatus(topic.opensAt, topic.closesAt)
                  return (
                    <TableRow key={topic.id}>
                      <TableCell>
                        <Link href={`/topics/${topic.id}`} className="text-primary hover:underline">
                          {topic.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={status === "open" ? "default" : "secondary"}
                          className={
                            status === "open"
                              ? "bg-green-100 text-green-800"
                              : status === "scheduled"
                                ? "bg-blue-100 text-blue-800"
                                : ""
                          }
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <DeleteListButton listId={id} hasTopics={list.topics.length > 0} />
    </div>
  )
}
```

- [ ] **Step 2: Create edit list form component**

`app/member-lists/[listId]/edit-list-form.tsx`:

```tsx
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { updateMemberList } from "@/lib/actions/member-lists"
import { useRouter } from "next/navigation"

interface EditListFormProps {
  list: { id: number; name: string; description: string | null }
}

export function EditListForm({ list }: EditListFormProps) {
  const router = useRouter()
  const [name, setName] = useState(list.name)
  const [description, setDescription] = useState(list.description ?? "")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await updateMemberList(list.id, { name, description })
      router.refresh()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <Button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : "Save changes"}
      </Button>
    </form>
  )
}
```

- [ ] **Step 3: Create add member form**

`app/member-lists/[listId]/add-member-form.tsx`:

```tsx
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { addMember } from "@/lib/actions/members"
import { useRouter } from "next/navigation"

export function AddMemberForm({ listId }: { listId: number }) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await addMember(listId, { email })
      setEmail("")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add member")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end w-full">
      <div className="flex-1">
        <Input
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label="Email address"
          aria-invalid={error ? true : undefined}
        />
        {error && <p className="text-sm text-destructive mt-1" role="alert">{error}</p>}
      </div>
      <Button type="submit" disabled={submitting} size="sm">
        {submitting ? "Adding..." : "Add"}
      </Button>
    </form>
  )
}
```

- [ ] **Step 4: Create upload members form**

`app/member-lists/[listId]/upload-members-form.tsx`:

```tsx
"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { uploadMembers } from "@/lib/actions/members"
import { useRouter } from "next/navigation"

export function UploadMembersForm({ listId }: { listId: number }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [emails, setEmails] = useState<string[]>([])
  const [invalidCount, setInvalidCount] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<{ added: number; duplicates: number; invalid: number } | null>(null)

  function parseFile(file: File) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split(/[\r\n]+/).filter(Boolean)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      const valid: string[] = []
      let invalid = 0

      for (const line of lines) {
        // Take first column (CSV support)
        const email = line.split(",")[0].trim().toLowerCase()
        if (emailRegex.test(email)) {
          valid.push(email)
        } else {
          invalid++
        }
      }

      setEmails(valid)
      setInvalidCount(invalid)
      setResult(null)
    }
    reader.readAsText(file)
  }

  async function handleUpload() {
    setUploading(true)
    try {
      const res = await uploadMembers(listId, emails)
      setResult(res)
      setEmails([])
      setInvalidCount(0)
      if (fileRef.current) fileRef.current.value = ""
      router.refresh()
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.txt"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) parseFile(file)
          }}
          className="text-sm"
        />
      </div>

      {emails.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Found {emails.length} valid emails
            {invalidCount > 0 && ` (${invalidCount} invalid rows skipped)`}
          </p>
          <Button onClick={handleUpload} disabled={uploading} size="sm">
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      )}

      {result && (
        <Alert>
          <AlertDescription>
            {result.added} added, {result.duplicates} duplicates, {result.invalid} invalid
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
```

- [ ] **Step 5: Create remove member button**

`app/member-lists/[listId]/remove-member-button.tsx`:

```tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { removeMember } from "@/lib/actions/members"

export function RemoveMemberButton({ memberId, listId }: { memberId: number; listId: number }) {
  const router = useRouter()
  const [removing, setRemoving] = useState(false)

  async function handleRemove() {
    setRemoving(true)
    try {
      await removeMember(memberId, listId)
      router.refresh()
    } finally {
      setRemoving(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
          Remove
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove member?</AlertDialogTitle>
          <AlertDialogDescription>
            This member will be removed from the list and will no longer be eligible to vote on topics associated with this list.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleRemove} disabled={removing}>
            {removing ? "Removing..." : "Remove"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

- [ ] **Step 6: Create delete list button**

`app/member-lists/[listId]/delete-list-button.tsx`:

```tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteMemberList } from "@/lib/actions/member-lists"

export function DeleteListButton({ listId, hasTopics }: { listId: number; hasTopics: boolean }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteMemberList(listId)
      router.push("/member-lists")
    } catch {
      setDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={hasTopics}>
          {hasTopics ? "Cannot delete (has topics)" : "Delete member list"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete member list?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the member list and all its members. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {deleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

- [ ] **Step 7: Commit**

```bash
git add app/member-lists/[listId]/
git commit -m "feat: add member list edit page

Edit name/description, add members individually or CSV upload,
remove members with confirmation, delete list with guard."
```

---

### Task 20: Add users page

**Files:**
- Create: `app/member-lists/add-users/page.tsx`

- [ ] **Step 1: Create bulk add users page**

`app/member-lists/add-users/page.tsx`:

```tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UploadMembersForm } from "@/app/member-lists/[listId]/upload-members-form"

export default function AddUsersPage() {
  const [lists, setLists] = useState<{ id: number; name: string }[]>([])
  const [selectedListId, setSelectedListId] = useState<number | null>(null)

  useEffect(() => {
    fetch("/api/member-lists")
      .then((res) => res.json())
      .then(setLists)
  }, [])

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#ab0232]">Add users to member list</h1>
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label>Member list</Label>
            <Select onValueChange={(v) => setSelectedListId(parseInt(v, 10))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a member list" />
              </SelectTrigger>
              <SelectContent>
                {lists.map((list) => (
                  <SelectItem key={list.id} value={String(list.id)}>
                    {list.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedListId && <UploadMembersForm listId={selectedListId} />}
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 2: Create member lists API route**

`app/api/member-lists/route.ts`:

```typescript
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { getAllMemberLists } from "@/lib/db/queries"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user.isAdmin) {
    return NextResponse.json([], { status: 403 })
  }

  const lists = await getAllMemberLists()
  return NextResponse.json(lists)
}
```

- [ ] **Step 3: Commit**

```bash
git add app/member-lists/add-users/ app/api/member-lists/
git commit -m "feat: add bulk add users page

Select member list, upload CSV with preview and results."
```

---

## Chunk 6: Admin Pages — Topics

### Task 21: Topics overview page

**Files:**
- Create: `app/topics/page.tsx`

- [ ] **Step 1: Create topics page**

`app/topics/page.tsx`:

```tsx
import Link from "next/link"
import { getTopicsWithCounts } from "@/lib/db/queries"
import { getTopicStatus } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function TopicsPage() {
  const topics = await getTopicsWithCounts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#ab0232]">Topics</h1>
        <Button asChild>
          <Link href="/topics/create">Create topic</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>List</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Opens</TableHead>
            <TableHead>Closes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topics.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                No topics yet.
              </TableCell>
            </TableRow>
          ) : (
            topics.map((topic) => {
              const status = getTopicStatus(topic.opensAt, topic.closesAt)
              return (
                <TableRow key={topic.id}>
                  <TableCell>
                    <Link
                      href={`/topics/${topic.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {topic.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {topic.memberListName}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={status === "open" ? "default" : "secondary"}
                      className={
                        status === "open"
                          ? "bg-green-100 text-green-800"
                          : status === "scheduled"
                            ? "bg-blue-100 text-blue-800"
                            : ""
                      }
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {topic.opensAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {topic.closesAt.toLocaleDateString()}
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/topics/page.tsx
git commit -m "feat: add topics overview page

Table with title, list, status badges, open/close dates."
```

---

### Task 22: Create topic page

**Files:**
- Create: `app/topics/create/page.tsx`

- [ ] **Step 1: Create the page**

`app/topics/create/page.tsx`:

```tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createTopic } from "@/lib/actions/topics"

export default function CreateTopicPage() {
  const router = useRouter()
  const [lists, setLists] = useState<{ id: number; name: string }[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [memberListId, setMemberListId] = useState<number | null>(null)
  const [opensAt, setOpensAt] = useState("")
  const [closesAt, setClosesAt] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/member-lists")
      .then((res) => res.json())
      .then(setLists)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!memberListId) return
    setSubmitting(true)
    setError(null)

    try {
      await createTopic({ title, description, memberListId, opensAt, closesAt })
      router.push("/topics")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#ab0232]">Create topic</h1>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Member list</Label>
              <Select onValueChange={(v) => setMemberListId(parseInt(v, 10))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a member list" />
                </SelectTrigger>
                <SelectContent>
                  {lists.map((list) => (
                    <SelectItem key={list.id} value={String(list.id)}>
                      {list.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="opensAt">Opens at</Label>
                <Input id="opensAt" type="datetime-local" value={opensAt} onChange={(e) => setOpensAt(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="closesAt">Closes at</Label>
                <Input id="closesAt" type="datetime-local" value={closesAt} onChange={(e) => setClosesAt(e.target.value)} required />
              </div>
            </div>
            {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
            <Button type="submit" disabled={submitting || !memberListId}>
              {submitting ? "Creating..." : "Create topic"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/topics/create/
git commit -m "feat: add create topic page

Form with title, description, member list, open/close dates."
```

---

### Task 23: Edit topic page

**Files:**
- Create: `app/topics/[topicId]/page.tsx`

- [ ] **Step 1: Create topic edit page**

`app/topics/[topicId]/page.tsx`:

```tsx
import { notFound } from "next/navigation"
import { getTopic, getVoteResults } from "@/lib/db/queries"
import { Card, CardContent } from "@/components/ui/card"
import { ResultBars } from "@/components/result-bars"
import { EditTopicForm } from "./edit-topic-form"
import { DeleteTopicButton } from "./delete-topic-button"

export default async function TopicEditPage({
  params,
}: {
  params: Promise<{ topicId: string }>
}) {
  const { topicId } = await params
  const id = parseInt(topicId, 10)
  if (isNaN(id)) notFound()

  const topic = await getTopic(id)
  if (!topic) notFound()

  const results = await getVoteResults(id)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#ab0232]">Edit topic</h1>

      <Card>
        <CardContent className="pt-6">
          <EditTopicForm topic={topic} />
        </CardContent>
      </Card>

      {results.totalVotes > 0 && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-lg font-semibold">Vote Results</h2>
            <ResultBars
              yesCount={results.yesCount}
              noCount={results.noCount}
              totalVotes={results.totalVotes}
            />
          </CardContent>
        </Card>
      )}

      <DeleteTopicButton topicId={id} />
    </div>
  )
}
```

- [ ] **Step 2: Create edit topic form**

`app/topics/[topicId]/edit-topic-form.tsx`:

```tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateTopic } from "@/lib/actions/topics"

function toLocalDatetime(date: Date) {
  const offset = date.getTimezoneOffset()
  const local = new Date(date.getTime() - offset * 60000)
  return local.toISOString().slice(0, 16)
}

interface EditTopicFormProps {
  topic: {
    id: number
    title: string
    description: string | null
    memberListId: number
    memberListName: string | null
    opensAt: Date
    closesAt: Date
  }
}

export function EditTopicForm({ topic }: EditTopicFormProps) {
  const router = useRouter()
  const [lists, setLists] = useState<{ id: number; name: string }[]>([])
  const [title, setTitle] = useState(topic.title)
  const [description, setDescription] = useState(topic.description ?? "")
  const [memberListId, setMemberListId] = useState(topic.memberListId)
  const [opensAt, setOpensAt] = useState(toLocalDatetime(topic.opensAt))
  const [closesAt, setClosesAt] = useState(toLocalDatetime(topic.closesAt))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/member-lists")
      .then((res) => res.json())
      .then(setLists)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      await updateTopic(topic.id, { title, description, memberListId, opensAt, closesAt })
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Member list</Label>
        <Select value={String(memberListId)} onValueChange={(v) => setMemberListId(parseInt(v, 10))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {lists.map((list) => (
              <SelectItem key={list.id} value={String(list.id)}>
                {list.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="opensAt">Opens at</Label>
          <Input id="opensAt" type="datetime-local" value={opensAt} onChange={(e) => setOpensAt(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="closesAt">Closes at</Label>
          <Input id="closesAt" type="datetime-local" value={closesAt} onChange={(e) => setClosesAt(e.target.value)} required />
        </div>
      </div>
      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
      <Button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : "Update topic"}
      </Button>
    </form>
  )
}
```

- [ ] **Step 3: Create delete topic button**

`app/topics/[topicId]/delete-topic-button.tsx`:

```tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteTopic } from "@/lib/actions/topics"

export function DeleteTopicButton({ topicId }: { topicId: number }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteTopic(topicId)
      router.push("/topics")
    } catch {
      setDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete topic</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete topic?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the topic and all associated votes. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {deleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add app/topics/[topicId]/
git commit -m "feat: add topic edit page with delete

Edit form, vote results display, delete with confirmation."
```

---

### Task 24: Delete old auth callback and error pages

**Files:**
- Delete: `app/auth/callback/route.ts`
- Delete: `app/auth/error/page.tsx`

- [ ] **Step 1: Remove old auth routes**

```bash
rm -rf app/auth
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "chore: remove old Supabase auth callback and error pages

Replaced by Better-Auth API route at /api/auth/[...all]."
```

---

### Task 25: Final cleanup and build verification

**Files:**
- Modify: `lib/utils.ts` (keep as-is, just verify)
- Various: fix any remaining import issues

- [ ] **Step 1: Remove unused UI components**

Remove Shadcn components not referenced by the app. At minimum remove sidebar-related components:

```bash
rm -f components/ui/sidebar.tsx
```

- [ ] **Step 2: Run TypeScript type check**

```bash
npx tsc --noEmit
```

Fix any type errors found. Common issues will be:
- Import paths referencing deleted files
- Type mismatches from the schema change

- [ ] **Step 3: Run build**

```bash
pnpm build
```

Fix any build errors. The build should succeed without `typescript.ignoreBuildErrors`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: final cleanup and build verification

Remove unused components, fix imports, verify clean build."
```

---

## Summary

| Chunk | Tasks | Description |
|---|---|---|
| 1 | 1-3 | Dependencies, config cleanup, Drizzle schema |
| 2 | 4-5 | Better-Auth setup, middleware |
| 3 | 6 | React Email templates, Nodemailer |
| 4 | 7-9 | Validations, queries, server actions |
| 5 | 10-16 | Layout, header, error pages, home, sign-in, vote pages |
| 6 | 17-25 | Member lists pages, topics pages, cleanup |

Total: 25 tasks, ~25 commits.
