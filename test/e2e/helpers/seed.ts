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
