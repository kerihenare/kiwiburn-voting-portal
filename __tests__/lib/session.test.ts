import { beforeEach, describe, expect, it, vi } from "vitest"

const { mockGetSession } = vi.hoisted(() => ({
  mockGetSession: vi.fn(),
}))

vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession: mockGetSession } },
}))
vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}))

// React.cache is a no-op in test — it just calls through
vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>()
  return { ...actual, cache: (fn: Function) => fn }
})

import { getSession } from "@/lib/session"

describe("getSession", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns session when auth succeeds", async () => {
    const session = {
      user: { email: "test@example.com", id: "user-1", isAdmin: false },
    }
    mockGetSession.mockResolvedValue(session)
    const result = await getSession()
    expect(result).toEqual(session)
  })

  it("returns null when auth throws (stale session cookie)", async () => {
    mockGetSession.mockRejectedValue(new Error("Invalid session"))
    const result = await getSession()
    expect(result).toBeNull()
  })
})
