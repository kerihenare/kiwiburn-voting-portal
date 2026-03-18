import { headers } from "next/headers"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { glide } from "@/lib/glidepath"

export async function AdminNav() {
  const headersList = await headers()

  let session = null

  try {
    session = await auth.api.getSession({ headers: headersList })
  } catch {
    // Stale session cookie — treat as unauthenticated
  }

  if (!session?.user.isAdmin) {
    return null
  }

  return (
    <>
      <AdminLink href="/member-lists">Member Lists</AdminLink>
      <AdminLink href="/topics">Topics</AdminLink>
    </>
  )
}

const AdminLink = glide(Link, {
  borderRadius: "rounded-sm",
  color: ["text-white/80", "hover:text-white"],
  fontSize: "text-sm",
  outlineStyle: "focus-visible:outline-none",
  ringColor: "focus-visible:ring-white/70",
  ringWidth: "focus-visible:ring-2",
})
