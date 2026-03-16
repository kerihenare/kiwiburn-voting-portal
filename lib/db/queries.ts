import { and, desc, eq, isNull, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { memberLists, members, topics, user, votes } from "./schema"

export async function getTopicsWithCounts() {
  const results = await db
    .select({
      closesAt: topics.closesAt,
      createdAt: topics.createdAt,
      description: topics.description,
      id: topics.id,
      memberListId: topics.memberListId,
      memberListName: memberLists.name,
      noCount: sql<number>`count(case when ${votes.vote} = 'no' then 1 end)::int`,
      opensAt: topics.opensAt,
      title: topics.title,
      totalVotes: sql<number>`count(${votes.id})::int`,
      yesCount: sql<number>`count(case when ${votes.vote} = 'yes' then 1 end)::int`,
    })
    .from(topics)
    .leftJoin(memberLists, eq(topics.memberListId, memberLists.id))
    .leftJoin(votes, eq(topics.id, votes.topicId))
    .where(isNull(topics.deletedAt))
    .groupBy(topics.id, memberLists.name)
    .orderBy(desc(topics.closesAt))

  return results
}

export async function getTopic(id: string) {
  const result = await db
    .select({
      closesAt: topics.closesAt,
      createdAt: topics.createdAt,
      description: topics.description,
      id: topics.id,
      memberListId: topics.memberListId,
      memberListName: memberLists.name,
      opensAt: topics.opensAt,
      title: topics.title,
    })
    .from(topics)
    .leftJoin(memberLists, eq(topics.memberListId, memberLists.id))
    .where(and(eq(topics.id, id), isNull(topics.deletedAt)))
    .limit(1)

  return result[0] ?? null
}

export async function getVoteResults(topicId: string) {
  const results = await db
    .select({
      noCount: sql<number>`count(case when ${votes.vote} = 'no' then 1 end)::int`,
      totalVotes: sql<number>`count(${votes.id})::int`,
      yesCount: sql<number>`count(case when ${votes.vote} = 'yes' then 1 end)::int`,
    })
    .from(votes)
    .where(eq(votes.topicId, topicId))

  return results[0] ?? { noCount: 0, totalVotes: 0, yesCount: 0 }
}

export async function getUserVoteForTopic(topicId: string, userId: string) {
  const result = await db
    .select({ vote: votes.vote })
    .from(votes)
    .where(and(eq(votes.topicId, topicId), eq(votes.userId, userId)))
    .limit(1)

  return result[0]?.vote ?? null
}

export async function checkEligibility(topicId: string, userId: string) {
  const topic = await getTopic(topicId)
  if (!topic) return { eligible: false, reason: "Topic not found" as const }

  const userResult = await db
    .select({ email: user.email })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1)

  if (!userResult[0])
    return { eligible: false, reason: "User not found" as const }

  const member = await db
    .select({ id: members.id })
    .from(members)
    .where(
      and(
        eq(members.email, userResult[0].email),
        eq(members.memberListId, topic.memberListId),
      ),
    )
    .limit(1)

  if (!member[0]) return { eligible: false, reason: "Not eligible" as const }

  return { eligible: true, reason: null }
}

export async function getMemberListsWithCounts() {
  const results = await db
    .select({
      createdAt: memberLists.createdAt,
      description: memberLists.description,
      id: memberLists.id,
      memberCount: sql<number>`(
        select count(*) from ${members} where ${members.memberListId} = ${memberLists.id}
      )::int`,
      name: memberLists.name,
      topicCount: sql<number>`(
        select count(*) from ${topics} where ${topics.memberListId} = ${memberLists.id} and ${topics.deletedAt} is null
      )::int`,
    })
    .from(memberLists)
    .where(isNull(memberLists.deletedAt))
    .orderBy(desc(memberLists.createdAt))

  return results
}

export async function getMemberList(id: string) {
  const list = await db
    .select()
    .from(memberLists)
    .where(and(eq(memberLists.id, id), isNull(memberLists.deletedAt)))
    .limit(1)

  if (!list[0]) return null

  const listMembers = await db
    .select()
    .from(members)
    .where(eq(members.memberListId, id))
    .orderBy(desc(members.createdAt))

  const listTopics = await db
    .select({
      closesAt: topics.closesAt,
      id: topics.id,
      opensAt: topics.opensAt,
      title: topics.title,
    })
    .from(topics)
    .where(and(eq(topics.memberListId, id), isNull(topics.deletedAt)))

  return { ...list[0], members: listMembers, topics: listTopics }
}

export async function getAllMemberLists() {
  return db
    .select({ id: memberLists.id, name: memberLists.name })
    .from(memberLists)
    .where(isNull(memberLists.deletedAt))
}
