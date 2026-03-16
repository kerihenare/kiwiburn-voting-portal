import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { TimerBadge } from "@/components/timer-badge"
import { ResultBars } from "@/components/result-bars"
import { VoteButtons } from "@/components/vote-buttons"
import { getTopic, getVoteResults, getUserVoteForTopic, checkEligibility } from "@/lib/db/queries"
import { getTopicStatus } from "@/lib/types"
import Link from "next/link"

export default async function VotePage({
  params,
}: {
  params: Promise<{ voteId: string }>
}) {
  const { voteId } = await params
  const topicId = parseInt(voteId, 10)
  if (isNaN(topicId)) notFound()

  const topic = await getTopic(topicId)
  if (!topic) notFound()

  const session = await auth.api.getSession({ headers: await headers() })
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
    <Card className="max-w-2xl mx-auto">
      <CardContent className="pt-6 space-y-4">
        <TimerBadge opensAt={topic.opensAt} closesAt={topic.closesAt} />
        <h1 className="text-2xl font-bold text-[#ab0232]">{topic.title}</h1>
        {topic.description && (
          <p className="text-muted-foreground">{topic.description}</p>
        )}
        <Separator />

        {status === "closed" ? (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Results</h2>
            <ResultBars
              yesCount={results.yesCount}
              noCount={results.noCount}
              totalVotes={results.totalVotes}
            />
            {userVote && (
              <Badge variant="outline">
                You voted: {userVote.charAt(0).toUpperCase() + userVote.slice(1)}
              </Badge>
            )}
          </section>
        ) : !session ? (
          <Alert>
            <AlertDescription>
              Please <Link href="/sign-in" className="underline font-medium">sign in</Link> to cast your vote.
            </AlertDescription>
          </Alert>
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
          <VoteButtons topicId={topicId} currentVote={userVote} />
        )}
      </CardContent>
    </Card>
  )
}
