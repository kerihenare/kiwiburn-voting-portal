import { expect, test } from "@playwright/test"
import { authenticateAs } from "../helpers/auth"
import { resetDatabase } from "../helpers/reset"
import { seedMemberList, seedTopic, seedUser } from "../helpers/seed"

test.describe("Admin member lists", () => {
  test.beforeEach(async () => {
    await resetDatabase()
  })

  test("admin can create a member list and add members", async ({ page }) => {
    await seedUser("admin@test.com", { isAdmin: true })
    await seedMemberList("Admin Access", ["admin@test.com"])

    await authenticateAs(page, "admin@test.com")

    await page.goto("/member-lists")
    await expect(
      page.getByRole("heading", { name: "Member Lists" }),
    ).toBeVisible()

    await page.getByRole("link", { name: /create member list/i }).click()
    await page.waitForURL("/member-lists/create")

    await page.getByLabel("Name").fill("E2E Test List")
    await page.getByLabel("Description").fill("Created by E2E test")
    await page.getByRole("button", { name: /create member list/i }).click()

    await page.waitForURL(/\/member-lists\//)
    await expect(
      page.getByRole("heading", { name: "E2E Test List" }),
    ).toBeVisible()

    await page.getByRole("tab", { name: /members/i }).click()

    await page
      .getByRole("textbox", { name: /email/i })
      .fill("newmember@test.com")
    await page.getByRole("button", { name: /add/i }).click()

    await expect(page.getByText("newmember@test.com")).toBeVisible()
  })

  test("cannot delete a member list that has topics", async ({ page }) => {
    await seedUser("admin@test.com", { isAdmin: true })
    const { list } = await seedMemberList("Has Topics List", ["admin@test.com"])
    await seedTopic(list.id, { title: "Linked Topic" })

    await authenticateAs(page, "admin@test.com")

    await page.goto(`/member-lists/${list.id}`)

    await expect(
      page.getByRole("button", { name: /delete/i }),
    ).not.toBeVisible()
  })

  test("can delete a member list with no topics", async ({ page }) => {
    await seedUser("admin@test.com", { isAdmin: true })
    const { list } = await seedMemberList("Empty List", ["admin@test.com"])

    await authenticateAs(page, "admin@test.com")

    await page.goto(`/member-lists/${list.id}`)

    await page.getByRole("button", { name: /delete/i }).click()

    const confirmButton = page.getByRole("button", {
      name: /confirm|delete|yes/i,
    })
    if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await confirmButton.click()
    }

    await page.waitForURL("/member-lists")
    await expect(page.getByText("Empty List")).not.toBeVisible()
  })
})
