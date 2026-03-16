export async function sendMagicLinkEmail({ email, url }: { email: string; url: string }) {
  console.log(`[DEV] Magic link for ${email}: ${url}`)
}

export async function sendVoteConfirmationEmail({ email, topicTitle, vote }: { email: string; topicTitle: string; vote: string }) {
  console.log(`[DEV] Vote confirmation for ${email}: ${vote} on "${topicTitle}"`)
}
