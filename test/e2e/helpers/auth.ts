import { desc, eq } from "drizzle-orm"
import type { Page } from "@playwright/test"
import { verification } from "../../../lib/db/schema"
import { testDb } from "./db"

export async function authenticateAs(page: Page, email: string) {
  await page.goto("/sign-in")

  await page.getByRole("textbox", { name: /email/i }).fill(email)
  await page.getByRole("button", { name: /send login link/i }).click()

  await page.getByText("Check your email").waitFor()

  const [record] = await testDb
    .select()
    .from(verification)
    .where(eq(verification.identifier, email))
    .orderBy(desc(verification.createdAt))
    .limit(1)

  if (!record) {
    throw new Error(`No verification token found for ${email}`)
  }

  await page.goto(
    `/api/auth/magic-link/verify?token=${record.value}&callbackURL=/`,
  )

  await page.waitForURL("/")
}
