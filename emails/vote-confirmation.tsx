import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface VoteConfirmationEmailProps {
  topicId: string
  topicTitle: string
  vote: string
}

export default function VoteConfirmationEmail({
  topicId,
  topicTitle,
  vote,
}: VoteConfirmationEmailProps) {
  const topicUrl = `${process.env.BETTER_AUTH_URL}/votes/${topicId}`

  return (
    <Html>
      <Head />
      <Preview>
        You voted {vote.toUpperCase()} on &ldquo;{topicTitle}&rdquo;
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={card}>
            <Heading style={heading}>Vote recorded</Heading>
            <Text style={text}>
              Your vote of <strong>{vote.toUpperCase()}</strong> on &ldquo;
              {topicTitle}&rdquo; has been securely recorded.
            </Text>
            <Text style={text}>
              Thank you for participating in this KiwiBurn community decision.
              You can change your vote while voting is open.
            </Text>
            <Section style={buttonSection}>
              <Button href={topicUrl} style={button}>
                View this topic
              </Button>
            </Section>
            <Hr style={divider} />
            <Text style={footer}>
              Kiwiburn Voting Portal
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#f5f0eb",
  fontFamily:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
}
const container = {
  margin: "0 auto",
  maxWidth: "480px",
  padding: "40px 20px",
}
const card = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5ddd5",
  borderRadius: "12px",
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  padding: "32px",
}
const heading = {
  color: "#ab0232",
  fontSize: "24px",
  fontWeight: "bold" as const,
  margin: "0 0 16px",
}
const text = {
  color: "#1a1a1a",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 8px",
}
const buttonSection = {
  margin: "24px 0",
  textAlign: "center" as const,
}
const button = {
  backgroundColor: "#ed7703",
  borderRadius: "8px",
  color: "#ffffff",
  display: "inline-block" as const,
  fontSize: "16px",
  fontWeight: "600" as const,
  padding: "12px 24px",
  textDecoration: "none",
}
const divider = {
  borderColor: "#e5ddd5",
  margin: "24px 0 16px",
}
const footer = {
  color: "#7a7067",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0",
}
