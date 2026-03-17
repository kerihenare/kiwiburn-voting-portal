import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import VoteConfirmationEmail from "@/emails/vote-confirmation"

const defaultProps = {
  topicId: "topic-123",
  topicTitle: "Budget Proposal",
  vote: "yes",
}

describe("VoteConfirmationEmail", () => {
  it("renders the vote recorded heading", () => {
    render(<VoteConfirmationEmail {...defaultProps} />)
    expect(screen.getByText("Vote recorded")).toBeInTheDocument()
  })

  it("renders the preview text with vote and topic title", () => {
    render(<VoteConfirmationEmail {...defaultProps} />)
    expect(screen.getByText(/You voted YES on/)).toBeInTheDocument()
  })

  it("renders the vote value in uppercase", () => {
    render(<VoteConfirmationEmail {...defaultProps} />)
    expect(screen.getByText("YES")).toBeInTheDocument()
  })

  it("renders the topic title in the body", () => {
    render(<VoteConfirmationEmail {...defaultProps} vote="no" />)
    const matches = screen.getAllByText(/Budget Proposal/)
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })

  it("renders the 'View this topic' button", () => {
    render(<VoteConfirmationEmail {...defaultProps} />)
    expect(screen.getByText("View this topic")).toBeInTheDocument()
  })

  it("renders the participation thank you text", () => {
    render(<VoteConfirmationEmail {...defaultProps} />)
    expect(screen.getByText(/Thank you for participating/)).toBeInTheDocument()
  })
})
