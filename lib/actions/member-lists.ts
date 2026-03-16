"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { memberLists, topics } from "@/lib/db/schema"
import { eq, count } from "drizzle-orm"
import { createMemberListSchema } from "@/lib/validations"
import { revalidatePath } from "next/cache"

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
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
      name: parsed.name,
      description: parsed.description ?? null,
    })
    .returning({ id: memberLists.id })

  revalidatePath("/member-lists")
  return { success: true, id: result[0].id }
}

export async function updateMemberList(
  id: number,
  input: { name: string; description?: string }
) {
  await requireAdmin()
  const parsed = createMemberListSchema.parse(input)

  await db
    .update(memberLists)
    .set({
      name: parsed.name,
      description: parsed.description ?? null,
      updatedAt: new Date(),
    })
    .where(eq(memberLists.id, id))

  revalidatePath("/member-lists")
  revalidatePath(`/member-lists/${id}`)
  return { success: true }
}

export async function deleteMemberList(id: number) {
  await requireAdmin()

  // Check if any topics reference this list
  const topicCount = await db
    .select({ count: count() })
    .from(topics)
    .where(eq(topics.memberListId, id))

  if (topicCount[0].count > 0) {
    throw new Error("Cannot delete a member list that has topics")
  }

  await db.delete(memberLists).where(eq(memberLists.id, id))

  revalidatePath("/member-lists")
  return { success: true }
}
