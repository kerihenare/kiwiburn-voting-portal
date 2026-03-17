# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # Start Next.js dev server (requires Docker PostgreSQL running)
pnpm build            # Production build
pnpm lint             # Biome check (lint + format)
pnpm lint:fix         # Auto-fix lint/format issues
pnpm test             # Run all tests (Vitest)
pnpm test:watch       # Watch mode
pnpm vitest run path/to/test.ts  # Run a single test file
pnpm typecheck        # TypeScript type check

docker compose up -d  # Start PostgreSQL (port 6769)
pnpm drizzle-kit push # Push schema to database
pnpm db:seed          # Seed database (truncate tables first if re-running)
```

## Architecture

Next.js 16 App Router with React 19, PostgreSQL via Drizzle ORM, Better Auth (magic link), Tailwind CSS v4.

### Auth

Better Auth with magic link plugin. Session-based with cookie caching. The `user` table has an `isAdmin` boolean. Auth tables (`user`, `session`, `verification`) are managed by Better Auth — their Drizzle export names must match exactly. Admin routes are protected by middleware (cookie check) and server components (`requireAdmin()`).

### Data model

`member_lists` → `members` (by email) → determines voting eligibility per `topic`. Each `topic` belongs to one member list and has `opensAt`/`closesAt` timestamps. `votes` has a unique constraint on `(topicId, userId)` — upsert pattern for vote changes. Lists and topics use soft deletes (`deletedAt`/`deletedBy`).

### Server actions

All mutations use Next.js server actions in `lib/actions/`. Pattern: authenticate → validate with Zod (`lib/validations.ts`) → database operation → `revalidatePath()`. Vote confirmation emails are sent non-blocking (fire-and-forget with `.catch(console.error)`).

### Email

React Email components in `emails/` rendered to both HTML and plain text. Sent via Nodemailer SMTP. Styles use inline CSS objects matching the website's visual design (warm off-white background, white card, crimson headings, orange buttons).

## Code style

Biome handles linting and formatting. Key rules: no semicolons, double quotes, 2-space indent, natural import ordering, sorted object keys/properties. CSS formatting is disabled (Tailwind v4 directives).
