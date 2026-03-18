"use server"

import { and, count, eq, isNull } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { memberLists, topics } from "@/lib/db/schema"
import { createMemberListSchema } from "@/lib/validations"

const uuidSchema = z.string().uuid()

async function requireAdmin() {
  let session = null
  try {
    session = await auth.api.getSession({ headers: await headers() })
  } catch {
    // Stale session cookie — treat as unauthenticated
  }
  if (!session?.user.isAdmin) throw new Error("Unauthorized")
  return session
}

export async function createMemberList(input: {
  name: string
  description?: string
}) {
  await requireAdmin()
  const parsed = createMemberListSchema.parse(input)

  const result = await db
    .insert(memberLists)
    .values({
      description: parsed.description ?? null,
      name: parsed.name,
    })
    .returning({ id: memberLists.id })

  revalidatePath("/member-lists")
  return { id: result[0].id, success: true }
}

export async function updateMemberList(
  id: string,
  input: { name: string; description?: string },
) {
  await requireAdmin()
  uuidSchema.parse(id)
  const parsed = createMemberListSchema.parse(input)

  await db
    .update(memberLists)
    .set({
      description: parsed.description ?? null,
      name: parsed.name,
      updatedAt: new Date(),
    })
    .where(eq(memberLists.id, id))

  revalidatePath("/member-lists")
  revalidatePath(`/member-lists/${id}`)
  return { success: true }
}

export async function deleteMemberList(id: string) {
  const session = await requireAdmin()
  uuidSchema.parse(id)

  // Check if any non-deleted topics reference this list
  const topicCount = await db
    .select({ count: count() })
    .from(topics)
    .where(and(eq(topics.memberListId, id), isNull(topics.deletedAt)))

  if (topicCount[0].count > 0) {
    throw new Error("Cannot delete a member list that has topics")
  }

  await db
    .update(memberLists)
    .set({ deletedAt: new Date(), deletedBy: session.user.id })
    .where(eq(memberLists.id, id))

  revalidatePath("/member-lists")
  return { success: true }
}
