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
      .mockResolvedValue([{ id: "019506a0-0000-7000-8000-000000000003" }]),
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
vi.mock("@/lib/db/schema", () => ({ members: {} }))
vi.mock("drizzle-orm", () => ({ eq: vi.fn() }))
vi.mock("next/cache", () => ({
  revalidatePath: mockRevalidatePath,
}))

import { addMember, removeMember, uploadMembers } from "@/lib/actions/members"

const memberListId = "019506a0-0000-7000-8000-000000000002"
const memberId = "019506a0-0000-7000-8000-000000000003"
const memberId2 = "019506a0-0000-7000-8000-000000000005"

const adminSession = {
  user: { email: "test@example.com", id: "user-1", isAdmin: true },
}

describe("addMember", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDb.insert.mockReturnThis()
    mockDb.values.mockResolvedValue(undefined)
  })

  it("throws when no session", async () => {
    mockGetSession.mockResolvedValue(null)
    await expect(
      addMember(memberListId, { email: "new@example.com" }),
    ).rejects.toThrow("Unauthorized")
  })

  it("throws when user is not admin", async () => {
    mockGetSession.mockResolvedValue({
      user: { email: "test@example.com", id: "user-1", isAdmin: false },
    })
    await expect(
      addMember(memberListId, { email: "new@example.com" }),
    ).rejects.toThrow("Unauthorized")
  })

  it("throws on validation error (invalid email)", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    await expect(
      addMember(memberListId, { email: "not-an-email" }),
    ).rejects.toThrow()
  })

  it("adds member successfully", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    const result = await addMember(memberListId, { email: "New@Example.com" })

    expect(result).toEqual({ success: true })
    expect(mockDb.insert).toHaveBeenCalled()
    expect(mockDb.values).toHaveBeenCalledWith({
      email: "new@example.com",
      memberListId,
    })
    expect(mockRevalidatePath).toHaveBeenCalledWith(
      `/member-lists/${memberListId}`,
    )
  })

  it("throws friendly error on unique constraint violation", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    mockDb.values.mockRejectedValue(new Error("unique constraint violated"))

    await expect(
      addMember(memberListId, { email: "dup@example.com" }),
    ).rejects.toThrow("This email is already in the list")
  })

  it("rethrows non-unique db errors", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    mockDb.values.mockRejectedValue(new Error("connection timeout"))

    await expect(
      addMember(memberListId, { email: "new@example.com" }),
    ).rejects.toThrow("connection timeout")
  })
})

describe("removeMember", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDb.delete.mockReturnThis()
    mockDb.where.mockResolvedValue(undefined)
  })

  it("throws when no session", async () => {
    mockGetSession.mockResolvedValue(null)
    await expect(removeMember(memberId, memberListId)).rejects.toThrow(
      "Unauthorized",
    )
  })

  it("throws when user is not admin", async () => {
    mockGetSession.mockResolvedValue({
      user: { email: "test@example.com", id: "user-1", isAdmin: false },
    })
    await expect(removeMember(memberId, memberListId)).rejects.toThrow(
      "Unauthorized",
    )
  })

  it("removes member successfully", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    const result = await removeMember(memberId2, memberListId)

    expect(result).toEqual({ success: true })
    expect(mockDb.delete).toHaveBeenCalled()
    expect(mockDb.where).toHaveBeenCalled()
    expect(mockRevalidatePath).toHaveBeenCalledWith(
      `/member-lists/${memberListId}`,
    )
  })
})

describe("uploadMembers", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDb.select.mockReturnThis()
    mockDb.from.mockReturnThis()
    mockDb.where.mockResolvedValue([])
    mockDb.insert.mockReturnThis()
    mockDb.values.mockReturnThis()
    mockDb.onConflictDoNothing.mockResolvedValue(undefined)
  })

  it("throws when no session", async () => {
    mockGetSession.mockResolvedValue(null)
    await expect(
      uploadMembers(memberListId, ["a@example.com"]),
    ).rejects.toThrow("Unauthorized")
  })

  it("throws when email count exceeds upload limit", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    const emails = Array.from({ length: 10_001 }, (_, i) => `e${i}@example.com`)
    await expect(uploadMembers(memberListId, emails)).rejects.toThrow(
      "Upload limited to 10,000 emails at a time",
    )
  })

  it("handles mix of valid, invalid, and duplicate emails", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    mockDb.where.mockResolvedValue([{ email: "existing@example.com" }])

    const result = await uploadMembers(memberListId, [
      "new@example.com",
      "not-valid",
      "existing@example.com",
      "  Another@Example.com  ",
    ])

    expect(result).toEqual({ added: 2, duplicates: 1, invalid: 1 })
    expect(mockDb.insert).toHaveBeenCalled()
    expect(mockDb.values).toHaveBeenCalledWith([
      { email: "new@example.com", memberListId },
      { email: "another@example.com", memberListId },
    ])
    expect(mockDb.onConflictDoNothing).toHaveBeenCalled()
    expect(mockRevalidatePath).toHaveBeenCalledWith(
      `/member-lists/${memberListId}`,
    )
  })

  it("handles all valid emails with none existing", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    mockDb.where.mockResolvedValue([])

    const result = await uploadMembers(memberListId, [
      "a@example.com",
      "b@example.com",
    ])
    expect(result).toEqual({ added: 2, duplicates: 0, invalid: 0 })
    expect(mockDb.insert).toHaveBeenCalled()
  })

  it("handles all invalid emails", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    mockDb.where.mockResolvedValue([])

    const result = await uploadMembers(memberListId, [
      "bad",
      "also-bad",
      "nope",
    ])
    expect(result).toEqual({ added: 0, duplicates: 0, invalid: 3 })
    expect(mockDb.insert).not.toHaveBeenCalled()
  })

  it("does not insert when all valid emails are duplicates", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    mockDb.where.mockResolvedValue([
      { email: "a@example.com" },
      { email: "b@example.com" },
    ])

    const result = await uploadMembers(memberListId, [
      "a@example.com",
      "b@example.com",
    ])
    expect(result).toEqual({ added: 0, duplicates: 2, invalid: 0 })
    expect(mockDb.insert).not.toHaveBeenCalled()
  })
})
