# Integration Testing Design — Kiwiburn Voting Portal

## Overview

Add end-to-end browser tests using Playwright against a real PostgreSQL database. Tests cover all critical user flows: sign-in, voting, vote changes, eligibility enforcement, and admin management of topics and member lists. A GitHub Actions CI pipeline runs the full suite on every push and PR.

## Decisions

- **Playwright** as the E2E test runner (not Vitest browser mode or Cypress)
- **Dedicated test database** (`voting_portal_test`) in the existing Docker PostgreSQL container
- **Magic link auth via DB** — read verification tokens directly from the database rather than capturing emails
- **CI from the start** — GitHub Actions with PostgreSQL service container

## Dependencies

Add `@playwright/test` as a dev dependency: `pnpm add -D @playwright/test`

## Test Infrastructure

### Test Database

A `voting_portal_test` database in the existing Docker PostgreSQL container. The global setup script creates this database if it doesn't exist (by querying `SELECT 1 FROM pg_database WHERE datname = 'voting_portal_test'` and running `CREATE DATABASE voting_portal_test` only if not found). This is more robust than a Docker init script, which only runs on fresh data directories — existing developers with a `pgdata` volume would otherwise need to manually create the database.

### Schema Management

Before the test suite runs, a global setup script pushes the Drizzle schema to the test database by shelling out to `npx drizzle-kit push --force` with `DATABASE_URL` set to the test database URL. This reuses the existing `drizzle.config.ts` without duplicating schema logic.

### Data Isolation

Each test file gets a `beforeEach` that truncates all tables (cascade) so tests don't leak state. A shared helper provides this.

### DB Connection

A test-specific Drizzle client configured with the test database URL, used by helpers for seeding and token retrieval.

### Dev Server

Playwright starts the Next.js dev server automatically via its `webServer` config, with `DATABASE_URL` pointed at the test database. The app under test hits the test DB.

### Environment

A `.env.test` file (gitignored) with test-specific values. A `.env.test.example` committed as reference — requires adding `!.env.test.example` to `.gitignore` (the file has duplicate `.env*` patterns at lines 69-71 and 160-161; add the exemption to the second block or consolidate the duplicates).

Playwright output directories (`test-results/` and `playwright-report/`) must also be added to `.gitignore`.

The Playwright `webServer` config passes env vars from `.env.test` to the Next.js dev server via its `env` option, since Next.js does not natively load `.env.test` files. The `dotenv` package (or Playwright's built-in env file support) reads `.env.test` in the Playwright config.

## Test Helpers & Auth Strategy

### Seed Helpers (`test/e2e/helpers/seed.ts`)

Functions to set up test data:

- `seedUser(email, opts?)` — Insert into `user` table, optionally set `isAdmin: true`
- `seedMemberList(name, emails[])` — Create a member list and its members
- `seedTopic(memberListId, opts?)` — Create a topic with configurable `opensAt`/`closesAt` (defaults to currently open) and `isActive` (defaults to `true` — the schema defaults to `false`, but tests need visible topics)
- `seedVote(topicId, userId, vote)` — Insert a vote directly

All return the created records so tests can reference IDs.

### Auth Helper (`test/e2e/helpers/auth.ts`)

`authenticateAs(page, email)`:

1. Navigate to `/sign-in`
2. Fill in the email and submit
3. Query the `verification` table for the most recent row where `identifier` matches the email — the `value` column contains the token
4. Construct the magic link URL: `/api/auth/magic-link/verify?token={value}` and navigate to it
5. Wait for redirect to confirm the session is active

Used at the start of every test that needs an authenticated user. For the sign-in flow test itself, the steps are the assertions.

**Important:** The user must be pre-seeded in the `user` table (via `seedUser`) before calling `authenticateAs`, because `disableSignUp: true` means Better Auth will not create user records during magic link verification. The user must also be in a member list for the `sendMagicLink` hook to pass the `isEmailInAnyMemberList` check.

### Reset Helper (`test/e2e/helpers/reset.ts`)

`resetDatabase()`:

- Executes a single `TRUNCATE "user", session, verification, member_lists, members, topics, votes CASCADE` statement (`"user"` must be quoted — it's a PostgreSQL reserved word) — CASCADE handles foreign key dependencies regardless of order
- Called in `beforeEach` for each test file

## Test Suites

### `sign-in.spec.ts` — Magic Link Auth Flow

- Enter email for a user in a member list -> token created in DB -> navigate to magic link -> redirected to home authenticated
- Enter email for a non-member -> magic link request is rejected (the app's `sendMagicLink` hook checks `isEmailInAnyMemberList` and throws `FORBIDDEN` if not found) -> user sees error message

### `vote.spec.ts` — Eligible Member Voting

- Seed a user, member list, and open topic -> authenticate -> see topic on home page -> cast a yes vote -> see confirmation page -> vote recorded in DB

### `change-vote.spec.ts` — Vote Modification

- Seed a user with an existing vote -> authenticate -> change vote from yes to no -> see updated result -> DB reflects the change (upsert)

### `closed-topic.spec.ts` — Closed Topic Enforcement

- Seed a user, member list, and topic with `closesAt` in the past -> authenticate -> navigate to topic -> voting is disabled, results are shown

### `ineligible-voter.spec.ts` — Eligibility Enforcement

- Seed a user in member list A (so they can sign in — the `sendMagicLink` hook requires membership in *any* list), and a topic assigned to member list B (user not in B) -> authenticate -> navigate to topic -> vote buttons disabled/absent or action rejected

### `admin-topics.spec.ts` — Topic Management

- Authenticate as admin -> navigate to topics -> create a new topic (title, description, member list, dates) -> see it listed -> edit it -> soft delete it -> confirm it's gone from the active list

### `admin-member-lists.spec.ts` — Member List Management

- Authenticate as admin -> create a member list -> add members (individual emails) -> see member count -> assign list to a new topic -> delete list (blocked if topics exist)

### Test Pattern

Each test file: `beforeEach` resets the DB and seeds its specific data, then runs through the user flow asserting both UI state and (where relevant) database state.

## Project Structure

```
test/
  e2e/
    helpers/
      db.ts              # Test DB client (Drizzle instance)
      seed.ts            # Seed helper functions
      auth.ts            # authenticateAs() helper
      reset.ts           # Truncate all tables
    specs/
      sign-in.spec.ts
      vote.spec.ts
      change-vote.spec.ts
      closed-topic.spec.ts
      ineligible-voter.spec.ts
      admin-topics.spec.ts
      admin-member-lists.spec.ts
    global-setup.ts      # Push schema to test DB before suite
playwright.config.ts     # Top-level config
.env.test.example        # Reference env vars
```

## Playwright Configuration

- `testDir: ./test/e2e/specs`
- `webServer`: starts `pnpm dev --port 3001` with test env vars (loaded from `.env.test`), waits for `http://localhost:3001` — uses port 3001 to avoid conflicts with a running dev server
- `globalSetup`: points to `test/e2e/global-setup.ts`
- Single project: Chromium only (Firefox/WebKit can be added later)
- `retries: 0` locally, `retries: 2` in CI
- Trace and screenshot on first failure

## Package.json Scripts

- `pnpm test:e2e` — Run Playwright tests
- `pnpm test:e2e:ui` — Playwright UI mode for debugging

## Environment Variables (`.env.test.example`)

```
DATABASE_URL=postgresql://kiwiburn:kiwiburn@localhost:6769/voting_portal_test
BETTER_AUTH_SECRET=test-secret
BETTER_AUTH_URL=http://localhost:3001
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3001
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=test
SMTP_PASS=test
SMTP_FROM=test@kiwiburn.com
```

SMTP values are dummy — magic links are read from the DB, and vote confirmation emails fail silently (fire-and-forget pattern already in the codebase).

## CI Pipeline (GitHub Actions)

### Workflow: `.github/workflows/e2e.yml`

**Trigger:** Push to `main`, pull requests targeting `main`.

### Job 1: `lint-and-typecheck`

- Runs `pnpm lint` and `pnpm typecheck`
- Fast fail gate

### Job 2: `unit-tests`

- Runs `pnpm test`
- Parallel with lint job

### Job 3: `e2e-tests` (depends on jobs 1 and 2)

- **Services:** PostgreSQL 17 container with `voting_portal_test` database
- **Steps:**
  1. Checkout code
  2. Setup Node + pnpm (with dependency caching)
  3. `pnpm install`
  4. `npx playwright install chromium --with-deps`
  5. Copy `.env.test.example` to `.env.test`
  6. `pnpm test:e2e`
- **On failure:** Upload Playwright report + traces as artifacts (7-day retention)

The service container approach avoids Docker-in-Docker. GitHub Actions runs PostgreSQL natively as a job service with `localhost` connection.
