import { beforeEach, describe, expect, it, vi } from "vitest"

const { mockSendMail } = vi.hoisted(() => ({
  mockSendMail: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn().mockReturnValue({ sendMail: mockSendMail }),
  },
}))

vi.mock("@react-email/components", () => ({
  render: vi.fn().mockResolvedValue("<html>rendered</html>"),
}))

vi.mock("@/emails/magic-link", () => ({
  default: vi.fn().mockReturnValue("magic-link-component"),
}))

vi.mock("@/emails/vote-confirmation", () => ({
  default: vi.fn().mockReturnValue("vote-confirmation-component"),
}))

import { render } from "@react-email/components"
import nodemailer from "nodemailer"
import MagicLinkEmail from "@/emails/magic-link"
import VoteConfirmationEmail from "@/emails/vote-confirmation"
import { sendMagicLinkEmail, sendVoteConfirmationEmail } from "@/lib/email"

describe("sendMagicLinkEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSendMail.mockResolvedValue(undefined)
  })

  it("renders the magic link email and sends it", async () => {
    await sendMagicLinkEmail({
      email: "test@example.com",
      url: "https://example.com/auth",
    })

    expect(MagicLinkEmail).toHaveBeenCalledWith({
      url: "https://example.com/auth",
    })
    expect(render).toHaveBeenCalledWith("magic-link-component")
    expect(nodemailer.createTransport).toHaveBeenCalled()
    expect(mockSendMail).toHaveBeenCalledWith({
      from: process.env.SMTP_FROM,
      html: "<html>rendered</html>",
      subject: "Sign in to Kiwiburn Voting Portal",
      to: "test@example.com",
    })
  })
})

describe("sendVoteConfirmationEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSendMail.mockResolvedValue(undefined)
  })

  it("renders the vote confirmation email and sends it", async () => {
    await sendVoteConfirmationEmail({
      email: "voter@example.com",
      topicTitle: "Important Vote",
      vote: "yes",
    })

    expect(VoteConfirmationEmail).toHaveBeenCalledWith({
      topicTitle: "Important Vote",
      vote: "yes",
    })
    expect(render).toHaveBeenCalledWith("vote-confirmation-component")
    expect(mockSendMail).toHaveBeenCalledWith({
      from: process.env.SMTP_FROM,
      html: "<html>rendered</html>",
      subject: "Vote recorded — Important Vote",
      to: "voter@example.com",
    })
  })
})
