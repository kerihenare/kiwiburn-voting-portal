import { beforeEach, describe, expect, it, vi } from "vitest"

const { mockDb, mockGetSession, mockRevalidatePath } = vi.hoisted(() => ({
  mockDb: {
    delete: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue([]),
    onConflictDoNothing: vi.fn().mockResolvedValue(undefined),
    onConflictDoUpdate: vi.fn().mockResolvedValue(undefined),
    returning: vi
      .fn()
      .mockResolvedValue([{ id: "019506a0-0000-7000-8000-000000000002" }]),
    select: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValue(undefined),
  },
  mockGetSession: vi.fn(),
  mockRevalidatePath: vi.fn(),
}))

vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession: mockGetSession } },
}))
vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}))
vi.mock("@/lib/db", () => ({ db: mockDb }))
vi.mock("@/lib/db/schema", () => ({ memberLists: {}, topics: {} }))
vi.mock("drizzle-orm", () => ({
  and: vi.fn(),
  count: vi.fn(),
  eq: vi.fn(),
  isNull: vi.fn(),
}))
vi.mock("next/cache", () => ({
  revalidatePath: mockRevalidatePath,
}))

import {
  createMemberList,
  deleteMemberList,
  updateMemberList,
} from "@/lib/actions/member-lists"

const memberListId = "019506a0-0000-7000-8000-000000000002"

const adminSession = {
  user: { email: "test@example.com", id: "user-1", isAdmin: true },
}

describe("createMemberList", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDb.insert.mockReturnThis()
    mockDb.values.mockReturnThis()
    mockDb.returning.mockResolvedValue([{ id: memberListId }])
  })

  it("throws when no session", async () => {
    mockGetSession.mockResolvedValue(null)
    await expect(createMemberList({ name: "Test List" })).rejects.toThrow(
      "Not authenticated",
    )
  })

  it("throws when user is not admin", async () => {
    mockGetSession.mockResolvedValue({
      user: { email: "test@example.com", id: "user-1", isAdmin: false },
    })
    await expect(createMemberList({ name: "Test List" })).rejects.toThrow(
      "Unauthorized",
    )
  })

  it("throws on validation error (empty name)", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    await expect(createMemberList({ name: "" })).rejects.toThrow()
  })

  it("creates member list successfully", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    const result = await createMemberList({
      description: "A test list",
      name: "Test List",
    })

    expect(result).toEqual({ id: memberListId, success: true })
    expect(mockDb.insert).toHaveBeenCalled()
    expect(mockDb.values).toHaveBeenCalledWith({
      description: "A test list",
      name: "Test List",
    })
    expect(mockDb.returning).toHaveBeenCalled()
    expect(mockRevalidatePath).toHaveBeenCalledWith("/member-lists")
  })

  it("sets description to null when not provided", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    await createMemberList({ name: "Test List" })

    expect(mockDb.values).toHaveBeenCalledWith({
      description: null,
      name: "Test List",
    })
  })
})

describe("updateMemberList", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDb.update.mockReturnThis()
    mockDb.set.mockReturnThis()
    mockDb.where.mockResolvedValue(undefined)
  })

  it("throws when no session", async () => {
    mockGetSession.mockResolvedValue(null)
    await expect(
      updateMemberList(memberListId, { name: "Updated" }),
    ).rejects.toThrow("Not authenticated")
  })

  it("throws when user is not admin", async () => {
    mockGetSession.mockResolvedValue({
      user: { email: "test@example.com", id: "user-1", isAdmin: false },
    })
    await expect(
      updateMemberList(memberListId, { name: "Updated" }),
    ).rejects.toThrow("Unauthorized")
  })

  it("throws on validation error (empty name)", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    await expect(updateMemberList(memberListId, { name: "" })).rejects.toThrow()
  })

  it("updates member list successfully", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    const result = await updateMemberList(memberListId, {
      description: "Updated desc",
      name: "Updated List",
    })

    expect(result).toEqual({ success: true })
    expect(mockDb.update).toHaveBeenCalled()
    expect(mockDb.set).toHaveBeenCalledWith(
      expect.objectContaining({
        description: "Updated desc",
        name: "Updated List",
      }),
    )
    expect(mockDb.where).toHaveBeenCalled()
    expect(mockRevalidatePath).toHaveBeenCalledWith("/member-lists")
    expect(mockRevalidatePath).toHaveBeenCalledWith(
      `/member-lists/${memberListId}`,
    )
  })

  it("sets description to null when not provided", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    await updateMemberList(memberListId, { name: "Updated List" })

    expect(mockDb.set).toHaveBeenCalledWith(
      expect.objectContaining({ description: null }),
    )
  })
})

describe("deleteMemberList", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDb.select.mockReturnThis()
    mockDb.from.mockReturnThis()
    mockDb.where.mockResolvedValue([{ count: 0 }])
    mockDb.update.mockReturnThis()
    mockDb.set.mockReturnThis()
  })

  it("throws when no session", async () => {
    mockGetSession.mockResolvedValue(null)
    await expect(deleteMemberList(memberListId)).rejects.toThrow(
      "Not authenticated",
    )
  })

  it("throws when user is not admin", async () => {
    mockGetSession.mockResolvedValue({
      user: { email: "test@example.com", id: "user-1", isAdmin: false },
    })
    await expect(deleteMemberList(memberListId)).rejects.toThrow("Unauthorized")
  })

  it("throws when member list has topics", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    mockDb.where.mockResolvedValueOnce([{ count: 3 }])
    await expect(deleteMemberList(memberListId)).rejects.toThrow(
      "Cannot delete a member list that has topics",
    )
  })

  it("deletes member list successfully when no topics", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    mockDb.where.mockResolvedValueOnce([{ count: 0 }])
    mockDb.where.mockResolvedValueOnce(undefined)

    const result = await deleteMemberList(memberListId)
    expect(result).toEqual({ success: true })
    expect(mockDb.update).toHaveBeenCalled()
    expect(mockDb.set).toHaveBeenCalledWith(
      expect.objectContaining({ deletedBy: "user-1" }),
    )
    expect(mockRevalidatePath).toHaveBeenCalledWith("/member-lists")
  })
})
