"use server"

import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { topics } from "@/lib/db/schema"
import { createTopicSchema } from "@/lib/validations"

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user.isAdmin) throw new Error("Unauthorized")
  return session
}

export async function createTopic(input: {
  title: string
  description?: string
  memberListId: string
  opensAt: string
  closesAt: string
}) {
  await requireAdmin()
  const parsed = createTopicSchema.parse(input)

  await db.insert(topics).values({
    closesAt: new Date(parsed.closesAt),
    description: parsed.description ?? null,
    memberListId: parsed.memberListId,
    opensAt: new Date(parsed.opensAt),
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
    opensAt: string
    closesAt: string
  },
) {
  await requireAdmin()
  const parsed = createTopicSchema.parse(input)

  await db
    .update(topics)
    .set({
      closesAt: new Date(parsed.closesAt),
      description: parsed.description ?? null,
      memberListId: parsed.memberListId,
      opensAt: new Date(parsed.opensAt),
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
  const session = await requireAdmin()

  await db
    .update(topics)
    .set({ deletedAt: new Date(), deletedBy: session.user.id })
    .where(eq(topics.id, id))

  revalidatePath("/topics")
  revalidatePath("/")
  return { success: true }
}
