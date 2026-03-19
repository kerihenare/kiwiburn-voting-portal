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
            <Text style={footer}>Kiwiburn Voting Portal</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
