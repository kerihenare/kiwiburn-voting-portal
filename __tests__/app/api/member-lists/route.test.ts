import { beforeEach, describe, expect, it, vi } from "vitest"

const { mockGetSession, mockGetAllMemberLists } = vi.hoisted(() => ({
  mockGetAllMemberLists: vi.fn(),
  mockGetSession: vi.fn(),
}))

vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession: mockGetSession } },
}))

vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}))

vi.mock("@/lib/db/queries", () => ({
  getAllMemberLists: mockGetAllMemberLists,
}))

import { GET } from "@/app/api/member-lists/route"

describe("GET /api/member-lists", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns 403 with empty array when no session", async () => {
    mockGetSession.mockResolvedValue(null)
    const res = await GET()
    expect(res.status).toBe(403)
    const body = await res.json()
    expect(body).toEqual([])
  })

  it("returns 403 when user is not admin", async () => {
    mockGetSession.mockResolvedValue({ user: { isAdmin: false } })
    const res = await GET()
    expect(res.status).toBe(403)
    const body = await res.json()
    expect(body).toEqual([])
  })

  it("returns member lists when user is admin", async () => {
    mockGetSession.mockResolvedValue({ user: { isAdmin: true } })
    const lists = [
      { id: 1, name: "List A" },
      { id: 2, name: "List B" },
    ]
    mockGetAllMemberLists.mockResolvedValue(lists)

    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual(lists)
  })
})
