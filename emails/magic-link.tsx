import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface MagicLinkEmailProps {
  url: string
}

export default function MagicLinkEmail({ url }: MagicLinkEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Sign in to Kiwiburn Voting Portal</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Sign in to vote</Heading>
          <Text style={text}>
            Click the button below to sign in to the Kiwiburn Voting Portal.
            This link will expire in 15 minutes.
          </Text>
          <Section style={buttonSection}>
            <Button href={url} style={button}>
              Sign in to Kiwiburn
            </Button>
          </Section>
          <Text style={footer}>
            If you didn&apos;t request this email, you can safely ignore it.
          </Text>
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
const buttonSection = { margin: "32px 0", textAlign: "center" as const }
const button = {
  backgroundColor: "#ed7703",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold" as const,
  padding: "12px 24px",
  textDecoration: "none",
}
const footer = { color: "#666666", fontSize: "14px" }
