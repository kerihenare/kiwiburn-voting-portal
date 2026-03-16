import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components"

interface VoteConfirmationEmailProps {
  topicTitle: string
  vote: string
}

export default function VoteConfirmationEmail({
  topicTitle,
  vote,
}: VoteConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Vote recorded — {topicTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Vote recorded</Heading>
          <Text style={text}>
            Your vote of <strong>{vote.toUpperCase()}</strong> on &ldquo;
            {topicTitle}&rdquo; has been securely recorded.
          </Text>
          <Text style={text}>
            Thank you for participating in this KiwiBurn community decision. You
            can change your vote while voting is open.
          </Text>
          <Button href={`${process.env.BETTER_AUTH_URL}`} style={button}>
            View all votes
          </Button>
        </Container>
      </Body>
    </Html>
  )
}

const main = { backgroundColor: "#f3f4f6", fontFamily: "Inter, sans-serif" }
const container = { margin: "0 auto", maxWidth: "480px", padding: "40px 20px" }
const heading = {
  color: "#ab0232",
  fontSize: "24px",
  fontWeight: "bold" as const,
}
const text = { color: "#000000", fontSize: "16px", lineHeight: "24px" }
const button = {
  backgroundColor: "#ed7703",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold" as const,
  padding: "12px 24px",
  textDecoration: "none",
}
