import { render } from "@react-email/components"
import nodemailer from "nodemailer"
import type { ReactElement } from "react"
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

async function sendEmail({
  component,
  subject,
  to,
}: {
  component: ReactElement
  subject: string
  to: string
}) {
  const [html, text] = await Promise.all([
    render(component),
    render(component, { plainText: true }),
  ])
  const transport = getTransport()

  await transport.sendMail({
    from: process.env.SMTP_FROM,
    html,
    subject,
    text,
    to,
  })
}

export async function sendMagicLinkEmail({
  email,
  url,
}: {
  email: string
  url: string
}) {
  await sendEmail({
    component: MagicLinkEmail({ url }),
    subject: "Sign in to Kiwiburn Voting Portal",
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
  await sendEmail({
    component: VoteConfirmationEmail({ topicId, topicTitle, vote }),
    subject: `Vote recorded — ${topicTitle.replace(/[\r\n]/g, "")}`,
    to: email,
  })
}
