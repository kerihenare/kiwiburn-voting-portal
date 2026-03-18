"use server"

import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { checkEligibility, getTopic } from "@/lib/db/queries"
import { votes } from "@/lib/db/schema"
import { sendVoteConfirmationEmail } from "@/lib/email"
import { getTopicStatus } from "@/lib/types"
import { castVoteSchema } from "@/lib/validations"

export async function castVote(input: { topicId: string; vote: string }) {
  const parsed = castVoteSchema.parse(input)

  let session = null
  try {
    session = await auth.api.getSession({ headers: await headers() })
  } catch {
    // Stale session cookie — treat as unauthenticated
  }
  if (!session) throw new Error("Not authenticated")

  const topic = await getTopic(parsed.topicId)
  if (!topic || !topic.isActive) throw new Error("Topic not found")

  const status = getTopicStatus(topic.opensAt, topic.closesAt)
  if (status !== "open") throw new Error("Voting is not open")

  const eligibility = await checkEligibility(
    topic.memberListId,
    session.user.id,
  )
  if (!eligibility.eligible) throw new Error("Not eligible to vote")

  await db
    .insert(votes)
    .values({
      topicId: parsed.topicId,
      userId: session.user.id,
      vote: parsed.vote,
    })
    .onConflictDoUpdate({
      set: { updatedAt: new Date(), vote: parsed.vote },
      target: [votes.topicId, votes.userId],
    })

  // Send confirmation email (non-blocking)
  sendVoteConfirmationEmail({
    email: session.user.email,
    topicId: parsed.topicId,
    topicTitle: topic.title,
    vote: parsed.vote,
  }).catch(console.error)

  return { success: true, vote: parsed.vote }
}
