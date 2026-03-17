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
    const member = await seedUser("member@test.com")
    await seedMemberList("Test List", ["member@test.com"])

    await page.goto("/sign-in")
    await page.getByRole("textbox", { name: /email/i }).fill("member@test.com")
    await page.getByRole("button", { name: /send login link/i }).click()

    await expect(page.getByText("Check your email")).toBeVisible()

    const [record] = await testDb
      .select()
      .from(verification)
      .where(eq(verification.identifier, "member@test.com"))
      .orderBy(desc(verification.createdAt))
      .limit(1)

    expect(record).toBeTruthy()

    await page.goto(
      `/api/auth/magic-link/verify?token=${record.value}&callbackURL=/`,
    )

    await page.waitForURL("/")
    await expect(page.getByText("Community Votes")).toBeVisible()
  })

  test("rejects sign-in for a non-member", async ({ page }) => {
    await seedUser("outsider@test.com")

    await page.goto("/sign-in")
    await page.getByRole("textbox", { name: /email/i }).fill("outsider@test.com")
    await page.getByRole("button", { name: /send login link/i }).click()

    await expect(
      page.getByText(/not on any member list/i),
    ).toBeVisible()
  })
})
