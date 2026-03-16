import Link from "next/link"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { SignOutButton } from "@/components/sign-out-button"

export async function Header() {
  const session = await auth.api.getSession({ headers: await headers() })

  return (
    <header className="bg-[#332d2d] text-white">
      <nav className="container mx-auto px-4 max-w-4xl flex items-center justify-between h-14">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-lg">
            Kiwiburn
          </Link>
          {session?.user.isAdmin && (
            <>
              <Link
                href="/member-lists"
                className="text-sm text-white/80 hover:text-white"
              >
                Member Lists
              </Link>
              <Link
                href="/topics"
                className="text-sm text-white/80 hover:text-white"
              >
                Topics
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="text-sm text-white/70">{session.user.email}</span>
              <SignOutButton />
            </>
          ) : (
            <Link
              href="/sign-in"
              className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:opacity-90"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
