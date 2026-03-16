import nodemailer from "nodemailer"
import { render } from "@react-email/components"
import MagicLinkEmail from "@/emails/magic-link"
import VoteConfirmationEmail from "@/emails/vote-confirmation"

function getTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

export async function sendMagicLinkEmail({
  email,
  url,
}: {
  email: string
  url: string
}) {
  const html = await render(MagicLinkEmail({ url }))
  const transport = getTransport()

  await transport.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Sign in to Kiwiburn Voting Portal",
    html,
  })
}

export async function sendVoteConfirmationEmail({
  email,
  topicTitle,
  vote,
}: {
  email: string
  topicTitle: string
  vote: string
}) {
  const html = await render(VoteConfirmationEmail({ topicTitle, vote }))
  const transport = getTransport()

  await transport.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: `Vote recorded — ${topicTitle}`,
    html,
  })
}
