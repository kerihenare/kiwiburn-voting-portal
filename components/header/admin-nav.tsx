import Link from "next/link"
import { glide } from "@/lib/glidepath"
import { getSession } from "@/lib/session"

export async function AdminNav() {
  const session = await getSession()

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
