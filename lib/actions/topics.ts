"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { topics } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { createTopicSchema } from "@/lib/validations"
import { revalidatePath } from "next/cache"

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user.isAdmin) throw new Error("Unauthorized")
  return session
}

export async function createTopic(input: {
  title: string
  description?: string
  memberListId: number
  opensAt: string
  closesAt: string
}) {
  await requireAdmin()
  const parsed = createTopicSchema.parse(input)

  await db.insert(topics).values({
    title: parsed.title,
    description: parsed.description ?? null,
    memberListId: parsed.memberListId,
    opensAt: new Date(parsed.opensAt),
    closesAt: new Date(parsed.closesAt),
  })

  revalidatePath("/topics")
  revalidatePath("/")
  return { success: true }
}

export async function updateTopic(
  id: number,
  input: {
    title: string
    description?: string
    memberListId: number
    opensAt: string
    closesAt: string
  }
) {
  await requireAdmin()
  const parsed = createTopicSchema.parse(input)

  await db
    .update(topics)
    .set({
      title: parsed.title,
      description: parsed.description ?? null,
      memberListId: parsed.memberListId,
      opensAt: new Date(parsed.opensAt),
      closesAt: new Date(parsed.closesAt),
      updatedAt: new Date(),
    })
    .where(eq(topics.id, id))

  revalidatePath("/topics")
  revalidatePath(`/topics/${id}`)
  revalidatePath("/")
  return { success: true }
}

export async function deleteTopic(id: number) {
  await requireAdmin()

  await db.delete(topics).where(eq(topics.id, id))

  revalidatePath("/topics")
  revalidatePath("/")
  return { success: true }
}
