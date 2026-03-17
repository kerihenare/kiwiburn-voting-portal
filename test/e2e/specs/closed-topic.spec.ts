import { expect, test } from "@playwright/test"
import { authenticateAs } from "../helpers/auth"
import { resetDatabase } from "../helpers/reset"
import { seedMemberList, seedTopic, seedUser } from "../helpers/seed"

test.describe("Closed topic", () => {
  test.beforeEach(async () => {
    await resetDatabase()
  })

  test("cannot vote on a closed topic", async ({ page }) => {
    const now = new Date()
    await seedUser("latecomer@test.com")
    const { list } = await seedMemberList("Members", ["latecomer@test.com"])
    const topic = await seedTopic(list.id, {
      closesAt: new Date(now.getTime() - 60 * 60 * 1000),
      opensAt: new Date(now.getTime() - 48 * 60 * 60 * 1000),
      title: "This vote is over",
    })

    await authenticateAs(page, "latecomer@test.com")

    await page.goto(`/votes/${topic.id}`)

    await expect(page.getByText("Results")).toBeVisible()

    await expect(
      page.getByRole("button", { name: /vote yes/i }),
    ).not.toBeVisible()
    await expect(
      page.getByRole("button", { name: /vote no/i }),
    ).not.toBeVisible()
  })
})
