import { db } from "@/lib/db"
import { eq, and, sql, count, desc } from "drizzle-orm"
import { topics, votes, members, memberLists, users } from "./schema"

export async function getTopicsWithCounts() {
  const results = await db
    .select({
      id: topics.id,
      title: topics.title,
      description: topics.description,
      memberListId: topics.memberListId,
      memberListName: memberLists.name,
      opensAt: topics.opensAt,
      closesAt: topics.closesAt,
      createdAt: topics.createdAt,
      yesCount: sql<number>`count(case when ${votes.vote} = 'yes' then 1 end)::int`,
      noCount: sql<number>`count(case when ${votes.vote} = 'no' then 1 end)::int`,
      totalVotes: sql<number>`count(${votes.id})::int`,
    })
    .from(topics)
    .leftJoin(memberLists, eq(topics.memberListId, memberLists.id))
    .leftJoin(votes, eq(topics.id, votes.topicId))
    .groupBy(topics.id, memberLists.name)
    .orderBy(desc(topics.closesAt))

  return results
}

export async function getTopic(id: number) {
  const result = await db
    .select({
      id: topics.id,
      title: topics.title,
      description: topics.description,
      memberListId: topics.memberListId,
      memberListName: memberLists.name,
      opensAt: topics.opensAt,
      closesAt: topics.closesAt,
      createdAt: topics.createdAt,
    })
    .from(topics)
    .leftJoin(memberLists, eq(topics.memberListId, memberLists.id))
    .where(eq(topics.id, id))
    .limit(1)

  return result[0] ?? null
}

export async function getVoteResults(topicId: number) {
  const results = await db
    .select({
      yesCount: sql<number>`count(case when ${votes.vote} = 'yes' then 1 end)::int`,
      noCount: sql<number>`count(case when ${votes.vote} = 'no' then 1 end)::int`,
      totalVotes: sql<number>`count(${votes.id})::int`,
    })
    .from(votes)
    .where(eq(votes.topicId, topicId))

  return results[0] ?? { yesCount: 0, noCount: 0, totalVotes: 0 }
}

export async function getUserVoteForTopic(topicId: number, userId: string) {
  const result = await db
    .select({ vote: votes.vote })
    .from(votes)
    .where(and(eq(votes.topicId, topicId), eq(votes.userId, userId)))
    .limit(1)

  return result[0]?.vote ?? null
}

export async function checkEligibility(topicId: number, userId: string) {
  const topic = await getTopic(topicId)
  if (!topic) return { eligible: false, reason: "Topic not found" as const }

  const user = await db
    .select({ email: users.email })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (!user[0]) return { eligible: false, reason: "User not found" as const }

  const member = await db
    .select({ id: members.id })
    .from(members)
    .where(
      and(
        eq(members.email, user[0].email),
        eq(members.memberListId, topic.memberListId)
      )
    )
    .limit(1)

  if (!member[0]) return { eligible: false, reason: "Not eligible" as const }

  return { eligible: true, reason: null }
}

export async function getMemberListsWithCounts() {
  const results = await db
    .select({
      id: memberLists.id,
      name: memberLists.name,
      description: memberLists.description,
      createdAt: memberLists.createdAt,
      memberCount: sql<number>`(
        select count(*) from ${members} where ${members.memberListId} = ${memberLists.id}
      )::int`,
      topicCount: sql<number>`(
        select count(*) from ${topics} where ${topics.memberListId} = ${memberLists.id}
      )::int`,
    })
    .from(memberLists)
    .orderBy(desc(memberLists.createdAt))

  return results
}

export async function getMemberList(id: number) {
  const list = await db
    .select()
    .from(memberLists)
    .where(eq(memberLists.id, id))
    .limit(1)

  if (!list[0]) return null

  const listMembers = await db
    .select()
    .from(members)
    .where(eq(members.memberListId, id))
    .orderBy(desc(members.createdAt))

  const listTopics = await db
    .select({
      id: topics.id,
      title: topics.title,
      opensAt: topics.opensAt,
      closesAt: topics.closesAt,
    })
    .from(topics)
    .where(eq(topics.memberListId, id))

  return { ...list[0], members: listMembers, topics: listTopics }
}

export async function getAllMemberLists() {
  return db.select({ id: memberLists.id, name: memberLists.name }).from(memberLists)
}
