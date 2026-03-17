# Integration Testing Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Playwright E2E tests covering all critical user flows against a real PostgreSQL test database, with GitHub Actions CI.

**Architecture:** Playwright drives Chromium against a Next.js dev server pointed at a `voting_portal_test` database. Test helpers seed data and read magic link tokens directly from the DB. A global setup script creates the test database and pushes the Drizzle schema. GitHub Actions runs lint, unit tests, and E2E tests as parallel/dependent jobs.

**Tech Stack:** Playwright, PostgreSQL 17, Drizzle ORM, Better Auth, Next.js 16, GitHub Actions

**Spec:** `docs/superpowers/specs/2026-03-17-integration-testing-design.md`

---

## File Structure

```
playwright.config.ts                          # Playwright configuration
.env.test.example                             # Reference env vars (committed)
.github/workflows/ci.yml                      # CI pipeline
test/
  e2e/
    global-setup.ts                           # Create test DB + push schema
    helpers/
      db.ts                                   # Test DB Drizzle client
      seed.ts                                 # seedUser, seedMemberList, seedTopic, seedVote
      auth.ts                                 # authenticateAs(page, email)
      reset.ts                                # resetDatabase() — TRUNCATE CASCADE
    specs/
      sign-in.spec.ts                         # Magic link auth flow
      vote.spec.ts                            # Eligible member casts vote
      change-vote.spec.ts                     # Member changes existing vote
      closed-topic.spec.ts                    # Cannot vote on closed topic
      ineligible-voter.spec.ts                # Ineligible member cannot vote
      admin-topics.spec.ts                    # Admin creates/edits/deletes topics
      admin-member-lists.spec.ts              # Admin manages member lists
```

**Modified files:**
- `package.json` — add `@playwright/test` dep, `test:e2e` and `test:e2e:ui` scripts
- `.gitignore` — add `!.env.test.example`, `test-results/`, `playwright-report/`

---

## Task 1: Install Playwright and configure project

**Files:**
- Modify: `package.json`
- Modify: `.gitignore`
- Create: `playwright.config.ts`
- Create: `.env.test.example`

- [ ] **Step 1: Install Playwright**

```bash
pnpm add -D @playwright/test
npx playwright install chromium
```

- [ ] **Step 2: Create `.env.test.example`**

Create `.env.test.example` at the project root:

```
DATABASE_URL=postgresql://kiwiburn:kiwiburn@localhost:6769/voting_portal_test
BETTER_AUTH_SECRET=test-secret-for-e2e-tests
BETTER_AUTH_URL=http://localhost:3001
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3001
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=test
SMTP_PASS=test
SMTP_FROM=test@kiwiburn.com
```

- [ ] **Step 3: Copy `.env.test.example` to `.env.test`**

```bash
cp .env.test.example .env.test
```

- [ ] **Step 4: Update `.gitignore`**

Add after line 161 (`!.env.example`):

```
!.env.test.example

# Playwright
test-results/
playwright-report/
```

- [ ] **Step 5: Create `playwright.config.ts`**

```ts
import dotenv from "dotenv"
import { defineConfig, devices } from "@playwright/test"

dotenv.config({ path: ".env.test" })

export default defineConfig({
  globalSetup: "./test/e2e/global-setup.ts",
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  retries: process.env.CI ? 2 : 0,
  testDir: "./test/e2e/specs",
  use: {
    baseURL: "http://localhost:3001",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "pnpm dev --port 3001",
    env: {
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL!,
      DATABASE_URL: process.env.DATABASE_URL!,
      NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL!,
      SMTP_FROM: process.env.SMTP_FROM!,
      SMTP_HOST: process.env.SMTP_HOST!,
      SMTP_PASS: process.env.SMTP_PASS!,
      SMTP_PORT: process.env.SMTP_PORT!,
      SMTP_USER: process.env.SMTP_USER!,
    },
    reuseExistingServer: !process.env.CI,
    url: "http://localhost:3001",
  },
})
```

- [ ] **Step 6: Add scripts to `package.json`**

Add to the `"scripts"` section:

```json
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui"
```

- [ ] **Step 7: Verify Playwright runs (no tests yet)**

```bash
pnpm test:e2e
```

Expected: exits with "no tests found" or similar — confirms config is loaded without errors.

- [ ] **Step 8: Commit**

```bash
git add playwright.config.ts .env.test.example package.json pnpm-lock.yaml .gitignore
git commit -m "feat: add Playwright E2E test infrastructure"
```

---

## Task 2: Global setup and test database helpers

**Files:**
- Create: `test/e2e/global-setup.ts`
- Create: `test/e2e/helpers/db.ts`
- Create: `test/e2e/helpers/reset.ts`

- [ ] **Step 1: Create `test/e2e/helpers/db.ts`**

This is the test DB client. It reads `DATABASE_URL` from `.env.test`.

```ts
import dotenv from "dotenv"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "../../../lib/db/schema"

dotenv.config({ path: ".env.test" })

const connectionString = process.env.DATABASE_URL!
const client = postgres(connectionString)

export const testDb = drizzle(client, { schema })
export { client as testClient }
```

Note: All E2E helper and spec files use relative imports (not `@/` path aliases) because Playwright runs outside Next.js and does not resolve `tsconfig.json` paths.

- [ ] **Step 2: Create `test/e2e/helpers/reset.ts`**

```ts
import { sql } from "drizzle-orm"
import { testDb } from "./db"

export async function resetDatabase() {
  await testDb.execute(
    sql`TRUNCATE "user", session, verification, member_lists, members, topics, votes CASCADE`,
  )
}
```

- [ ] **Step 3: Create `test/e2e/global-setup.ts`**

This runs once before the entire test suite. It creates the test database if it doesn't exist, then pushes the schema.

```ts
import { execSync } from "node:child_process"
import dotenv from "dotenv"
import postgres from "postgres"

dotenv.config({ path: ".env.test" })

export default async function globalSetup() {
  // Connect to the default database to check/create the test database
  const adminUrl = process.env.DATABASE_URL!.replace(
    /\/[^/]+$/,
    "/voting_portal",
  )
  const adminClient = postgres(adminUrl)

  const result = await adminClient`
    SELECT 1 FROM pg_database WHERE datname = 'voting_portal_test'
  `

  if (result.length === 0) {
    await adminClient`CREATE DATABASE voting_portal_test`
  }

  await adminClient.end()

  // Push schema to test database using drizzle-kit
  execSync("npx drizzle-kit push --force", {
    env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
    stdio: "inherit",
  })
}
```

- [ ] **Step 4: Verify global setup works**

```bash
pnpm test:e2e
```

Expected: Global setup runs, creates `voting_portal_test` database (or confirms it exists), pushes schema, then exits with "no tests found". Check Docker logs or `psql` to confirm the database exists:

```bash
docker compose exec postgres psql -U kiwiburn -c "\l" | grep voting_portal_test
```

- [ ] **Step 5: Commit**

```bash
git add test/e2e/global-setup.ts test/e2e/helpers/db.ts test/e2e/helpers/reset.ts
git commit -m "feat: add E2E global setup and database helpers"
```

---

## Task 3: Seed helpers

**Files:**
- Create: `test/e2e/helpers/seed.ts`

- [ ] **Step 1: Create `test/e2e/helpers/seed.ts`**

These functions insert test data directly into the database. All return the created records.

```ts
import { v7 as uuidv7 } from "uuid"
import { memberLists, members, topics, user, votes } from "../../../lib/db/schema"
import { testDb } from "./db"

export async function seedUser(
  email: string,
  opts?: { isAdmin?: boolean; name?: string },
) {
  const id = uuidv7()
  const [created] = await testDb
    .insert(user)
    .values({
      email,
      emailVerified: true,
      id,
      isAdmin: opts?.isAdmin ?? false,
      name: opts?.name ?? email.split("@")[0],
    })
    .returning()
  return created
}

export async function seedMemberList(
  name: string,
  emails: string[],
  opts?: { description?: string },
) {
  const [list] = await testDb
    .insert(memberLists)
    .values({
      description: opts?.description ?? null,
      name,
    })
    .returning()

  const seededMembers = []
  for (const email of emails) {
    const [member] = await testDb
      .insert(members)
      .values({
        email,
        memberListId: list.id,
      })
      .returning()
    seededMembers.push(member)
  }

  return { list, members: seededMembers }
}

export async function seedTopic(
  memberListId: string,
  opts?: {
    closesAt?: Date
    description?: string
    isActive?: boolean
    opensAt?: Date
    title?: string
  },
) {
  const now = new Date()
  const [topic] = await testDb
    .insert(topics)
    .values({
      closesAt: opts?.closesAt ?? new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      description: opts?.description ?? "Test topic description",
      isActive: opts?.isActive ?? true,
      memberListId,
      opensAt: opts?.opensAt ?? new Date(now.getTime() - 60 * 60 * 1000),
      title: opts?.title ?? "Test Topic",
    })
    .returning()
  return topic
}

export async function seedVote(
  topicId: string,
  userId: string,
  vote: "yes" | "no",
) {
  const [created] = await testDb
    .insert(votes)
    .values({
      topicId,
      userId,
      vote,
    })
    .returning()
  return created
}
```

- [ ] **Step 2: Commit**

```bash
git add test/e2e/helpers/seed.ts
git commit -m "feat: add E2E seed helpers"
```

---

## Task 4: Auth helper

**Files:**
- Create: `test/e2e/helpers/auth.ts`

- [ ] **Step 1: Create `test/e2e/helpers/auth.ts`**

This authenticates a user via the real magic link flow, reading the token from the DB.

```ts
import { desc, eq } from "drizzle-orm"
import type { Page } from "@playwright/test"
import { verification } from "../../../lib/db/schema"
import { testDb } from "./db"

export async function authenticateAs(page: Page, email: string) {
  // Navigate to sign-in page
  await page.goto("/sign-in")

  // Fill in email and submit
  await page.getByRole("textbox", { name: /email/i }).fill(email)
  await page.getByRole("button", { name: /send login link/i }).click()

  // Wait for the "check your email" confirmation
  await page.getByText("Check your email").waitFor()

  // Read the magic link token from the database
  const [record] = await testDb
    .select()
    .from(verification)
    .where(eq(verification.identifier, email))
    .orderBy(desc(verification.createdAt))
    .limit(1)

  if (!record) {
    throw new Error(`No verification token found for ${email}`)
  }

  // Navigate to the magic link verification URL
  await page.goto(
    `/api/auth/magic-link/verify?token=${record.value}&callbackURL=/`,
  )

  // Wait for redirect to home page (confirms session is active)
  await page.waitForURL("/")
}
```

- [ ] **Step 2: Commit**

```bash
git add test/e2e/helpers/auth.ts
git commit -m "feat: add E2E auth helper"
```

---

## Task 5: Sign-in test

**Files:**
- Create: `test/e2e/specs/sign-in.spec.ts`

- [ ] **Step 1: Write the test**

```ts
import { desc, eq } from "drizzle-orm"
import { expect, test } from "@playwright/test"
import { verification } from "../../../../lib/db/schema"
import { testDb } from "../helpers/db"
import { resetDatabase } from "../helpers/reset"
import { seedMemberList, seedUser } from "../helpers/seed"

test.describe("Sign in", () => {
  test.beforeEach(async () => {
    await resetDatabase()
  })

  test("signs in via magic link for a member", async ({ page }) => {
    // Seed a user who is in a member list
    const member = await seedUser("member@test.com")
    await seedMemberList("Test List", ["member@test.com"])

    // Go to sign-in page
    await page.goto("/sign-in")

    // Fill in email and submit
    await page.getByRole("textbox", { name: /email/i }).fill("member@test.com")
    await page.getByRole("button", { name: /send login link/i }).click()

    // Should show "check your email" message
    await expect(page.getByText("Check your email")).toBeVisible()

    // Read the verification token from the database
    const [record] = await testDb
      .select()
      .from(verification)
      .where(eq(verification.identifier, "member@test.com"))
      .orderBy(desc(verification.createdAt))
      .limit(1)

    expect(record).toBeTruthy()

    // Navigate to the magic link
    await page.goto(
      `/api/auth/magic-link/verify?token=${record.value}&callbackURL=/`,
    )

    // Should be redirected to home page, authenticated
    await page.waitForURL("/")
    await expect(page.getByText("Community Votes")).toBeVisible()
  })

  test("rejects sign-in for a non-member", async ({ page }) => {
    // Seed a user who is NOT in any member list
    await seedUser("outsider@test.com")

    // Go to sign-in page
    await page.goto("/sign-in")

    // Fill in email and submit
    await page.getByRole("textbox", { name: /email/i }).fill("outsider@test.com")
    await page.getByRole("button", { name: /send login link/i }).click()

    // Should show error about not being a member
    await expect(
      page.getByText(/not on any member list/i),
    ).toBeVisible()
  })
})
```

- [ ] **Step 2: Run the test**

```bash
pnpm test:e2e test/e2e/specs/sign-in.spec.ts
```

Expected: Both tests pass. The first verifies the full magic link flow. The second verifies the app rejects non-members with the correct error message.

- [ ] **Step 3: Commit**

```bash
git add test/e2e/specs/sign-in.spec.ts
git commit -m "test: add E2E sign-in flow tests"
```

---

## Task 6: Vote test

**Files:**
- Create: `test/e2e/specs/vote.spec.ts`

- [ ] **Step 1: Write the test**

```ts
import { and, eq } from "drizzle-orm"
import { expect, test } from "@playwright/test"
import { votes } from "../../../../lib/db/schema"
import { authenticateAs } from "../helpers/auth"
import { testDb } from "../helpers/db"
import { resetDatabase } from "../helpers/reset"
import { seedMemberList, seedTopic, seedUser } from "../helpers/seed"

test.describe("Voting", () => {
  test.beforeEach(async () => {
    await resetDatabase()
  })

  test("eligible member can cast a yes vote", async ({ page }) => {
    // Seed data: user in a member list, with an open topic
    const member = await seedUser("voter@test.com")
    const { list } = await seedMemberList("Voters", ["voter@test.com"])
    const topic = await seedTopic(list.id, { title: "Should we do this?" })

    // Authenticate
    await authenticateAs(page, "voter@test.com")

    // Should see the topic on the home page
    await expect(page.getByText("Should we do this?")).toBeVisible()

    // Click "Vote now" to go to the voting page
    await page.getByRole("link", { name: /vote now/i }).click()

    // Cast a yes vote
    await page.getByRole("button", { name: /vote yes/i }).click()

    // Should be redirected to success page
    await page.waitForURL(`/votes/${topic.id}/success**`)
    await expect(page.getByText("Vote recorded")).toBeVisible()

    // Verify vote in database
    const [dbVote] = await testDb
      .select()
      .from(votes)
      .where(and(eq(votes.topicId, topic.id), eq(votes.userId, member.id)))

    expect(dbVote).toBeTruthy()
    expect(dbVote.vote).toBe("yes")
  })
})
```

- [ ] **Step 2: Run the test**

```bash
pnpm test:e2e test/e2e/specs/vote.spec.ts
```

Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add test/e2e/specs/vote.spec.ts
git commit -m "test: add E2E voting flow test"
```

---

## Task 7: Change vote test

**Files:**
- Create: `test/e2e/specs/change-vote.spec.ts`

- [ ] **Step 1: Write the test**

```ts
import { and, eq } from "drizzle-orm"
import { expect, test } from "@playwright/test"
import { votes } from "../../../../lib/db/schema"
import { authenticateAs } from "../helpers/auth"
import { testDb } from "../helpers/db"
import { resetDatabase } from "../helpers/reset"
import {
  seedMemberList,
  seedTopic,
  seedUser,
  seedVote,
} from "../helpers/seed"

test.describe("Change vote", () => {
  test.beforeEach(async () => {
    await resetDatabase()
  })

  test("member can change their vote from yes to no", async ({ page }) => {
    // Seed data: user with an existing yes vote
    const member = await seedUser("changer@test.com")
    const { list } = await seedMemberList("Changers", ["changer@test.com"])
    const topic = await seedTopic(list.id, { title: "Change your mind?" })
    await seedVote(topic.id, member.id, "yes")

    // Authenticate
    await authenticateAs(page, "changer@test.com")

    // Should see the topic with "Change vote" link (not "Vote now")
    await expect(page.getByText("Change your mind?")).toBeVisible()
    await page.getByRole("link", { name: /change vote/i }).click()

    // Should see current vote indicator
    await expect(page.getByText(/you voted yes/i)).toBeVisible()

    // Change vote to no
    await page.getByRole("button", { name: /vote no/i }).click()

    // Should be redirected to success page
    await page.waitForURL(`/votes/${topic.id}/success**`)
    await expect(page.getByText("Vote recorded")).toBeVisible()

    // Verify the vote was updated in the database (not duplicated)
    const dbVotes = await testDb
      .select()
      .from(votes)
      .where(and(eq(votes.topicId, topic.id), eq(votes.userId, member.id)))

    expect(dbVotes).toHaveLength(1)
    expect(dbVotes[0].vote).toBe("no")
  })
})
```

- [ ] **Step 2: Run the test**

```bash
pnpm test:e2e test/e2e/specs/change-vote.spec.ts
```

Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add test/e2e/specs/change-vote.spec.ts
git commit -m "test: add E2E change vote flow test"
```

---

## Task 8: Closed topic test

**Files:**
- Create: `test/e2e/specs/closed-topic.spec.ts`

- [ ] **Step 1: Write the test**

```ts
import { expect, test } from "@playwright/test"
import { authenticateAs } from "../helpers/auth"
import { resetDatabase } from "../helpers/reset"
import { seedMemberList, seedTopic, seedUser } from "../helpers/seed"

test.describe("Closed topic", () => {
  test.beforeEach(async () => {
    await resetDatabase()
  })

  test("cannot vote on a closed topic", async ({ page }) => {
    // Seed data: user in a member list, with a closed topic
    const now = new Date()
    await seedUser("latecomer@test.com")
    const { list } = await seedMemberList("Members", ["latecomer@test.com"])
    const topic = await seedTopic(list.id, {
      closesAt: new Date(now.getTime() - 60 * 60 * 1000), // closed 1 hour ago
      opensAt: new Date(now.getTime() - 48 * 60 * 60 * 1000), // opened 2 days ago
      title: "This vote is over",
    })

    // Authenticate
    await authenticateAs(page, "latecomer@test.com")

    // Navigate to the topic's vote page
    await page.goto(`/votes/${topic.id}`)

    // Should see "Results" heading (closed topics show results)
    await expect(page.getByText("Results")).toBeVisible()

    // Should NOT see vote buttons
    await expect(
      page.getByRole("button", { name: /vote yes/i }),
    ).not.toBeVisible()
    await expect(
      page.getByRole("button", { name: /vote no/i }),
    ).not.toBeVisible()
  })
})
```

- [ ] **Step 2: Run the test**

```bash
pnpm test:e2e test/e2e/specs/closed-topic.spec.ts
```

Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add test/e2e/specs/closed-topic.spec.ts
git commit -m "test: add E2E closed topic test"
```

---

## Task 9: Ineligible voter test

**Files:**
- Create: `test/e2e/specs/ineligible-voter.spec.ts`

- [ ] **Step 1: Write the test**

```ts
import { expect, test } from "@playwright/test"
import { authenticateAs } from "../helpers/auth"
import { resetDatabase } from "../helpers/reset"
import { seedMemberList, seedTopic, seedUser } from "../helpers/seed"

test.describe("Ineligible voter", () => {
  test.beforeEach(async () => {
    await resetDatabase()
  })

  test("user not in topic member list sees ineligible message", async ({
    page,
  }) => {
    // Seed user in list A (so they can sign in)
    await seedUser("wrong-list@test.com")
    await seedMemberList("List A", ["wrong-list@test.com"])

    // Create topic assigned to list B (user is NOT in list B)
    const { list: listB } = await seedMemberList("List B", [
      "other@test.com",
    ])
    const topic = await seedTopic(listB.id, { title: "Not for you" })

    // Authenticate (works because user is in List A)
    await authenticateAs(page, "wrong-list@test.com")

    // Navigate directly to the topic's vote page
    await page.goto(`/votes/${topic.id}`)

    // Should see ineligibility alert
    await expect(
      page.getByText(/not eligible to vote/i),
    ).toBeVisible()

    // Should NOT see vote buttons
    await expect(
      page.getByRole("button", { name: /vote yes/i }),
    ).not.toBeVisible()
  })
})
```

- [ ] **Step 2: Run the test**

```bash
pnpm test:e2e test/e2e/specs/ineligible-voter.spec.ts
```

Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add test/e2e/specs/ineligible-voter.spec.ts
git commit -m "test: add E2E ineligible voter test"
```

---

## Task 10: Admin topics test

**Files:**
- Create: `test/e2e/specs/admin-topics.spec.ts`

- [ ] **Step 1: Write the test**

The admin topics page at `/topics` has a table (TopicsTable component) and a "Create topic" link. The create form at `/topics/create` has fields for title, description, member list (Select), opens at, closes at, and an isActive checkbox.

The edit form at `/topics/[topicId]` has the same fields pre-filled (EditTopicForm component).

Deletion is a soft delete — topics get `deletedAt` set and disappear from the admin list.

```ts
import { expect, test } from "@playwright/test"
import { authenticateAs } from "../helpers/auth"
import { resetDatabase } from "../helpers/reset"
import { seedMemberList, seedUser } from "../helpers/seed"

test.describe("Admin topics", () => {
  test.beforeEach(async () => {
    await resetDatabase()
  })

  test("admin can create, edit, and delete a topic", async ({ page }) => {
    // Seed admin user and a member list (required for topic creation)
    await seedUser("admin@test.com", { isAdmin: true })
    const { list } = await seedMemberList("Test Members", ["admin@test.com"])

    // Authenticate as admin
    await authenticateAs(page, "admin@test.com")

    // Navigate to admin topics page
    await page.goto("/topics")
    await expect(page.getByRole("heading", { name: "Topics" })).toBeVisible()

    // Click "Create topic"
    await page.getByRole("link", { name: /create topic/i }).click()
    await page.waitForURL("/topics/create")

    // Fill in the create topic form
    await page.getByLabel("Title").fill("E2E Test Topic")
    await page.getByLabel("Description").fill("Created by E2E test")

    // Select member list (Radix Select component)
    await page.getByRole("combobox").click()
    await page.getByRole("option", { name: "Test Members" }).click()

    // Set dates
    const now = new Date()
    const opensAt = new Date(now.getTime() - 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16)
    const closesAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16)
    await page.getByLabel("Opens at").fill(opensAt)
    await page.getByLabel("Closes at").fill(closesAt)

    // Check "Active"
    await page.getByLabel(/active/i).check()

    // Submit
    await page.getByRole("button", { name: /create topic/i }).click()

    // Should redirect to topics list
    await page.waitForURL("/topics")
    await expect(page.getByText("E2E Test Topic")).toBeVisible()

    // Click on the topic to edit it
    await page.getByRole("link", { name: "E2E Test Topic" }).click()

    // Edit the title
    await page.getByLabel("Title").fill("E2E Test Topic (Edited)")
    await page.getByRole("button", { name: /save|update/i }).click()

    // Go back to topics list and verify the edit
    await page.goto("/topics")
    await expect(page.getByText("E2E Test Topic (Edited)")).toBeVisible()

    // Delete the topic (click on it, then find the delete button)
    await page.getByRole("link", { name: "E2E Test Topic (Edited)" }).click()

    // Look for a delete button/action on the edit page or topics table
    // The topics table may have a delete action — check the actual UI
    await page.getByRole("button", { name: /delete/i }).click()

    // Confirm deletion if there's a confirmation dialog
    const confirmButton = page.getByRole("button", {
      name: /confirm|delete|yes/i,
    })
    if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await confirmButton.click()
    }

    // Should redirect to topics list without the deleted topic
    await page.waitForURL("/topics")
    await expect(
      page.getByText("E2E Test Topic (Edited)"),
    ).not.toBeVisible()
  })
})
```

Note: The exact selectors for edit/delete may need adjustment based on the actual UI. The topics table and edit form components should be inspected during implementation. The test may need to interact with a table row's action menu or a delete button on the edit page. Adjust selectors as needed.

- [ ] **Step 2: Run the test**

```bash
pnpm test:e2e test/e2e/specs/admin-topics.spec.ts
```

Expected: PASS (may need selector adjustments — see note above)

- [ ] **Step 3: Commit**

```bash
git add test/e2e/specs/admin-topics.spec.ts
git commit -m "test: add E2E admin topics management test"
```

---

## Task 11: Admin member lists test

**Files:**
- Create: `test/e2e/specs/admin-member-lists.spec.ts`

- [ ] **Step 1: Write the test**

The member lists page at `/member-lists` has a table and "Create member list" link. The create form at `/member-lists/create` has name and description fields. The detail page at `/member-lists/[listId]` has tabs: Edit, Members, Topics. The Members tab has an AddMemberForm with an email input. The delete button only appears when the list has no topics.

```ts
import { expect, test } from "@playwright/test"
import { authenticateAs } from "../helpers/auth"
import { resetDatabase } from "../helpers/reset"
import { seedMemberList, seedTopic, seedUser } from "../helpers/seed"

test.describe("Admin member lists", () => {
  test.beforeEach(async () => {
    await resetDatabase()
  })

  test("admin can create a member list and add members", async ({ page }) => {
    // Seed admin user (must be in a member list to sign in)
    await seedUser("admin@test.com", { isAdmin: true })
    await seedMemberList("Admin Access", ["admin@test.com"])

    // Authenticate as admin
    await authenticateAs(page, "admin@test.com")

    // Navigate to member lists page
    await page.goto("/member-lists")
    await expect(
      page.getByRole("heading", { name: "Member Lists" }),
    ).toBeVisible()

    // Create a new member list
    await page.getByRole("link", { name: /create member list/i }).click()
    await page.waitForURL("/member-lists/create")

    await page.getByLabel("Name").fill("E2E Test List")
    await page.getByLabel("Description").fill("Created by E2E test")
    await page.getByRole("button", { name: /create member list/i }).click()

    // Should redirect to the list detail page
    await page.waitForURL(/\/member-lists\//)
    await expect(
      page.getByRole("heading", { name: "E2E Test List" }),
    ).toBeVisible()

    // Switch to Members tab and add a member
    await page.getByRole("tab", { name: /members/i }).click()

    await page
      .getByRole("textbox", { name: /email/i })
      .fill("newmember@test.com")
    await page.getByRole("button", { name: /add/i }).click()

    // Verify the member appears in the table
    await expect(page.getByText("newmember@test.com")).toBeVisible()
  })

  test("cannot delete a member list that has topics", async ({ page }) => {
    // Seed admin and a member list with a topic
    await seedUser("admin@test.com", { isAdmin: true })
    const { list } = await seedMemberList("Has Topics List", [
      "admin@test.com",
    ])

    await seedTopic(list.id, { title: "Linked Topic" })

    // Authenticate as admin
    await authenticateAs(page, "admin@test.com")

    // Navigate to the member list detail page
    await page.goto(`/member-lists/${list.id}`)

    // The delete button should NOT be visible (list has topics)
    await expect(
      page.getByRole("button", { name: /delete/i }),
    ).not.toBeVisible()
  })

  test("can delete a member list with no topics", async ({ page }) => {
    // Seed admin and a member list WITHOUT topics
    await seedUser("admin@test.com", { isAdmin: true })
    const { list } = await seedMemberList("Empty List", ["admin@test.com"])

    // Authenticate as admin
    await authenticateAs(page, "admin@test.com")

    // Navigate to the member list detail page
    await page.goto(`/member-lists/${list.id}`)

    // The delete button should be visible
    await page.getByRole("button", { name: /delete/i }).click()

    // Confirm deletion if dialog appears
    const confirmButton = page.getByRole("button", {
      name: /confirm|delete|yes/i,
    })
    if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await confirmButton.click()
    }

    // Should redirect to member lists page
    await page.waitForURL("/member-lists")
    await expect(page.getByText("Empty List")).not.toBeVisible()
  })
})
```

Note: Same as Task 10 — selectors may need adjustment based on actual UI. The AddMemberForm input, "Add" button text, and delete confirmation dialog should be verified against the actual components.

- [ ] **Step 2: Run the test**

```bash
pnpm test:e2e test/e2e/specs/admin-member-lists.spec.ts
```

Expected: PASS (may need selector adjustments)

- [ ] **Step 3: Commit**

```bash
git add test/e2e/specs/admin-member-lists.spec.ts
git commit -m "test: add E2E admin member lists management tests"
```

---

## Task 12: Run full test suite and fix issues

- [ ] **Step 1: Run all E2E tests**

```bash
pnpm test:e2e
```

Expected: All 10+ tests pass across 7 spec files.

- [ ] **Step 2: Fix any failing tests**

Common issues to watch for:
- **Path alias `@/`**: If imports like `@/lib/db/schema` don't resolve in test files, switch to relative imports (e.g., `../../../lib/db/schema`).
- **Selector mismatches**: If buttons/links have different text than expected, use Playwright's `--debug` flag (`pnpm test:e2e --debug`) or `--ui` mode to inspect the page.
- **Timing**: If actions complete before assertions run, add `waitFor()` calls. If pages are slow to load, increase timeouts.
- **Auth flow**: If Better Auth's magic link verify URL has a different format, check the verification table's `value` column and the auth config for the correct endpoint.

- [ ] **Step 3: Commit any fixes**

```bash
git add -u
git commit -m "fix: resolve E2E test issues from full suite run"
```

---

## Task 13: GitHub Actions CI pipeline

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "pnpm"
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "pnpm"
      - run: pnpm install --frozen-lockfile
      - run: pnpm test

  e2e-tests:
    runs-on: ubuntu-latest
    needs: [lint-and-typecheck, unit-tests]
    services:
      postgres:
        image: postgres:17
        env:
          POSTGRES_USER: kiwiburn
          POSTGRES_PASSWORD: kiwiburn
          POSTGRES_DB: voting_portal
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "pnpm"
      - run: pnpm install --frozen-lockfile
      - run: npx playwright install chromium --with-deps

      - name: Set up E2E environment
        run: |
          cat > .env.test << 'EOF'
          DATABASE_URL=postgresql://kiwiburn:kiwiburn@localhost:5432/voting_portal_test
          BETTER_AUTH_SECRET=test-secret-for-e2e-tests
          BETTER_AUTH_URL=http://localhost:3001
          NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3001
          SMTP_HOST=localhost
          SMTP_PORT=1025
          SMTP_USER=test
          SMTP_PASS=test
          SMTP_FROM=test@kiwiburn.com
          EOF

**Important:** The heredoc content lines above must be flush-left (no leading whitespace) in the actual YAML file. The indentation shown here is for document readability only. In the real `.github/workflows/ci.yml`, the content between `<< 'EOF'` and `EOF` must have no leading spaces, otherwise `dotenv` will parse keys with leading whitespace. The `EOF` delimiter must also be flush-left.

      - name: Run E2E tests
        run: pnpm test:e2e

      - name: Upload Playwright report
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7

      - name: Upload test results
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: test-results/
          retention-days: 7
```

Note: The CI `.env.test` uses port `5432` (the service container's mapped port) instead of `6769` (the local Docker Compose port).

- [ ] **Step 2: Verify the workflow YAML is valid**

```bash
cat .github/workflows/ci.yml | python3 -c "import sys, yaml; yaml.safe_load(sys.stdin.read()); print('Valid YAML')"
```

Expected: "Valid YAML"

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "feat: add GitHub Actions CI pipeline with lint, unit, and E2E tests"
```

---

## Task 14: Final verification

- [ ] **Step 1: Run the full E2E suite one last time**

```bash
pnpm test:e2e
```

Expected: All tests pass.

- [ ] **Step 2: Run lint and typecheck**

```bash
pnpm lint && pnpm typecheck
```

Expected: No errors.

- [ ] **Step 3: Run unit tests to make sure nothing broke**

```bash
pnpm test
```

Expected: All 22 existing tests still pass.

- [ ] **Step 4: Commit any remaining changes**

Only if there are uncommitted fixes from steps 1-3.
