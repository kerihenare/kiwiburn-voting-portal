import { beforeEach, describe, expect, it, vi } from "vitest"

const { mockGetSession, mockRedirect } = vi.hoisted(() => ({
  mockGetSession: vi.fn(),
  mockRedirect: vi.fn(),
}))

vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession: mockGetSession } },
}))
vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}))
vi.mock("next/navigation", () => ({
  redirect: mockRedirect.mockImplementation((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
}))

import { requireAdmin } from "@/lib/auth-guard"

describe("requireAdmin", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("redirects to /sign-in when no session", async () => {
    mockGetSession.mockResolvedValue(null)
    await expect(requireAdmin()).rejects.toThrow("NEXT_REDIRECT:/sign-in")
    expect(mockRedirect).toHaveBeenCalledWith("/sign-in")
  })

  it("redirects to / when user is not admin", async () => {
    mockGetSession.mockResolvedValue({ user: { isAdmin: false } })
    await expect(requireAdmin()).rejects.toThrow("NEXT_REDIRECT:/")
    expect(mockRedirect).toHaveBeenCalledWith("/")
  })

  it("returns session when user is admin", async () => {
    const session = {
      user: { email: "admin@example.com", id: "user-1", isAdmin: true },
    }
    mockGetSession.mockResolvedValue(session)
    const result = await requireAdmin()
    expect(result).toEqual(session)
    expect(mockRedirect).not.toHaveBeenCalled()
  })
})
