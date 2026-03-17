import { beforeEach, describe, expect, it, vi } from "vitest"

const {
  mockDb,
  mockGetSession,
  mockGetTopic,
  mockCheckEligibility,
  mockSendVoteConfirmationEmail,
} = vi.hoisted(() => ({
  mockCheckEligibility: vi.fn(),
  mockDb: {
    delete: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue([]),
    onConflictDoNothing: vi.fn().mockResolvedValue(undefined),
    onConflictDoUpdate: vi.fn().mockResolvedValue(undefined),
    returning: vi
      .fn()
      .mockResolvedValue([{ id: "019506a0-0000-7000-8000-000000000004" }]),
    select: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValue(undefined),
  },
  mockGetSession: vi.fn(),
  mockGetTopic: vi.fn(),
  mockSendVoteConfirmationEmail: vi.fn(),
}))

vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession: mockGetSession } },
}))
vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}))
vi.mock("@/lib/db", () => ({ db: mockDb }))
vi.mock("@/lib/db/schema", () => ({
  topics: {},
  users: {},
  votes: {},
}))
vi.mock("drizzle-orm", () => ({
  and: vi.fn(),
  eq: vi.fn(),
}))
vi.mock("@/lib/db/queries", () => ({
  checkEligibility: mockCheckEligibility,
  getTopic: mockGetTopic,
}))
vi.mock("@/lib/email", () => ({
  sendVoteConfirmationEmail: mockSendVoteConfirmationEmail,
}))
vi.mock("@/lib/types", () => ({
  getTopicStatus: vi.fn((opensAt: Date, closesAt: Date) => {
    const now = new Date()
    if (now < opensAt) return "upcoming"
    if (now > closesAt) return "closed"
    return "open"
  }),
}))

import { castVote } from "@/lib/actions/votes"
import { getTopicStatus } from "@/lib/types"

const topicId = "019506a0-0000-7000-8000-000000000001"

const adminSession = {
  user: { email: "test@example.com", id: "user-1", isAdmin: true },
}

const openTopic = {
  closesAt: new Date(Date.now() + 86400000),
  id: topicId,
  isActive: true,
  opensAt: new Date(Date.now() - 86400000),
  title: "Test Topic",
}

describe("castVote", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDb.insert.mockReturnThis()
    mockDb.values.mockReturnThis()
    mockDb.onConflictDoUpdate.mockResolvedValue(undefined)
    mockSendVoteConfirmationEmail.mockResolvedValue(undefined)
  })

  it("throws when not authenticated", async () => {
    mockGetSession.mockResolvedValue(null)
    await expect(castVote({ topicId, vote: "yes" })).rejects.toThrow(
      "Not authenticated",
    )
  })

  it("throws when topic not found", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    mockGetTopic.mockResolvedValue(null)
    await expect(castVote({ topicId, vote: "yes" })).rejects.toThrow(
      "Topic not found",
    )
  })

  it("throws when topic is inactive", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    mockGetTopic.mockResolvedValue({ ...openTopic, isActive: false })
    await expect(castVote({ topicId, vote: "yes" })).rejects.toThrow(
      "Topic not found",
    )
  })

  it("throws when voting is not open", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    const futureTopic = {
      ...openTopic,
      closesAt: new Date(Date.now() + 172800000),
      opensAt: new Date(Date.now() + 86400000),
    }
    mockGetTopic.mockResolvedValue(futureTopic)
    vi.mocked(getTopicStatus).mockReturnValue("upcoming" as any)
    await expect(castVote({ topicId, vote: "yes" })).rejects.toThrow(
      "Voting is not open",
    )
  })

  it("throws when not eligible to vote", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    mockGetTopic.mockResolvedValue(openTopic)
    vi.mocked(getTopicStatus).mockReturnValue("open")
    mockCheckEligibility.mockResolvedValue({ eligible: false })
    await expect(castVote({ topicId, vote: "yes" })).rejects.toThrow(
      "Not eligible to vote",
    )
  })

  it("casts vote successfully", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    mockGetTopic.mockResolvedValue(openTopic)
    vi.mocked(getTopicStatus).mockReturnValue("open")
    mockCheckEligibility.mockResolvedValue({ eligible: true })

    const result = await castVote({ topicId, vote: "yes" })

    expect(result).toEqual({ success: true, vote: "yes" })
    expect(mockDb.insert).toHaveBeenCalled()
    expect(mockDb.values).toHaveBeenCalledWith({
      topicId,
      userId: "user-1",
      vote: "yes",
    })
    expect(mockDb.onConflictDoUpdate).toHaveBeenCalled()
    expect(mockSendVoteConfirmationEmail).toHaveBeenCalledWith({
      email: "test@example.com",
      topicId,
      topicTitle: "Test Topic",
      vote: "yes",
    })
  })

  it("casts no vote successfully", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    mockGetTopic.mockResolvedValue(openTopic)
    vi.mocked(getTopicStatus).mockReturnValue("open")
    mockCheckEligibility.mockResolvedValue({ eligible: true })

    const result = await castVote({ topicId, vote: "no" })

    expect(result).toEqual({ success: true, vote: "no" })
    expect(mockDb.values).toHaveBeenCalledWith({
      topicId,
      userId: "user-1",
      vote: "no",
    })
  })

  it("catches confirmation email errors without failing", async () => {
    mockGetSession.mockResolvedValue(adminSession)
    mockGetTopic.mockResolvedValue(openTopic)
    vi.mocked(getTopicStatus).mockReturnValue("open")
    mockCheckEligibility.mockResolvedValue({ eligible: true })
    mockSendVoteConfirmationEmail.mockRejectedValue(new Error("Email failed"))
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    const result = await castVote({ topicId, vote: "yes" })

    expect(result).toEqual({ success: true, vote: "yes" })
    await new Promise((r) => setTimeout(r, 10))
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it("throws on invalid input (validation error)", async () => {
    await expect(
      castVote({ topicId, vote: "" as unknown as string }),
    ).rejects.toThrow()
  })
})
