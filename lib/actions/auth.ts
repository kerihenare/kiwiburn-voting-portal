import { headers } from "next/headers"
import { auth } from "@/lib/auth"

export async function requireActionSession() {
  let session = null
  try {
    session = await auth.api.getSession({ headers: await headers() })
  } catch {
    // Stale session cookie — treat as unauthenticated
  }
  if (!session) throw new Error("Not authenticated")
  return session
}

export async function requireActionAdmin() {
  const session = await requireActionSession()
  if (!session.user.isAdmin) throw new Error("Unauthorized")
  return session
}
