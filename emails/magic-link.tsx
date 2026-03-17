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
          <Section style={card}>
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
            <Hr style={divider} />
            <Text style={footer}>
              If you didn&apos;t request this email, you can safely ignore it.
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
