import { randomUUID } from "node:crypto"
import type { Page } from "@playwright/test"
import { eq } from "drizzle-orm"
import { session, user } from "../../../lib/db/schema"
import { testDb } from "./db"

async function signCookieValue(value: string, secret: string) {
  // Match Better Auth's makeSignature: WebCrypto HMAC-SHA256 + btoa
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { hash: "SHA-256", name: "HMAC" },
    false,
    ["sign"],
  )
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value))
  const base64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
  return `${value}.${base64}`
}

export async function authenticateAs(page: Page, email: string) {
  const [userRecord] = await testDb
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1)

  if (!userRecord) {
    throw new Error(`No user found for ${email}. Seed the user first.`)
  }

  const token = randomUUID()
  await testDb.insert(session).values({
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    id: randomUUID(),
    token,
    userId: userRecord.id,
  })

  const secret = process.env.BETTER_AUTH_SECRET!
  const signedToken = await signCookieValue(token, secret)

  await page.context().addCookies([
    {
      domain: "localhost",
      name: "better-auth.session_token",
      path: "/",
      value: signedToken,
    },
  ])

  await page.goto("/")
}
