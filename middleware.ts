import { type NextRequest, NextResponse } from "next/server"

const adminRoutes = ["/member-lists", "/topics"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminRoute = adminRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )

  const response = NextResponse.next()
  response.headers.set("x-current-path", pathname)

  if (!isAdminRoute) {
    return response
  }

  // Lightweight cookie check in middleware (edge-compatible).
  // Full auth + admin verification happens in the page/layout server components.
  const sessionCookie = request.cookies.get("better-auth.session_token")

  if (!sessionCookie?.value) {
    const signInUrl = new URL("/sign-in", request.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
