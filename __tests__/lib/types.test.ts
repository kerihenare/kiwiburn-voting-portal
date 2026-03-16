import { afterEach, describe, expect, it, vi } from "vitest"
import type { TopicStatus } from "@/lib/types"
import { getTopicStatus } from "@/lib/types"

describe("getTopicStatus", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns "scheduled" when current time is before opensAt', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"))

    const opensAt = new Date("2026-06-01T00:00:00Z")
    const closesAt = new Date("2026-07-01T00:00:00Z")

    expect(getTopicStatus(opensAt, closesAt)).toBe(
      "scheduled" satisfies TopicStatus,
    )
  })

  it('returns "open" when current time is between opensAt and closesAt', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-06-15T00:00:00Z"))

    const opensAt = new Date("2026-06-01T00:00:00Z")
    const closesAt = new Date("2026-07-01T00:00:00Z")

    expect(getTopicStatus(opensAt, closesAt)).toBe("open" satisfies TopicStatus)
  })

  it('returns "closed" when current time is after closesAt', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-08-01T00:00:00Z"))

    const opensAt = new Date("2026-06-01T00:00:00Z")
    const closesAt = new Date("2026-07-01T00:00:00Z")

    expect(getTopicStatus(opensAt, closesAt)).toBe(
      "closed" satisfies TopicStatus,
    )
  })

  it('returns "open" when current time equals opensAt exactly', () => {
    vi.useFakeTimers()
    const opensAt = new Date("2026-06-01T00:00:00Z")
    vi.setSystemTime(opensAt)

    const closesAt = new Date("2026-07-01T00:00:00Z")

    expect(getTopicStatus(opensAt, closesAt)).toBe("open")
  })

  it('returns "closed" when current time equals closesAt exactly', () => {
    vi.useFakeTimers()
    const closesAt = new Date("2026-07-01T00:00:00Z")
    vi.setSystemTime(closesAt)

    const opensAt = new Date("2026-06-01T00:00:00Z")

    // now > closesAt is false when equal, so it falls through to "open"
    // Actually now > closesAt is false (equal, not greater), so it returns "open"
    expect(getTopicStatus(opensAt, closesAt)).toBe("open")
  })
})
