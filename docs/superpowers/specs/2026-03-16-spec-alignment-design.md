# Spec Alignment — Design Document

Bring the v0 codebase into full alignment with the PRD and design spec.

---

## 1. Tech Stack Swap

### Replace

| Layer | Current | Target |
|---|---|---|
| Auth | Supabase Auth | Better-Auth (magic link plugin) |
| ORM | Supabase JS client (raw) | Drizzle ORM |
| Forms | react-hook-form | Tanstack Forms + Zod |
| Email | None | React Email + Nodemailer |
| Theme | next-themes (toggle) | Light only (remove theme toggle) |

### Keep

- Next.js, React, TailwindCSS, Shadcn UI, Supabase Postgres

### Remove

- `@supabase/ssr`, `@supabase/supabase-js` (auth + client)
- `next-themes` and ThemeProvider
- `react-hook-form` and `@hookform/resolvers`
- Toast/sonner components and imports (design spec: "No toast notifications")

### Font

Inter via Google Fonts, configured in `app/layout.tsx` using `next/font/google`.

---

## 2. Database Schema

### Drizzle schema in `lib/db/schema.ts`

**users** — managed by Better-Auth:
- `id` text PK
- `email` text unique not null
- `name` text
- `emailVerified` boolean
- `image` text
- `isAdmin` boolean default false
- `createdAt` timestamp
- `updatedAt` timestamp

**session** — managed by Better-Auth:
- `id` text PK
- `expiresAt` timestamp not null
- `token` text unique not null
- `ipAddress` text
- `userAgent` text
- `userId` text FK → users.id

**verification** — managed by Better-Auth:
- `id` text PK
- `identifier` text not null
- `value` text not null
- `expiresAt` timestamp not null
- `createdAt` timestamp
- `updatedAt` timestamp

**member_lists**:
- `id` serial PK
- `name` text not null
- `description` text
- `createdAt` timestamp default now
- `updatedAt` timestamp default now

**members**:
- `id` serial PK
- `email` text not null
- `memberListId` integer FK → member_lists.id (cascade delete)
- `createdAt` timestamp default now
- Unique constraint on (email, memberListId)

**topics**:
- `id` serial PK
- `title` text not null
- `description` text
- `memberListId` integer FK → member_lists.id
- `opensAt` timestamp not null
- `closesAt` timestamp not null
- `createdAt` timestamp default now
- `updatedAt` timestamp default now

**votes**:
- `id` serial PK
- `topicId` integer FK → topics.id (cascade delete)
- `userId` text FK → users.id
- `vote` text not null — constrained to `'yes'` or `'no'`
- `createdAt` timestamp default now
- `updatedAt` timestamp default now
- Unique constraint on (topicId, userId)

### Migrations

Use `drizzle-kit` to generate and run migrations against Supabase Postgres via `DATABASE_URL` connection string.

### RLS

RLS policies remain on the Supabase Postgres side. Update them to reference Better-Auth's `users` and `session` tables. Alternatively, handle authorization in application code (server actions + middleware) since Drizzle connects via a direct connection string with full access. Decision: **application-level authorization** — simpler to reason about and test.

---

## 3. Authentication

### Better-Auth server (`lib/auth.ts`)

- Magic link plugin for passwordless email
- Nodemailer adapter for sending emails
- Drizzle adapter for database storage
- Session config with secure cookies

### Better-Auth client (`lib/auth-client.ts`)

- Client-side auth hooks and methods
- `signIn.magicLink({ email })` for login
- `useSession()` for auth state

### Magic link flow

1. User enters email at `/sign-in`
2. Better-Auth generates token, stores in `verification` table
3. Nodemailer sends email using React Email template (`emails/magic-link.tsx`)
4. User clicks link → `/api/auth/*` (Better-Auth handler) verifies, creates session
5. Redirect to `/`

### Magic link expiry

Tokens expire after **15 minutes**. Configured via Better-Auth's `magicLink.expiresIn` option.

### Admin detection

- `users.isAdmin` boolean column
- Checked in middleware and server actions
- Set manually in database or via a seed script

### Auth API route

- `app/api/auth/[...all]/route.ts` — Better-Auth catch-all handler

---

## 4. Email

### Nodemailer config (env vars)

```
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
```

### React Email templates

- `emails/magic-link.tsx` — sign-in link email
- `emails/vote-confirmation.tsx` — vote recorded confirmation

### Sending

- Auth emails: sent by Better-Auth via Nodemailer adapter
- Vote confirmation: sent from `castVote` server action after successful upsert

---

## 5. Routes

| Route | Purpose | Auth |
|---|---|---|
| `/` | Community Votes (topic list) | Public |
| `/votes` | Redirect to `/` | Public |
| `/votes/[voteId]` | Individual vote page | Public (vote requires auth) |
| `/votes/[voteId]/success` | Vote success confirmation | Auth |
| `/sign-in` | Magic link login | Public |
| `/member-lists` | Member lists overview | Admin |
| `/member-lists/create` | Create member list | Admin |
| `/member-lists/[listId]` | Edit member list | Admin |
| `/member-lists/add-users` | Bulk add users via CSV (select list first) | Admin |
| `/topics` | Topic management | Admin |
| `/topics/create` | Create topic | Admin |
| `/topics/[topicId]` | Edit topic | Admin |

### Removed

- `/admin` prefix and all `/admin/*` routes
- `/admin/layout.tsx` with sidebar
- Admin dashboard page

### Error pages

- `app/not-found.tsx` — 404: red icon, large "404", "Page not found", go home button
- `app/error.tsx` — 500: "Something went wrong", try again button

### Middleware (`middleware.ts`)

- Refresh Better-Auth session on every request
- Protect `/member-lists/*` and `/topics/*` — redirect to `/sign-in` if unauthenticated, redirect to `/` if not admin

---

## 6. Pages & UI

### Navigation

- Header only (no sidebar)
- Header: logo/title, admin links (Member Lists, Topics) for admin users, user email, sign out
- Dark header background (`#332d2d`), white text

### Home (`/`)

Vertical stack of topic cards:

```
+----------------------------------------------+
| [Timer badge]                                |
|                                              |
| Member List Name (small, muted)              |
| Topic Title (bold, lg)                       |
| Description (clamped 2 lines)                |
|                                              |
| (if closed) Yes ████████── 67%               |
| (if closed) No  ███──────── 33%              |
| (if closed) "12 votes"                       |
|                                              |
| ──────────────────────────────────────────── |
| "You voted: Yes" badge              [Vote now]|
+----------------------------------------------+
```

Timer states: "Closes in 3 days", "Closes in 5 hours", "Closes in 12 minutes", "Closes in < 1 minute", "Closed 2 days ago", "Opens in 4 days".

### Sign-in (`/sign-in`)

Single centred card:
- Title: "Sign in to vote"
- Text: "Enter your email to receive a secure login link."
- Email input (placeholder: `you@example.com`)
- Button: "Send login link" → "Sending..." (disabled) on submit

After submission, show confirmation state with "Resend login link" button for email deliverability issues.

### Vote page (`/votes/[voteId]`)

Card layout:
1. Timer
2. Topic title
3. Description
4. Divider
5. Voting interface or results

**Authenticated + eligible + open:** Two buttons — YES / NO. Stacked mobile, side-by-side desktop. Selected vote: darker background + outline ring. After voting, redirect to `/votes/[voteId]/success`. If returning to the vote page after voting, show: "You voted Yes. You can change your vote while voting is open."

**Not authenticated:** Info alert: "Please sign in to cast your vote."

**Not eligible:** Alert: "You are not eligible to vote on this topic."

**Closed:** Result bars (Yes/No percentages), total votes, "You voted: Yes" if applicable.

### Vote success (`/votes/[voteId]/success`)

Displayed after casting a vote (per design spec section 9):
- Large badge: YES (green) or NO (red)
- Heading: "Vote recorded"
- Text: "Your vote to Yes has been securely recorded. Thank you for participating in this KiwiBurn community decision."
- Button: "View all votes" → links to `/`

### Home page header

- Title: "Community Votes"
- Subtitle: "View and participate in community decisions."

### Member lists (`/member-lists`)

- Header: "Member Lists" left, "Create member list" button right
- Table: Name (links to detail), Description, Members count, Topics count

### Member list edit (`/member-lists/[listId]`)

- Name and description fields (editable)
- Members section: inline email add form, CSV upload, members table (email, added date, remove button)
- Remove member: requires confirmation via AlertDialog before deletion
- Topics section: table of topics using this list
- Delete list button (disabled if topics exist, requires confirmation via AlertDialog)

### Member list create (`/member-lists/create`)

- Form: name (required), description (optional)
- Button: "Create member list"

### Add users (`/member-lists/add-users`)

Standalone page for bulk-adding users to a member list:
- Dropdown to select target member list
- CSV file upload with preview and confirmation
- Same CSV parsing/validation logic as the member list edit page
- Results alert after upload

### Topics (`/topics`)

- Table: Title, List, Status badge, Opens, Closes
- Status badges: Open (green), Closed (grey), Scheduled (blue)

### Topic create (`/topics/create`)

- Fields: title, description, member list dropdown, opens at (datetime-local), closes at (datetime-local)
- Button: "Create topic"

### Topic edit (`/topics/[topicId]`)

- Same fields as create, pre-filled
- Buttons: "Update topic", "Delete topic" (destructive, requires confirmation via AlertDialog)

---

## 7. Colour System

| Element | Value |
|---|---|
| Primary | `#ed7703` |
| Page background | `#f3f4f6` |
| Card background | `#ffffff` |
| Text | `#000000` |
| Heading text | `#ab0232` |
| Border | `#e5e7eb` |
| Button background | `#ed7703` |
| Button text | `#ffffff` |
| Header background | `#332d2d` |
| Header text | `#ffffff` |

Shadcn theme preset: aIo4APA (Vega style, neutral base, orange theme, large radius).

---

## 8. Forms

All forms use **Tanstack Forms** with **Zod** validation schemas.

Validation schemas in `lib/validations.ts`:
- `signInSchema` — email required, valid format
- `createTopicSchema` — title required, memberListId required, opensAt required, closesAt required, closesAt > opensAt
- `updateTopicSchema` — same as create
- `createMemberListSchema` — name required
- `addMemberSchema` — email required, valid format
- `castVoteSchema` — vote enum ('yes' | 'no')

---

## 9. Server Actions

All mutations via Next.js server actions in `lib/actions/`.

- `lib/actions/auth.ts` — `signInWithMagicLink(email)`
- `lib/actions/votes.ts` — `castVote(topicId, vote)` (upsert + send confirmation email)
- `lib/actions/topics.ts` — `createTopic(data)`, `updateTopic(id, data)`, `deleteTopic(id)`
- `lib/actions/member-lists.ts` — `createMemberList(data)`, `updateMemberList(id, data)`, `deleteMemberList(id)`
- `lib/actions/members.ts` — `addMember(listId, email)`, `removeMember(id)`, `uploadMembers(listId, emails[])`

### CSV upload details

`uploadMembers` receives an array of email strings (parsed and validated client-side). Server-side:
1. Validates each email format (skip invalid)
2. Bulk inserts with `onConflictDoNothing` for duplicates
3. Returns `{ added: number, duplicates: number, invalid: number }` so the UI can display a results alert: "X added, Y duplicates, Z invalid"

Client-side CSV parsing:
1. User selects `.csv` or `.txt` file
2. Parse rows, extract email column, validate format
3. Show preview: "Found X valid emails (Y invalid rows skipped)"
4. User clicks "Upload" to confirm
5. Display results alert from server response

### Authorization in actions

Every admin action checks `isAdmin` from the session. Every vote action checks eligibility (authenticated + member of list + topic open). Votes cannot be cast or changed after `closesAt` has passed — this is enforced in both the `castVote` action and the UI. Unauthorized → throw error.

---

## 10. Queries

Reusable Drizzle query functions in `lib/db/queries.ts`:

- `getTopics()` — all topics with member list name and vote counts
- `getTopic(id)` — single topic with full details
- `getTopicWithEligibility(topicId, userId)` — topic + user's eligibility and current vote
- `getMemberLists()` — all lists with member/topic counts
- `getMemberList(id)` — single list with members and topics
- `getUserVoteForTopic(topicId, userId)` — user's vote if exists
- `getVoteResults(topicId)` — yes/no counts and total

---

## 11. Accessibility

- Skip link: "Skip to content" as first focusable element
- Focus rings: 3px ring, 50% opacity on all interactive elements
- ARIA: `aria-label` on buttons, `aria-invalid` on fields, `aria-hidden` on decorative icons, `role="alert"` on alerts
- Semantic HTML: `<form>`, `<table>`, `<header>`, `<section>`, `<nav>`
- `<html lang="en-NZ">`
- `color-scheme: light` — the colour system (section 7) defines a light palette only. Dark mode is not designed. The `prefers-color-scheme` media query is not used. Shadcn's dark mode class is not applied.
- Full keyboard navigation with tab and arrow keys

---

## 12. Key Files Structure

```
lib/
  auth.ts                    # Better-Auth server config
  auth-client.ts             # Better-Auth client
  db/
    index.ts                 # Drizzle client instance
    schema.ts                # Drizzle table definitions
    queries.ts               # Reusable query functions
  actions/
    auth.ts                  # Auth server actions
    votes.ts                 # Vote server actions
    topics.ts                # Topic server actions
    member-lists.ts          # Member list server actions
    members.ts               # Member server actions
  validations.ts             # Zod schemas
  utils.ts                   # cn() helper
emails/
  magic-link.tsx             # Magic link email template
  vote-confirmation.tsx      # Vote confirmation email template
app/
  layout.tsx                 # Root layout (no ThemeProvider)
  page.tsx                   # Home — Community Votes
  not-found.tsx              # 404 page
  error.tsx                  # 500 page
  sign-in/page.tsx           # Magic link sign-in
  votes/[voteId]/page.tsx    # Individual vote page
  votes/[voteId]/success/page.tsx # Vote success page
  api/auth/[...all]/route.ts # Better-Auth handler
  member-lists/
    page.tsx                 # Member lists overview
    create/page.tsx          # Create member list
    [listId]/page.tsx        # Edit member list
    add-users/page.tsx       # Add users to member list
  topics/
    page.tsx                 # Topics management
    create/page.tsx          # Create topic
    [topicId]/page.tsx       # Edit topic
components/
  header.tsx                 # App header
  topic-card.tsx             # Topic card for home page
  vote-buttons.tsx           # YES/NO vote buttons
  result-bars.tsx            # Vote result bar chart
  timer-badge.tsx            # Time remaining badge
middleware.ts                # Auth session + route protection
drizzle.config.ts            # Drizzle Kit config
```

---

## 13. Environment Variables

```
DATABASE_URL=               # Supabase Postgres connection string
BETTER_AUTH_SECRET=         # Better-Auth signing secret
BETTER_AUTH_URL=            # App base URL
SMTP_HOST=                  # Email SMTP host
SMTP_PORT=                  # Email SMTP port
SMTP_USER=                  # Email SMTP username
SMTP_PASS=                  # Email SMTP password
SMTP_FROM=                  # Email sender address
```

Remove `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

---

## 14. Config Cleanup

- `next.config.mjs`: remove `typescript.ignoreBuildErrors` — fix types properly
- Remove `lib/supabase/` directory entirely
- Remove `scripts/001_create_tables.sql` and `002_enable_rls.sql` (replaced by Drizzle migrations)
- Remove `styles/globals.css` (duplicate of `app/globals.css`)
- Remove toast/sonner components and imports

---

## 15. Testing

Testing (Vitest) is out of scope for this alignment phase. It will be addressed in a follow-up once the stack swap and feature implementation are complete.
