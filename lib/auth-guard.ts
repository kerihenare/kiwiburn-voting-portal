import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"

export async function requireAdmin() {
  const session = await getSession()

  if (!session) {
    redirect("/sign-in")
  }

  if (!session.user.isAdmin) {
    redirect("/")
  }

  return session
}
