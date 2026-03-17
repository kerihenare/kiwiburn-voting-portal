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
    await seedUser("wrong-list@test.com")
    await seedMemberList("List A", ["wrong-list@test.com"])

    const { list: listB } = await seedMemberList("List B", ["other@test.com"])
    const topic = await seedTopic(listB.id, { title: "Not for you" })

    await authenticateAs(page, "wrong-list@test.com")

    await page.goto(`/votes/${topic.id}`)

    await expect(page.getByText(/not eligible to vote/i)).toBeVisible()

    await expect(
      page.getByRole("button", { name: /vote yes/i }),
    ).not.toBeVisible()
  })
})
