import { headers } from "next/headers"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { glide } from "@/lib/glidepath"
import { SignOutButton } from "./sign-out-button"

export async function User() {
  const headersList = await headers()
  const pathname = headersList.get("x-current-path")

  let session = null
  try {
    session = await auth.api.getSession({ headers: headersList })
  } catch {
    // Stale session cookie — treat as unauthenticated
  }

  if (!session?.user.email) {
    if (pathname === "/sign-in") {
      return null
    }

    return <SignInButton href="/sign-in">Sign in</SignInButton>
  }

  return (
    <>
      <UserEmail>{session.user.email}</UserEmail>
      <SignOutButton />
    </>
  )
}

const SignInButton = glide(Link, {
  backgroundColor: ["bg-black/25", "hover:bg-black/50"],
  borderRadius: "rounded-md",
  color: "text-white",
  fontSize: "text-sm",
  outlineStyle: "focus-visible:outline-none",
  paddingX: "px-3",
  paddingY: "py-1.5",
  ringColor: "focus-visible:ring-white/70",
  ringWidth: "focus-visible:ring-2",
})

const UserEmail = glide("span", {
  color: "text-white/70",
  display: ["hidden", "sm:inline"],
  fontSize: "text-sm",
})
