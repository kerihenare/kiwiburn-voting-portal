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
    const member = await seedUser("voter@test.com")
    const { list } = await seedMemberList("Voters", ["voter@test.com"])
    const topic = await seedTopic(list.id, { title: "Should we do this?" })

    await authenticateAs(page, "voter@test.com")

    await expect(page.getByText("Should we do this?")).toBeVisible()

    await page.getByRole("link", { name: /vote now/i }).click()

    await page.getByRole("button", { name: /vote yes/i }).click()

    await page.waitForURL(`/votes/${topic.id}/success**`)
    await expect(page.getByText("Vote recorded")).toBeVisible()

    const [dbVote] = await testDb
      .select()
      .from(votes)
      .where(and(eq(votes.topicId, topic.id), eq(votes.userId, member.id)))

    expect(dbVote).toBeTruthy()
    expect(dbVote.vote).toBe("yes")
  })
})
