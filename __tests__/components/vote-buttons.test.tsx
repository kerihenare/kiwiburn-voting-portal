import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

const mockPush = vi.fn()
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, className, ...props }: any) => (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  ),
}))

const mockCastVote = vi.fn()
vi.mock("@/lib/actions/votes", () => ({
  castVote: (...args: any[]) => mockCastVote(...args),
}))

import { VoteButtons } from "@/components/vote-buttons"

const topicId = "019506a0-0000-7000-8000-000000000001"

describe("VoteButtons", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCastVote.mockResolvedValue(undefined)
  })

  it("renders YES and NO buttons", () => {
    render(<VoteButtons currentVote={null} topicId={topicId} />)
    expect(screen.getByLabelText("Vote yes")).toHaveTextContent("YES")
    expect(screen.getByLabelText("Vote no")).toHaveTextContent("NO")
  })

  it("does not show current vote text when no vote", () => {
    render(<VoteButtons currentVote={null} topicId={topicId} />)
    expect(screen.queryByText(/You voted/)).not.toBeInTheDocument()
  })

  it("shows current vote text when vote exists", () => {
    render(<VoteButtons currentVote="yes" topicId={topicId} />)
    expect(screen.getByText(/You voted/)).toBeInTheDocument()
    expect(screen.getByText("Yes")).toBeInTheDocument()
  })

  it("handles clicking yes and navigates on success", async () => {
    const user = userEvent.setup()
    render(<VoteButtons currentVote={null} topicId={topicId} />)

    await user.click(screen.getByLabelText("Vote yes"))

    expect(mockCastVote).toHaveBeenCalledWith({ topicId, vote: "yes" })
    expect(mockPush).toHaveBeenCalledWith(`/votes/${topicId}/success?vote=yes`)
  })

  it("handles clicking no and navigates on success", async () => {
    const user = userEvent.setup()
    render(<VoteButtons currentVote={null} topicId={topicId} />)

    await user.click(screen.getByLabelText("Vote no"))

    expect(mockCastVote).toHaveBeenCalledWith({ topicId, vote: "no" })
    expect(mockPush).toHaveBeenCalledWith(`/votes/${topicId}/success?vote=no`)
  })

  it("shows 'Submitting...' while vote is in progress", async () => {
    let resolveVote!: () => void
    mockCastVote.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveVote = resolve
        }),
    )

    const user = userEvent.setup()
    render(<VoteButtons currentVote={null} topicId={topicId} />)

    // Click yes, don't resolve yet
    const clickPromise = user.click(screen.getByLabelText("Vote yes"))

    // Wait for the state to update
    await vi.waitFor(() => {
      expect(screen.getByText("Submitting...")).toBeInTheDocument()
    })

    resolveVote()
    await clickPromise
  })

  it("handles error by resetting submitting state", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    mockCastVote.mockRejectedValue(new Error("Vote failed"))

    const user = userEvent.setup()
    render(<VoteButtons currentVote={null} topicId={topicId} />)

    await user.click(screen.getByLabelText("Vote yes"))

    await vi.waitFor(() => {
      expect(screen.getByText("YES")).toBeInTheDocument()
    })
    expect(mockPush).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it("disables buttons while submitting", async () => {
    let resolveVote!: () => void
    mockCastVote.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveVote = resolve
        }),
    )

    const user = userEvent.setup()
    render(<VoteButtons currentVote={null} topicId={topicId} />)

    const clickPromise = user.click(screen.getByLabelText("Vote yes"))

    await vi.waitFor(() => {
      expect(screen.getByLabelText("Vote yes")).toBeDisabled()
      expect(screen.getByLabelText("Vote no")).toBeDisabled()
    })

    resolveVote()
    await clickPromise
  })

  it("applies highlight styles to current vote button (yes)", () => {
    render(<VoteButtons currentVote="yes" topicId={topicId} />)
    expect(screen.getByLabelText("Vote yes").className).toContain(
      "bg-green-600",
    )
  })

  it("applies highlight styles to current vote button (no)", () => {
    render(<VoteButtons currentVote="no" topicId={topicId} />)
    expect(screen.getByLabelText("Vote no").className).toContain("bg-red-600")
  })
})
