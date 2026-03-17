import { expect, test } from "@playwright/test"
import { authenticateAs } from "../helpers/auth"
import { resetDatabase } from "../helpers/reset"
import { seedMemberList, seedUser } from "../helpers/seed"

test.describe("Admin topics", () => {
  test.beforeEach(async () => {
    await resetDatabase()
  })

  test("admin can create, edit, and delete a topic", async ({ page }) => {
    await seedUser("admin@test.com", { isAdmin: true })
    const { list: _list } = await seedMemberList("Test Members", [
      "admin@test.com",
    ])

    await authenticateAs(page, "admin@test.com")

    await page.goto("/topics")
    await expect(page.getByRole("heading", { name: "Topics" })).toBeVisible()

    await page.getByRole("link", { name: /create topic/i }).click()
    await page.waitForURL("/topics/create")

    await page.getByLabel("Title").fill("E2E Test Topic")
    await page.getByLabel("Description").fill("Created by E2E test")

    await page.getByRole("combobox").click()
    await page.getByRole("option", { name: "Test Members" }).click()

    const now = new Date()
    const opensAt = new Date(now.getTime() - 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16)
    const closesAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16)
    await page.getByLabel("Opens at").fill(opensAt)
    await page.getByLabel("Closes at").fill(closesAt)

    await page.getByLabel(/active/i).check()

    await page.getByRole("button", { name: /create topic/i }).click()

    await page.waitForURL("/topics")
    await expect(page.getByText("E2E Test Topic")).toBeVisible()

    await page.getByText("E2E Test Topic").click()

    await page.getByLabel("Title").fill("E2E Test Topic (Edited)")
    await page.getByRole("button", { name: /save|update/i }).click()
    await expect(
      page.getByRole("button", { name: /update topic/i }),
    ).toBeVisible()

    await page.goto("/topics")
    await expect(page.getByText("E2E Test Topic (Edited)")).toBeVisible()

    await page.getByText("E2E Test Topic (Edited)").click()

    await page.getByRole("button", { name: /delete topic/i }).click()

    await page
      .getByRole("alertdialog")
      .getByRole("button", { name: /delete/i })
      .click()

    await page.waitForURL("/topics")
    await expect(page.getByText("E2E Test Topic (Edited)")).not.toBeVisible()
  })
})
