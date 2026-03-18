import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export async function requireAdmin() {
  let session = null
  try {
    session = await auth.api.getSession({ headers: await headers() })
  } catch {
    // Stale session cookie — treat as unauthenticated
  }

  if (!session) {
    redirect("/sign-in")
  }

  if (!session.user.isAdmin) {
    redirect("/")
  }

  return session
}
