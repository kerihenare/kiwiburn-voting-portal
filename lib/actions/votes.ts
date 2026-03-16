"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { votes, topics, users } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { castVoteSchema } from "@/lib/validations"
import { checkEligibility, getTopic } from "@/lib/db/queries"
import { sendVoteConfirmationEmail } from "@/lib/email"
import { getTopicStatus } from "@/lib/types"

export async function castVote(input: { topicId: number; vote: string }) {
  const parsed = castVoteSchema.parse(input)

  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Not authenticated")

  const topic = await getTopic(parsed.topicId)
  if (!topic) throw new Error("Topic not found")

  const status = getTopicStatus(topic.opensAt, topic.closesAt)
  if (status !== "open") throw new Error("Voting is not open")

  const eligibility = await checkEligibility(parsed.topicId, session.user.id)
  if (!eligibility.eligible) throw new Error("Not eligible to vote")

  await db
    .insert(votes)
    .values({
      topicId: parsed.topicId,
      userId: session.user.id,
      vote: parsed.vote,
    })
    .onConflictDoUpdate({
      target: [votes.topicId, votes.userId],
      set: { vote: parsed.vote, updatedAt: new Date() },
    })

  // Send confirmation email (non-blocking)
  sendVoteConfirmationEmail({
    email: session.user.email,
    topicTitle: topic.title,
    vote: parsed.vote,
  }).catch(console.error)

  return { success: true, vote: parsed.vote }
}
