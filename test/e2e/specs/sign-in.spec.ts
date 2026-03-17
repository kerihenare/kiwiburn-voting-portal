import { expect, test } from "@playwright/test"
import { authenticateAs } from "../helpers/auth"
import { resetDatabase } from "../helpers/reset"
import { seedMemberList, seedUser } from "../helpers/seed"

test.describe("Sign in", () => {
  test.beforeEach(async () => {
    await resetDatabase()
  })

  test("member can sign in and see home page", async ({ page }) => {
    await seedUser("member@test.com")
    await seedMemberList("Test List", ["member@test.com"])

    // Use direct session creation (magic link tokens are hashed by Better Auth)
    await authenticateAs(page, "member@test.com")

    await expect(page.getByText("Community Votes")).toBeVisible()
  })

  test("magic link form shows check email message for members", async ({
    page,
  }) => {
    await seedUser("member@test.com")
    await seedMemberList("Test List", ["member@test.com"])

    await page.goto("/sign-in")
    await page.getByRole("textbox", { name: /email/i }).fill("member@test.com")
    await page.getByRole("button", { name: /send login link/i }).click()

    await expect(page.getByText("Check your email")).toBeVisible()
  })

  test("rejects sign-in for a non-member", async ({ page }) => {
    await seedUser("outsider@test.com")

    await page.goto("/sign-in")
    await page
      .getByRole("textbox", { name: /email/i })
      .fill("outsider@test.com")
    await page.getByRole("button", { name: /send login link/i }).click()

    await expect(page.getByText(/not on any member list/i)).toBeVisible()
  })
})
