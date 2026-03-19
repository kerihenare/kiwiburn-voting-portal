"use server"

import { and, count, eq, isNull } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { memberLists, topics } from "@/lib/db/schema"
import { createMemberListSchema, uuidSchema } from "@/lib/validations"
import { requireActionAdmin } from "./auth"

export async function createMemberList(input: {
  name: string
  description?: string
}) {
  await requireActionAdmin()
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
  await requireActionAdmin()
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
  const session = await requireActionAdmin()
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
