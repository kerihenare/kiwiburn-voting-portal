import { describe, expect, it } from "vitest"
import {
  addMemberSchema,
  castVoteSchema,
  createMemberListSchema,
  createTopicSchema,
  signInSchema,
} from "@/lib/validations"

describe("signInSchema", () => {
  it("accepts a valid email", () => {
    const result = signInSchema.safeParse({ email: "user@example.com" })
    expect(result.success).toBe(true)
  })

  it("rejects an invalid email", () => {
    const result = signInSchema.safeParse({ email: "not-an-email" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Please enter a valid email address",
      )
    }
  })

  it("rejects an empty string", () => {
    const result = signInSchema.safeParse({ email: "" })
    expect(result.success).toBe(false)
  })

  it("rejects missing email field", () => {
    const result = signInSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})

describe("createTopicSchema", () => {
  const validInput = {
    closesAt: "2026-07-01T00:00:00Z",
    description: "Vote for new board members",
    memberListId: "019506a0-0000-7000-8000-000000000002",
    opensAt: "2026-06-01T00:00:00Z",
    title: "Board Election",
  }

  it("accepts valid input", () => {
    const result = createTopicSchema.safeParse(validInput)
    expect(result.success).toBe(true)
  })

  it("accepts valid input without description", () => {
    const { description, ...withoutDesc } = validInput
    const result = createTopicSchema.safeParse(withoutDesc)
    expect(result.success).toBe(true)
  })

  it("rejects empty title", () => {
    const result = createTopicSchema.safeParse({ ...validInput, title: "" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Title is required")
    }
  })

  it("rejects missing title", () => {
    const { title, ...noTitle } = validInput
    const result = createTopicSchema.safeParse(noTitle)
    expect(result.success).toBe(false)
  })

  it("rejects missing memberListId", () => {
    const { memberListId, ...noList } = validInput
    const result = createTopicSchema.safeParse(noList)
    expect(result.success).toBe(false)
  })

  it("rejects non-UUID memberListId", () => {
    const result = createTopicSchema.safeParse({
      ...validInput,
      memberListId: "abc",
    })
    expect(result.success).toBe(false)
  })

  it("accepts empty opensAt as optional", () => {
    const result = createTopicSchema.safeParse({ ...validInput, opensAt: "" })
    expect(result.success).toBe(true)
  })

  it("accepts empty closesAt as optional", () => {
    const result = createTopicSchema.safeParse({ ...validInput, closesAt: "" })
    expect(result.success).toBe(true)
  })

  it("accepts input without opensAt", () => {
    const { opensAt, ...withoutOpensAt } = validInput
    const result = createTopicSchema.safeParse(withoutOpensAt)
    expect(result.success).toBe(true)
  })

  it("accepts input without closesAt", () => {
    const { closesAt, ...withoutClosesAt } = validInput
    const result = createTopicSchema.safeParse(withoutClosesAt)
    expect(result.success).toBe(true)
  })

  it("accepts input without both dates", () => {
    const { opensAt, closesAt, ...withoutDates } = validInput
    const result = createTopicSchema.safeParse(withoutDates)
    expect(result.success).toBe(true)
  })

  it("still rejects closesAt before opensAt when both provided", () => {
    const result = createTopicSchema.safeParse({
      ...validInput,
      closesAt: "2026-06-01T00:00:00Z",
      opensAt: "2026-07-01T00:00:00Z",
    })
    expect(result.success).toBe(false)
  })

  it("rejects closesAt before opensAt", () => {
    const result = createTopicSchema.safeParse({
      ...validInput,
      closesAt: "2026-06-01T00:00:00Z",
      opensAt: "2026-07-01T00:00:00Z",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes("closesAt"))
      expect(issue?.message).toBe("Closes at must be after opens at")
    }
  })

  it("rejects closesAt equal to opensAt", () => {
    const result = createTopicSchema.safeParse({
      ...validInput,
      closesAt: "2026-06-01T00:00:00Z",
      opensAt: "2026-06-01T00:00:00Z",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes("closesAt"))
      expect(issue?.message).toBe("Closes at must be after opens at")
    }
  })
})

describe("createMemberListSchema", () => {
  it("accepts valid input with name and description", () => {
    const result = createMemberListSchema.safeParse({
      description: "All current board members",
      name: "Board Members",
    })
    expect(result.success).toBe(true)
  })

  it("accepts valid input without description", () => {
    const result = createMemberListSchema.safeParse({ name: "Board Members" })
    expect(result.success).toBe(true)
  })

  it("rejects empty name", () => {
    const result = createMemberListSchema.safeParse({ name: "" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Name is required")
    }
  })

  it("rejects missing name", () => {
    const result = createMemberListSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})

describe("addMemberSchema", () => {
  it("accepts a valid email", () => {
    const result = addMemberSchema.safeParse({ email: "member@example.com" })
    expect(result.success).toBe(true)
  })

  it("rejects an invalid email", () => {
    const result = addMemberSchema.safeParse({ email: "bad" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Please enter a valid email address",
      )
    }
  })

  it("rejects missing email", () => {
    const result = addMemberSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})

describe("castVoteSchema", () => {
  it('accepts a valid "yes" vote', () => {
    const result = castVoteSchema.safeParse({
      topicId: "019506a0-0000-7000-8000-000000000001",
      vote: "yes",
    })
    expect(result.success).toBe(true)
  })

  it('accepts a valid "no" vote', () => {
    const result = castVoteSchema.safeParse({
      topicId: "019506a0-0000-7000-8000-000000000001",
      vote: "no",
    })
    expect(result.success).toBe(true)
  })

  it("rejects an invalid vote value", () => {
    const result = castVoteSchema.safeParse({
      topicId: "019506a0-0000-7000-8000-000000000001",
      vote: "maybe",
    })
    expect(result.success).toBe(false)
  })

  it("rejects missing topicId", () => {
    const result = castVoteSchema.safeParse({ vote: "yes" })
    expect(result.success).toBe(false)
  })

  it("rejects missing vote", () => {
    const result = castVoteSchema.safeParse({
      topicId: "019506a0-0000-7000-8000-000000000001",
    })
    expect(result.success).toBe(false)
  })

  it("rejects non-UUID topicId", () => {
    const result = castVoteSchema.safeParse({ topicId: "abc", vote: "yes" })
    expect(result.success).toBe(false)
  })
})
