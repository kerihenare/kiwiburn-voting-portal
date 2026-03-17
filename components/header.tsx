import { headers } from "next/headers"
import Link from "next/link"
import { SignOutButton } from "@/components/sign-out-button"
import { auth } from "@/lib/auth"

export async function Header() {
  const headersList = await headers()
  let session = null
  try {
    session = await auth.api.getSession({ headers: headersList })
  } catch {
    // Stale session cookie — treat as unauthenticated
  }
  const pathname = headersList.get("x-current-path")

  return (
    <header className="bg-[#332d2d] text-white">
      <nav className="container mx-auto px-4 max-w-4xl flex items-center justify-between h-14">
        <div className="flex items-center gap-6">
          <Link
            className="font-bold text-lg rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            href="/"
          >
            Kiwiburn
          </Link>
          {session?.user.isAdmin && (
            <>
              <Link
                className="text-sm text-white/80 hover:text-white rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                href="/member-lists"
              >
                Member Lists
              </Link>
              <Link
                className="text-sm text-white/80 hover:text-white rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                href="/topics"
              >
                Topics
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="text-sm text-white/70">
                {session.user.email}
              </span>
              <SignOutButton />
            </>
          ) : pathname !== "/sign-in" ? (
            <Link
              className="text-sm bg-black/25 text-white px-3 py-1.5 rounded-md hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              href="/sign-in"
            >
              Sign in
            </Link>
          ) : null}
        </div>
      </nav>
    </header>
  )
}
