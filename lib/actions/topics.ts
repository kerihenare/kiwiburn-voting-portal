"use server"

import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { topics } from "@/lib/db/schema"
import { createTopicSchema, uuidSchema } from "@/lib/validations"
import { requireActionAdmin } from "./auth"

export async function createTopic(input: {
  title: string
  description?: string
  memberListId: string
  opensAt?: string
  closesAt?: string
  isActive?: boolean
}) {
  await requireActionAdmin()
  const parsed = createTopicSchema.parse(input)

  await db.insert(topics).values({
    closesAt: parsed.closesAt ? new Date(parsed.closesAt) : null,
    description: parsed.description ?? null,
    isActive: parsed.isActive ?? false,
    memberListId: parsed.memberListId,
    opensAt: parsed.opensAt ? new Date(parsed.opensAt) : null,
    title: parsed.title,
  })

  revalidatePath("/topics")
  revalidatePath("/")
  return { success: true }
}

export async function updateTopic(
  id: string,
  input: {
    title: string
    description?: string
    memberListId: string
    opensAt?: string
    closesAt?: string
    isActive?: boolean
  },
) {
  await requireActionAdmin()
  uuidSchema.parse(id)
  const parsed = createTopicSchema.parse(input)

  await db
    .update(topics)
    .set({
      closesAt: parsed.closesAt ? new Date(parsed.closesAt) : null,
      description: parsed.description ?? null,
      isActive: parsed.isActive ?? false,
      memberListId: parsed.memberListId,
      opensAt: parsed.opensAt ? new Date(parsed.opensAt) : null,
      title: parsed.title,
      updatedAt: new Date(),
    })
    .where(eq(topics.id, id))

  revalidatePath("/topics")
  revalidatePath(`/topics/${id}`)
  revalidatePath("/")
  return { success: true }
}

export async function deleteTopic(id: string) {
  const session = await requireActionAdmin()
  uuidSchema.parse(id)

  await db
    .update(topics)
    .set({ deletedAt: new Date(), deletedBy: session.user.id })
    .where(eq(topics.id, id))

  revalidatePath("/topics")
  revalidatePath("/")
  return { success: true }
}
