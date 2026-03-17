import { and, eq } from "drizzle-orm"
import { expect, test } from "@playwright/test"
import { votes } from "../../../lib/db/schema"
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
    const member = await seedUser("changer@test.com")
    const { list } = await seedMemberList("Changers", ["changer@test.com"])
    const topic = await seedTopic(list.id, { title: "Change your mind?" })
    await seedVote(topic.id, member.id, "yes")

    await authenticateAs(page, "changer@test.com")

    await expect(page.getByText("Change your mind?")).toBeVisible()
    await page.getByRole("link", { name: /change vote/i }).click()

    await expect(page.getByText(/you voted yes/i)).toBeVisible()

    await page.getByRole("button", { name: /vote no/i }).click()

    await page.waitForURL(`/votes/${topic.id}/success**`)
    await expect(page.getByText("Vote recorded")).toBeVisible()

    const dbVotes = await testDb
      .select()
      .from(votes)
      .where(and(eq(votes.topicId, topic.id), eq(votes.userId, member.id)))

    expect(dbVotes).toHaveLength(1)
    expect(dbVotes[0].vote).toBe("no")
  })
})
