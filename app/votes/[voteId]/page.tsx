import { headers } from "next/headers"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ResultBars } from "@/components/result-bars"
import { TimerBadge } from "@/components/timer-badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { VoteButtons } from "@/components/vote-buttons"
import { auth } from "@/lib/auth"
import {
  checkEligibility,
  getTopic,
  getUserVoteForTopic,
  getVoteResults,
} from "@/lib/db/queries"
import { glide } from "@/lib/glidepath"
import { getTopicStatus } from "@/lib/types"

interface VotePageProps {
  params: Promise<{ voteId: string }>
}

export default async function VotePage(props: VotePageProps) {
  const { voteId: topicId } = await props.params

  const topic = await getTopic(topicId)
  if (!topic || !topic.isActive) notFound()

  let session = null
  try {
    session = await auth.api.getSession({ headers: await headers() })
  } catch {
    // Stale session cookie — treat as unauthenticated
  }
  const status = getTopicStatus(topic.opensAt, topic.closesAt)
  const results = await getVoteResults(topicId)

  let userVote: string | null = null
  let eligible = false

  if (session) {
    userVote = await getUserVoteForTopic(topicId, session.user.id)
    const eligibility = await checkEligibility(topicId, session.user.id)
    eligible = eligibility.eligible
  }

  return (
    <PageCenter>
      <Card className="max-w-2xl w-full">
        <CardContent className="space-y-6">
          <TopicHeader>
            {topic.memberListName && (
              <ListName>{topic.memberListName}</ListName>
            )}
            <TimerBadge closesAt={topic.closesAt} opensAt={topic.opensAt} />
          </TopicHeader>
          <TopicTitle>{topic.title}</TopicTitle>
          {topic.description && (
            <TopicDescription>{topic.description}</TopicDescription>
          )}

          {status === "closed" ? (
            <ResultsSection>
              <ResultsHeading>Results</ResultsHeading>
              <ResultBars
                noCount={results.noCount}
                totalVotes={results.totalVotes}
                yesCount={results.yesCount}
              />
              {userVote && (
                <Badge variant="outline">
                  You voted:{" "}
                  {userVote.charAt(0).toUpperCase() + userVote.slice(1)}
                </Badge>
              )}
            </ResultsSection>
          ) : !session ? (
            <Button asChild className="w-full">
              <Link href="/sign-in">Sign in to vote</Link>
            </Button>
          ) : !eligible ? (
            <Alert variant="destructive">
              <AlertDescription>
                You are not eligible to vote on this topic.
              </AlertDescription>
            </Alert>
          ) : status === "scheduled" ? (
            <Alert>
              <AlertDescription>
                Voting has not opened yet. Check back later.
              </AlertDescription>
            </Alert>
          ) : (
            <VoteButtons currentVote={userVote} topicId={topicId} />
          )}
        </CardContent>
      </Card>
      <Button asChild className="text-muted-foreground" variant="ghost">
        <Link href="/">
          <svg
            aria-hidden="true"
            className="mr-1"
            fill="none"
            height="16"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to votes
        </Link>
      </Button>
    </PageCenter>
  )
}

const PageCenter = glide("div", {
  alignItems: "items-center",
  display: "flex",
  flex: "flex-1",
  flexDirection: "flex-col",
  gap: "gap-4",
  justifyContent: "justify-center",
})

const TopicHeader = glide("div", {
  alignItems: "items-center",
  display: "flex",
  flexWrap: "flex-wrap",
  gap: "gap-2",
  justifyContent: "justify-between",
})

const ListName = glide("p", {
  color: "text-muted-foreground",
  fontSize: "text-sm",
  marginBottom: "mb-0",
})

const TopicTitle = glide("h1", {
  color: "text-accent",
  fontSize: "text-2xl",
  fontWeight: "font-bold",
  other: "!mb-0",
})

const TopicDescription = glide("p", {
  color: "text-muted-foreground",
  other: "!mt-0",
})

const ResultsSection = glide("section", {
  other: "space-y-6",
})

const ResultsHeading = glide("h2", {
  fontSize: "text-lg",
  fontWeight: "font-semibold",
})
