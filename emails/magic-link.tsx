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
import {
  button,
  buttonSection,
  card,
  container,
  divider,
  footer,
  heading,
  main,
  text,
} from "./styles"

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
