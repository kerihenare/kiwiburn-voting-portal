"use server"

import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { db } from "@/lib/db"
import { members } from "@/lib/db/schema"
import { addMemberSchema, uuidSchema } from "@/lib/validations"
import { requireActionAdmin } from "./auth"

export async function addMember(listId: string, input: { email: string }) {
  await requireActionAdmin()
  uuidSchema.parse(listId)
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
  await requireActionAdmin()
  uuidSchema.parse(id)

  await db.delete(members).where(eq(members.id, id))

  revalidatePath(`/member-lists/${listId}`)
  return { success: true }
}

const MAX_UPLOAD_SIZE = 10_000

export async function uploadMembers(listId: string, emails: string[]) {
  await requireActionAdmin()

  uuidSchema.parse(listId)

  if (emails.length > MAX_UPLOAD_SIZE) {
    throw new Error(
      `Upload limited to ${MAX_UPLOAD_SIZE.toLocaleString()} emails at a time`,
    )
  }

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
