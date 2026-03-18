import { beforeEach, describe, expect, it, vi } from "vitest"

const { mockDb } = vi.hoisted(() => {
  function createChain(resolveValue: any) {
    const chain: any = {}
    const methods = [
      "select",
      "from",
      "where",
      "leftJoin",
      "innerJoin",
      "groupBy",
      "orderBy",
      "limit",
    ]
    methods.forEach((m) => {
      chain[m] = vi.fn().mockReturnValue(chain)
    })
    // Make chain thenable so it resolves when awaited at any point
    chain.then = (resolve: Function) => resolve(resolveValue)
    chain.orderBy = vi.fn().mockResolvedValue(resolveValue)
    chain.limit = vi.fn().mockResolvedValue(resolveValue)
    chain.where = vi.fn().mockImplementation(() => {
      const chainableResult: any = { ...chain }
      chainableResult.limit = vi.fn().mockResolvedValue(resolveValue)
      chainableResult.orderBy = vi.fn().mockResolvedValue(resolveValue)
      chainableResult.then = (resolve: Function) => resolve(resolveValue)
      return chainableResult
    })
    return chain
  }

  return {
    mockDb: {
      _createChain: createChain,
      select: vi.fn(),
    },
  }
})

vi.mock("@/lib/db", () => ({ db: mockDb }))
vi.mock("@/lib/db/schema", () => ({
  memberLists: {
    createdAt: "memberLists.createdAt",
    deletedAt: "memberLists.deletedAt",
    id: "memberLists.id",
    name: "memberLists.name",
  },
  members: {
    createdAt: "members.createdAt",
    email: "members.email",
    id: "members.id",
    memberListId: "members.memberListId",
  },
  topics: {
    deletedAt: "topics.deletedAt",
    id: "topics.id",
    memberListId: "topics.memberListId",
  },
  user: { email: "user.email", id: "user.id" },
  votes: {
    id: "votes.id",
    topicId: "votes.topicId",
    userId: "votes.userId",
    vote: "votes.vote",
  },
}))
vi.mock("drizzle-orm", async (importOriginal) => {
  const actual = await importOriginal<typeof import("drizzle-orm")>()
  return {
    ...actual,
    and: vi.fn((...args: any[]) => args),
    count: vi.fn(),
    desc: vi.fn((col: any) => col),
    eq: vi.fn((...args: any[]) => args),
    isNull: vi.fn((col: any) => ["isNull", col]),
    sql: vi.fn(),
  }
})

import {
  checkEligibility,
  getAdminTopicsWithCounts,
  getAllMemberLists,
  getMemberList,
  getMemberListsWithCounts,
  getTopic,
  getTopicsWithCounts,
  getUserVoteForTopic,
  getUserVotes,
  getVoteResults,
  isEmailInAnyMemberList,
} from "@/lib/db/queries"

const topicId = "019506a0-0000-7000-8000-000000000001"
const memberListId = "019506a0-0000-7000-8000-000000000002"
const memberId = "019506a0-0000-7000-8000-000000000003"

describe("queries", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  function setupSelect(...configs: any[]) {
    let callIndex = 0
    mockDb.select = vi.fn().mockImplementation(() => {
      const chain = mockDb._createChain(configs[callIndex] ?? [])
      callIndex++
      return chain
    })
  }

  describe("getTopicsWithCounts", () => {
    it("returns topics from database", async () => {
      const mockTopics = [{ id: topicId, title: "Topic 1" }]
      setupSelect(mockTopics)
      const result = await getTopicsWithCounts()
      expect(result).toEqual(mockTopics)
      expect(mockDb.select).toHaveBeenCalled()
    })
  })

  describe("getAdminTopicsWithCounts", () => {
    it("returns all non-deleted topics including inactive", async () => {
      const mockTopics = [
        { id: topicId, isActive: false, title: "Topic 1" },
        { id: "topic-2", isActive: true, title: "Topic 2" },
      ]
      setupSelect(mockTopics)
      const result = await getAdminTopicsWithCounts()
      expect(result).toEqual(mockTopics)
      expect(mockDb.select).toHaveBeenCalled()
    })
  })

  describe("getTopic", () => {
    it("returns topic when found", async () => {
      setupSelect([{ id: topicId, title: "Topic 1" }])
      const result = await getTopic(topicId)
      expect(result).toEqual({ id: topicId, title: "Topic 1" })
    })

    it("returns null when topic not found", async () => {
      setupSelect([])
      const result = await getTopic("019506a0-0000-7000-8000-000000000099")
      expect(result).toBeNull()
    })
  })

  describe("getVoteResults", () => {
    it("returns vote counts when results exist", async () => {
      setupSelect([{ noCount: 3, totalVotes: 8, yesCount: 5 }])
      const result = await getVoteResults(topicId)
      expect(result).toEqual({ noCount: 3, totalVotes: 8, yesCount: 5 })
    })

    it("returns default counts when no results", async () => {
      setupSelect([])
      const result = await getVoteResults(
        "019506a0-0000-7000-8000-000000000099",
      )
      expect(result).toEqual({ noCount: 0, totalVotes: 0, yesCount: 0 })
    })
  })

  describe("getUserVotes", () => {
    it("returns a map of topicId to vote", async () => {
      setupSelect([
        { topicId: "topic-1", vote: "yes" },
        { topicId: "topic-2", vote: "no" },
      ])
      const result = await getUserVotes("user-1")
      expect(result).toEqual({ "topic-1": "yes", "topic-2": "no" })
    })

    it("returns empty object when user has no votes", async () => {
      setupSelect([])
      const result = await getUserVotes("user-1")
      expect(result).toEqual({})
    })
  })

  describe("getUserVoteForTopic", () => {
    it("returns vote when user has voted", async () => {
      setupSelect([{ vote: "yes" }])
      const result = await getUserVoteForTopic(topicId, "user-1")
      expect(result).toBe("yes")
    })

    it("returns null when user has not voted", async () => {
      setupSelect([])
      const result = await getUserVoteForTopic(topicId, "user-1")
      expect(result).toBeNull()
    })
  })

  describe("checkEligibility", () => {
    it("returns not eligible when user not found", async () => {
      setupSelect([])
      const result = await checkEligibility(memberListId, "user-1")
      expect(result).toEqual({ eligible: false, reason: "User not found" })
    })

    it("returns not eligible when member not found", async () => {
      setupSelect([{ email: "test@example.com" }], [])
      const result = await checkEligibility(memberListId, "user-1")
      expect(result).toEqual({ eligible: false, reason: "Not eligible" })
    })

    it("returns eligible when member is found", async () => {
      setupSelect([{ email: "test@example.com" }], [{ id: memberId }])
      const result = await checkEligibility(memberListId, "user-1")
      expect(result).toEqual({ eligible: true, reason: null })
    })
  })

  describe("getMemberListsWithCounts", () => {
    it("returns member lists with counts", async () => {
      const mockLists = [
        { id: memberListId, memberCount: 5, name: "List A", topicCount: 2 },
      ]
      setupSelect(mockLists)
      const result = await getMemberListsWithCounts()
      expect(result).toEqual(mockLists)
    })
  })

  describe("getMemberList", () => {
    it("returns null when list not found", async () => {
      setupSelect([])
      const result = await getMemberList("019506a0-0000-7000-8000-000000000099")
      expect(result).toBeNull()
    })

    it("returns list with members and topics when found", async () => {
      const mockList = [{ id: memberListId, name: "List A" }]
      const mockMembers = [{ email: "a@b.com", id: memberId }]
      const mockTopics = [{ id: topicId, title: "Topic" }]
      setupSelect(mockList, mockMembers, mockTopics)

      const result = await getMemberList(memberListId)
      expect(result).toEqual({
        id: memberListId,
        members: mockMembers,
        name: "List A",
        topics: mockTopics,
      })
    })
  })

  describe("isEmailInAnyMemberList", () => {
    it("returns true when email is in a member list", async () => {
      setupSelect([{ id: memberId }])
      const result = await isEmailInAnyMemberList("test@example.com")
      expect(result).toBe(true)
    })

    it("returns false when email is not in any member list", async () => {
      setupSelect([])
      const result = await isEmailInAnyMemberList("unknown@example.com")
      expect(result).toBe(false)
    })
  })

  describe("getAllMemberLists", () => {
    it("returns all member lists", async () => {
      const mockLists = [{ id: memberListId, name: "List A" }]
      setupSelect(mockLists)
      const result = await getAllMemberLists()
      expect(result).toEqual(mockLists)
    })
  })
})
