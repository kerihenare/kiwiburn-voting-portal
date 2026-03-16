import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock("@/components/ui/card", () => ({
  Card: ({ children, ...props }: any) => (
    <div data-testid="card" {...props}>
      {children}
    </div>
  ),
  CardContent: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  CardFooter: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}))

vi.mock("@/components/ui/badge", () => ({
  Badge: ({ children, ...props }: any) => (
    <span data-testid="badge" {...props}>
      {children}
    </span>
  ),
}))

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, asChild, ...props }: any) => {
    if (asChild) return <>{children}</>
    return <button {...props}>{children}</button>
  },
}))

vi.mock("@/components/ui/separator", () => ({
  Separator: () => <hr />,
}))

vi.mock("@/components/timer-badge", () => ({
  TimerBadge: ({ opensAt, closesAt }: any) => (
    <span data-testid="timer-badge">timer</span>
  ),
}))

vi.mock("@/components/result-bars", () => ({
  ResultBars: ({ yesCount, noCount, totalVotes }: any) => (
    <div data-testid="result-bars">
      {yesCount}/{noCount}/{totalVotes}
    </div>
  ),
}))

vi.mock("@/lib/types", () => ({
  getTopicStatus: vi.fn(),
}))

import { TopicCard } from "@/components/topic-card"
import { getTopicStatus } from "@/lib/types"

const baseTopic = {
  closesAt: new Date("2025-01-02"),
  description: "A description",
  id: "019506a0-0000-7000-8000-000000000001",
  memberListName: "Members List",
  noCount: 3,
  opensAt: new Date("2025-01-01"),
  title: "Test Topic",
  totalVotes: 8,
  yesCount: 5,
}

describe("TopicCard", () => {
  it("renders title and description", () => {
    vi.mocked(getTopicStatus).mockReturnValue("open")
    render(<TopicCard topic={baseTopic} />)
    expect(screen.getByText("Test Topic")).toBeInTheDocument()
    expect(screen.getByText("A description")).toBeInTheDocument()
  })

  it("renders memberListName when present", () => {
    vi.mocked(getTopicStatus).mockReturnValue("open")
    render(<TopicCard topic={baseTopic} />)
    expect(screen.getByText("Members List")).toBeInTheDocument()
  })

  it("does not render memberListName when null", () => {
    vi.mocked(getTopicStatus).mockReturnValue("open")
    render(<TopicCard topic={{ ...baseTopic, memberListName: null }} />)
    expect(screen.queryByText("Members List")).not.toBeInTheDocument()
  })

  it("does not render description when null", () => {
    vi.mocked(getTopicStatus).mockReturnValue("open")
    render(<TopicCard topic={{ ...baseTopic, description: null }} />)
    expect(screen.queryByText("A description")).not.toBeInTheDocument()
  })

  it("shows ResultBars when status is closed", () => {
    vi.mocked(getTopicStatus).mockReturnValue("closed")
    render(<TopicCard topic={baseTopic} />)
    expect(screen.getByTestId("result-bars")).toBeInTheDocument()
  })

  it("does not show ResultBars when status is open", () => {
    vi.mocked(getTopicStatus).mockReturnValue("open")
    render(<TopicCard topic={baseTopic} />)
    expect(screen.queryByTestId("result-bars")).not.toBeInTheDocument()
  })

  it("shows user vote badge when userVote is provided", () => {
    vi.mocked(getTopicStatus).mockReturnValue("open")
    render(<TopicCard topic={baseTopic} userVote="yes" />)
    expect(screen.getByText(/You voted: Yes/)).toBeInTheDocument()
  })

  it("does not show user vote badge when userVote is undefined", () => {
    vi.mocked(getTopicStatus).mockReturnValue("open")
    render(<TopicCard topic={baseTopic} />)
    expect(screen.queryByText(/You voted:/)).not.toBeInTheDocument()
  })

  it("shows 'Vote now' button when open and no vote", () => {
    vi.mocked(getTopicStatus).mockReturnValue("open")
    render(<TopicCard topic={baseTopic} />)
    expect(screen.getByText("Vote now")).toBeInTheDocument()
  })

  it("shows 'Change vote' button when open and has vote", () => {
    vi.mocked(getTopicStatus).mockReturnValue("open")
    render(<TopicCard topic={baseTopic} userVote="yes" />)
    expect(screen.getByText("Change vote")).toBeInTheDocument()
  })

  it("does not show vote button when closed", () => {
    vi.mocked(getTopicStatus).mockReturnValue("closed")
    render(<TopicCard topic={baseTopic} />)
    expect(screen.queryByText("Vote now")).not.toBeInTheDocument()
    expect(screen.queryByText("Change vote")).not.toBeInTheDocument()
  })

  it("links to the correct vote page", () => {
    vi.mocked(getTopicStatus).mockReturnValue("open")
    render(<TopicCard topic={baseTopic} />)
    const link = screen.getByText("Vote now").closest("a")
    expect(link).toHaveAttribute(
      "href",
      "/votes/019506a0-0000-7000-8000-000000000001",
    )
  })
})
