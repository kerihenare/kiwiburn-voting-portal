import { NextRequest } from "next/server"
import { describe, expect, it } from "vitest"
import { proxy } from "@/proxy"

function createRequest(
  pathname: string,
  cookies: Record<string, string> = {},
): NextRequest {
  const url = new URL(pathname, "http://localhost:3000")
  const req = new NextRequest(url)
  for (const [name, value] of Object.entries(cookies)) {
    req.cookies.set(name, value)
  }
  return req
}

describe("middleware", () => {
  it("passes through non-admin routes", () => {
    const req = createRequest("/")
    const res = proxy(req)
    expect(res.headers.get("x-middleware-next")).toBe("1")
  })

  it("passes through non-admin routes like /votes/1", () => {
    const req = createRequest("/votes/1")
    const res = proxy(req)
    expect(res.headers.get("x-middleware-next")).toBe("1")
  })

  it("redirects to sign-in when no session cookie on /member-lists", () => {
    const req = createRequest("/member-lists")
    const res = proxy(req)
    expect(res.status).toBe(307)
    const location = new URL(res.headers.get("location")!)
    expect(location.pathname).toBe("/sign-in")
    expect(location.searchParams.get("callbackUrl")).toBe("/member-lists")
  })

  it("redirects to sign-in when no session cookie on /topics", () => {
    const req = createRequest("/topics")
    const res = proxy(req)
    expect(res.status).toBe(307)
    const location = new URL(res.headers.get("location")!)
    expect(location.pathname).toBe("/sign-in")
    expect(location.searchParams.get("callbackUrl")).toBe("/topics")
  })

  it("redirects to sign-in when no session cookie on /topics/new (sub-route)", () => {
    const req = createRequest("/topics/new")
    const res = proxy(req)
    expect(res.status).toBe(307)
    const location = new URL(res.headers.get("location")!)
    expect(location.pathname).toBe("/sign-in")
    expect(location.searchParams.get("callbackUrl")).toBe("/topics/new")
  })

  it("passes through admin route when session cookie exists", () => {
    const req = createRequest("/member-lists", {
      "better-auth.session_token": "some-token",
    })
    const res = proxy(req)
    expect(res.headers.get("x-middleware-next")).toBe("1")
  })

  it("passes through admin sub-route when session cookie exists", () => {
    const req = createRequest("/topics/123/edit", {
      "better-auth.session_token": "some-token",
    })
    const res = proxy(req)
    expect(res.headers.get("x-middleware-next")).toBe("1")
  })
})
