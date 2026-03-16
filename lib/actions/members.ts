"use server"

import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { members } from "@/lib/db/schema"
import { addMemberSchema } from "@/lib/validations"

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user.isAdmin) throw new Error("Unauthorized")
  return session
}

export async function addMember(listId: string, input: { email: string }) {
  await requireAdmin()
  const parsed = addMemberSchema.parse(input)

  try {
    await db.insert(members).values({
      email: parsed.email.toLowerCase(),
      memberListId: listId,
    })
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("unique")) {
      throw new Error("This email is already in the list")
    }
    throw error
  }

  revalidatePath(`/member-lists/${listId}`)
  return { success: true }
}

export async function removeMember(id: string, listId: string) {
  await requireAdmin()

  await db.delete(members).where(eq(members.id, id))

  revalidatePath(`/member-lists/${listId}`)
  return { success: true }
}

export async function uploadMembers(listId: string, emails: string[]) {
  await requireAdmin()

  const emailSchema = z.string().email()
  let added = 0
  let invalid = 0
  let duplicates = 0

  const validEmails: string[] = []
  for (const raw of emails) {
    const email = raw.trim().toLowerCase()
    const result = emailSchema.safeParse(email)
    if (!result.success) {
      invalid++
    } else {
      validEmails.push(email)
    }
  }

  // Check which emails already exist in this list
  const existing = await db
    .select({ email: members.email })
    .from(members)
    .where(eq(members.memberListId, listId))

  const existingSet = new Set(existing.map((e) => e.email))

  const toInsert = validEmails.filter((e) => !existingSet.has(e))
  duplicates = validEmails.length - toInsert.length

  if (toInsert.length > 0) {
    await db
      .insert(members)
      .values(toInsert.map((email) => ({ email, memberListId: listId })))
      .onConflictDoNothing()

    added = toInsert.length
  }

  revalidatePath(`/member-lists/${listId}`)
  return { added, duplicates, invalid }
}
