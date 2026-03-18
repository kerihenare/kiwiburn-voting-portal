import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/components/ui/badge", () => ({
  Badge: ({ children, className, variant }: any) => (
    <span className={className} data-testid="badge" data-variant={variant}>
      {children}
    </span>
  ),
}))

vi.mock("@/components/ui/tooltip", () => ({
  Tooltip: ({ children }: any) => <>{children}</>,
  TooltipContent: ({ children }: any) => (
    <span data-testid="tooltip-content">{children}</span>
  ),
  TooltipTrigger: ({ children, asChild }: any) => <>{children}</>,
}))

vi.mock("date-fns", () => ({
  format: vi.fn().mockReturnValue("1 Jan 2025, 12:00 AM"),
  formatDistanceToNow: vi.fn().mockReturnValue("2 hours"),
  isFuture: vi.fn(),
  isPast: vi.fn(),
}))

import { formatDistanceToNow, isFuture, isPast } from "date-fns"
import { TimerBadge } from "@/components/timer-badge"

describe("TimerBadge", () => {
  const opensAt = new Date("2025-01-01T00:00:00Z")
  const closesAt = new Date("2025-01-02T00:00:00Z")

  it("shows 'Opens in' when vote is scheduled (future opensAt)", () => {
    vi.mocked(isFuture).mockReturnValue(true)
    vi.mocked(isPast).mockReturnValue(false)
    vi.mocked(formatDistanceToNow).mockReturnValue("3 days")

    render(<TimerBadge closesAt={closesAt} opensAt={opensAt} />)
    expect(screen.getByText(/Opens in 3 days/)).toBeInTheDocument()
    expect(screen.getByTestId("badge")).toHaveClass("bg-blue-100")
  })

  it("shows 'Closed' when vote is past (closesAt is past)", () => {
    vi.mocked(isFuture).mockReturnValue(false)
    vi.mocked(isPast).mockReturnValue(true)
    vi.mocked(formatDistanceToNow).mockReturnValue("2 days ago")

    render(<TimerBadge closesAt={closesAt} opensAt={opensAt} />)
    expect(screen.getByText(/Closed/)).toBeInTheDocument()
    expect(screen.getByTestId("badge")).toHaveClass("bg-gray-100")
  })

  it("shows 'Closes in < 1 hour' when less than 1 hour remaining", () => {
    vi.mocked(isFuture).mockReturnValue(false)
    vi.mocked(isPast).mockReturnValue(false)

    const now = new Date()
    const closesSoon = new Date(now.getTime() + 30 * 60 * 1000) // 30 minutes

    render(
      <TimerBadge
        closesAt={closesSoon}
        opensAt={new Date(now.getTime() - 86400000)}
      />,
    )
    expect(screen.getByText(/Closes in < 1 hour/)).toBeInTheDocument()
    expect(screen.getByTestId("badge")).toHaveAttribute(
      "data-variant",
      "destructive",
    )
  })

  it("shows orange badge when less than 24 hours remaining", () => {
    vi.mocked(isFuture).mockReturnValue(false)
    vi.mocked(isPast).mockReturnValue(false)
    vi.mocked(formatDistanceToNow).mockReturnValue("12 hours")

    const now = new Date()
    const closesIn12h = new Date(now.getTime() + 12 * 60 * 60 * 1000)

    render(
      <TimerBadge
        closesAt={closesIn12h}
        opensAt={new Date(now.getTime() - 86400000)}
      />,
    )
    expect(screen.getByText(/Closes in 12 hours/)).toBeInTheDocument()
    expect(screen.getByTestId("badge")).toHaveClass("bg-orange-100")
  })

  it("shows green badge when 24+ hours remaining", () => {
    vi.mocked(isFuture).mockReturnValue(false)
    vi.mocked(isPast).mockReturnValue(false)
    vi.mocked(formatDistanceToNow).mockReturnValue("3 days")

    const now = new Date()
    const closesIn3d = new Date(now.getTime() + 72 * 60 * 60 * 1000)

    render(
      <TimerBadge
        closesAt={closesIn3d}
        opensAt={new Date(now.getTime() - 86400000)}
      />,
    )
    expect(screen.getByText(/Closes in 3 days/)).toBeInTheDocument()
    expect(screen.getByTestId("badge")).toHaveClass("bg-green-100")
  })
})
