import { headers } from "next/headers"
import Link from "next/link"
import { SignOutButton } from "@/components/sign-out-button"
import { auth } from "@/lib/auth"
import { glide } from "@/lib/glidepath"

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
    <HeaderBar>
      <Nav>
        <NavLeft>
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
        </NavLeft>
        <NavRight>
          {session ? (
            <>
              <UserEmail>{session.user.email}</UserEmail>
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
        </NavRight>
      </Nav>
    </HeaderBar>
  )
}

const HeaderBar = glide("header", {
  backgroundColor: "bg-[#332d2d]",
  color: "text-white",
})

const Nav = glide("nav", {
  alignItems: "items-center",
  display: "flex",
  height: "h-14",
  justifyContent: "justify-between",
  marginX: "mx-auto",
  maxWidth: "max-w-4xl",
  other: "container",
  paddingX: "px-4",
})

const NavLeft = glide("div", {
  alignItems: "items-center",
  display: "flex",
  gap: "gap-6",
})

const NavRight = glide("div", {
  alignItems: "items-center",
  display: "flex",
  gap: "gap-4",
})

const UserEmail = glide("span", {
  color: "text-white/70",
  fontSize: "text-sm",
})
