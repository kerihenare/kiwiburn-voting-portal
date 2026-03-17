import { render } from "@react-email/components"
import nodemailer from "nodemailer"
import MagicLinkEmail from "@/emails/magic-link"
import VoteConfirmationEmail from "@/emails/vote-confirmation"

function getTransport() {
  return nodemailer.createTransport({
    auth: {
      pass: process.env.SMTP_PASS,
      user: process.env.SMTP_USER,
    },
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
  })
}

export async function sendMagicLinkEmail({
  email,
  url,
}: {
  email: string
  url: string
}) {
  const component = MagicLinkEmail({ url })
  const [html, text] = await Promise.all([
    render(component),
    render(component, { plainText: true }),
  ])
  const transport = getTransport()

  await transport.sendMail({
    from: process.env.SMTP_FROM,
    html,
    subject: "Sign in to Kiwiburn Voting Portal",
    text,
    to: email,
  })
}

export async function sendVoteConfirmationEmail({
  email,
  topicId,
  topicTitle,
  vote,
}: {
  email: string
  topicId: string
  topicTitle: string
  vote: string
}) {
  const component = VoteConfirmationEmail({ topicId, topicTitle, vote })
  const [html, text] = await Promise.all([
    render(component),
    render(component, { plainText: true }),
  ])
  const transport = getTransport()

  await transport.sendMail({
    from: process.env.SMTP_FROM,
    html,
    subject: `Vote recorded — ${topicTitle}`,
    text,
    to: email,
  })
}
