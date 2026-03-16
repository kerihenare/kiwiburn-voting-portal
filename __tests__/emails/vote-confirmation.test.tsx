import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import VoteConfirmationEmail from "@/emails/vote-confirmation"

describe("VoteConfirmationEmail", () => {
  it("renders the vote recorded heading", () => {
    render(<VoteConfirmationEmail topicTitle="Budget Proposal" vote="yes" />)
    expect(screen.getByText("Vote recorded")).toBeInTheDocument()
  })

  it("renders the preview text with topic title", () => {
    render(<VoteConfirmationEmail topicTitle="Budget Proposal" vote="yes" />)
    expect(
      screen.getByText(/Vote recorded — Budget Proposal/),
    ).toBeInTheDocument()
  })

  it("renders the vote value in uppercase", () => {
    render(<VoteConfirmationEmail topicTitle="Budget Proposal" vote="yes" />)
    expect(screen.getByText("YES")).toBeInTheDocument()
  })

  it("renders the topic title in the body", () => {
    render(<VoteConfirmationEmail topicTitle="Budget Proposal" vote="no" />)
    const matches = screen.getAllByText(/Budget Proposal/)
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })

  it("renders the 'View all votes' button", () => {
    render(<VoteConfirmationEmail topicTitle="Budget Proposal" vote="yes" />)
    expect(screen.getByText("View all votes")).toBeInTheDocument()
  })

  it("renders the participation thank you text", () => {
    render(<VoteConfirmationEmail topicTitle="Budget Proposal" vote="yes" />)
    expect(screen.getByText(/Thank you for participating/)).toBeInTheDocument()
  })
})
