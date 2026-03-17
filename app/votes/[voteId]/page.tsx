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
import { getTopicStatus } from "@/lib/types"

export default async function VotePage({
  params,
}: {
  params: Promise<{ voteId: string }>
}) {
  const { voteId: topicId } = await params

  const topic = await getTopic(topicId)
  if (!topic || !topic.isActive) notFound()

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
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <Card className="max-w-2xl w-full">
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            {topic.memberListName && (
              <p className="mb-0 text-sm text-muted-foreground">
                {topic.memberListName}
              </p>
            )}
            <TimerBadge closesAt={topic.closesAt} opensAt={topic.opensAt} />
          </div>
          <h1 className="text-2xl font-bold text-accent !mb-0">
            {topic.title}
          </h1>
          {topic.description && (
            <p className="text-muted-foreground !mt-0">{topic.description}</p>
          )}

          {status === "closed" ? (
            <section className="space-y-6">
              <h2 className="text-lg font-semibold">Results</h2>
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
            </section>
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
    </div>
  )
}
