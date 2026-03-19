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
      .mockResolvedValue([{ id: "019506a0-0000-7000-8000-000000000001" }]),
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
vi.mock("@/lib/db/schema", () => ({ topics: {} }))
vi.mock("drizzle-orm", () => ({ eq: vi.fn(), isNull: vi.fn() }))
vi.mock("next/cache", () => ({
  revalidatePath: mockRevalidatePath,
}))

import { createTopic, deleteTopic, updateTopic } from "@/lib/actions/topics"

const topicId = "019506a0-0000-7000-8000-000000000001"
const memberListId = "019506a0-0000-7000-8000-000000000002"

const adminSession = {
  user: { email: "test@example.com", id: "user-1", isAdmin: true },
}

const validTopicInput = {
  closesAt: "2026-04-10T00:00:00.000Z",
  description: "A description",
  memberListId,
  opensAt: "2026-04-01T00:00:00.000Z",
  title: "Test Topic",
}

describe("createTopic", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDb.insert.mockReturnThis()
    mockDb.values.mockResolvedValue(undefined)
  })

  it("throws when no session", async () => {
    mockGetSession.mockResolvedValue(null)
    await expect(createTopic(validTopicInput)).rejects.toThrow(
      "Not authenticated",
    )
  })

  it("throws when user is not admin", async () => {
    mockGetSession.mockResolvedValue({
      user: { email: "test@example.com", id: "user-1", isAdmin: false },
    })
    await expect(createTopic(validTopicInput)).rejects.toThrow("Unauthorized")
  })

  it("throws on validation error", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    await expect(
      createTopic({ ...validTopicInput, title: "" }),
    ).rejects.toThrow()
  })

  it("creates topic successfully", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    const result = await createTopic(validTopicInput)

    expect(result).toEqual({ success: true })
    expect(mockDb.insert).toHaveBeenCalled()
    expect(mockDb.values).toHaveBeenCalledWith({
      closesAt: new Date("2026-04-10T00:00:00.000Z"),
      description: "A description",
      isActive: false,
      memberListId,
      opensAt: new Date("2026-04-01T00:00:00.000Z"),
      title: "Test Topic",
    })
    expect(mockRevalidatePath).toHaveBeenCalledWith("/topics")
    expect(mockRevalidatePath).toHaveBeenCalledWith("/")
  })

  it("sets description to null when not provided", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    const { description, ...inputWithout } = validTopicInput
    await createTopic(inputWithout)

    expect(mockDb.values).toHaveBeenCalledWith(
      expect.objectContaining({ description: null }),
    )
  })

  it("creates topic with isActive true", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    await createTopic({ ...validTopicInput, isActive: true })

    expect(mockDb.values).toHaveBeenCalledWith(
      expect.objectContaining({ isActive: true }),
    )
  })

  it("creates topic with null dates when not provided", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    const { opensAt, closesAt, ...inputWithoutDates } = validTopicInput
    await createTopic(inputWithoutDates)

    expect(mockDb.values).toHaveBeenCalledWith(
      expect.objectContaining({ closesAt: null, opensAt: null }),
    )
  })
})

describe("updateTopic", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDb.update.mockReturnThis()
    mockDb.set.mockReturnThis()
    mockDb.where.mockResolvedValue(undefined)
  })

  it("throws when no session", async () => {
    mockGetSession.mockResolvedValue(null)
    await expect(updateTopic(topicId, validTopicInput)).rejects.toThrow(
      "Not authenticated",
    )
  })

  it("throws when user is not admin", async () => {
    mockGetSession.mockResolvedValue({
      user: { email: "test@example.com", id: "user-1", isAdmin: false },
    })
    await expect(updateTopic(topicId, validTopicInput)).rejects.toThrow(
      "Unauthorized",
    )
  })

  it("throws on validation error", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    await expect(
      updateTopic(topicId, { ...validTopicInput, title: "" }),
    ).rejects.toThrow()
  })

  it("updates topic successfully", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    const result = await updateTopic(topicId, validTopicInput)

    expect(result).toEqual({ success: true })
    expect(mockDb.update).toHaveBeenCalled()
    expect(mockDb.set).toHaveBeenCalledWith(
      expect.objectContaining({
        closesAt: new Date("2026-04-10T00:00:00.000Z"),
        description: "A description",
        memberListId,
        opensAt: new Date("2026-04-01T00:00:00.000Z"),
        title: "Test Topic",
      }),
    )
    expect(mockDb.where).toHaveBeenCalled()
    expect(mockRevalidatePath).toHaveBeenCalledWith("/topics")
    expect(mockRevalidatePath).toHaveBeenCalledWith(`/topics/${topicId}`)
    expect(mockRevalidatePath).toHaveBeenCalledWith("/")
  })

  it("sets description to null when not provided", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    const { description, ...inputWithout } = validTopicInput
    await updateTopic(topicId, inputWithout)

    expect(mockDb.set).toHaveBeenCalledWith(
      expect.objectContaining({ description: null }),
    )
  })

  it("updates topic with isActive flag", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    await updateTopic(topicId, { ...validTopicInput, isActive: true })

    expect(mockDb.set).toHaveBeenCalledWith(
      expect.objectContaining({ isActive: true }),
    )
  })

  it("updates topic with null dates when not provided", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    const { opensAt, closesAt, ...inputWithoutDates } = validTopicInput
    await updateTopic(topicId, inputWithoutDates)

    expect(mockDb.set).toHaveBeenCalledWith(
      expect.objectContaining({ closesAt: null, opensAt: null }),
    )
  })
})

describe("deleteTopic", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDb.update.mockReturnThis()
    mockDb.set.mockReturnThis()
    mockDb.where.mockResolvedValue(undefined)
  })

  it("throws when no session", async () => {
    mockGetSession.mockResolvedValue(null)
    await expect(deleteTopic(topicId)).rejects.toThrow("Not authenticated")
  })

  it("throws when user is not admin", async () => {
    mockGetSession.mockResolvedValue({
      user: { email: "test@example.com", id: "user-1", isAdmin: false },
    })
    await expect(deleteTopic(topicId)).rejects.toThrow("Unauthorized")
  })

  it("deletes topic successfully", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    const result = await deleteTopic(topicId)

    expect(result).toEqual({ success: true })
    expect(mockDb.update).toHaveBeenCalled()
    expect(mockDb.set).toHaveBeenCalledWith(
      expect.objectContaining({ deletedBy: "user-1" }),
    )
    expect(mockDb.where).toHaveBeenCalled()
    expect(mockRevalidatePath).toHaveBeenCalledWith("/topics")
    expect(mockRevalidatePath).toHaveBeenCalledWith("/")
  })
})
