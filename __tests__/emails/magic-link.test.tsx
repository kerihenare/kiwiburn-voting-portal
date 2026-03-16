import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import MagicLinkEmail from "@/emails/magic-link"

describe("MagicLinkEmail", () => {
  it("renders the sign in heading", () => {
    render(<MagicLinkEmail url="https://example.com/auth/magic" />)
    expect(screen.getByText("Sign in to vote")).toBeInTheDocument()
  })

  it("renders the sign in button with correct href", () => {
    render(<MagicLinkEmail url="https://example.com/auth/magic" />)
    const button = screen.getByText("Sign in to Kiwiburn")
    expect(button.closest("a")).toHaveAttribute(
      "href",
      "https://example.com/auth/magic",
    )
  })

  it("renders the preview text", () => {
    render(<MagicLinkEmail url="https://example.com/auth/magic" />)
    expect(
      screen.getByText("Sign in to Kiwiburn Voting Portal"),
    ).toBeInTheDocument()
  })

  it("renders the instruction text", () => {
    render(<MagicLinkEmail url="https://example.com/auth/magic" />)
    expect(screen.getByText(/Click the button below/)).toBeInTheDocument()
  })

  it("renders the footer disclaimer", () => {
    render(<MagicLinkEmail url="https://example.com/auth/magic" />)
    expect(screen.getByText(/didn't request this email/i)).toBeInTheDocument()
  })
})
