import { headers } from "next/headers"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { auth } from "@/lib/auth"
import { getTopic, getUserVoteForTopic } from "@/lib/db/queries"
import { glide } from "@/lib/glidepath"

interface VoteSuccessPageProps {
  params: Promise<{ voteId: string }>
}

export default async function VoteSuccessPage(props: VoteSuccessPageProps) {
  const { voteId: topicId } = await props.params

  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/sign-in")

  const topic = await getTopic(topicId)
  if (!topic) notFound()

  const userVote = await getUserVoteForTopic(topicId, session.user.id)
  if (!userVote) redirect(`/votes/${topicId}`)

  const isYes = userVote === "yes"

  return (
    <CenterWrapper>
      <Card className="max-w-md w-full text-center">
        <CardContent className="pt-8 pb-8 space-y-6">
          <Badge
            className={`text-3xl px-6 py-3 font-bold ${
              isYes
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : "bg-red-100 text-red-800 hover:bg-red-100"
            }`}
          >
            {userVote.toUpperCase()}
          </Badge>
          <SuccessTitle>Vote recorded</SuccessTitle>
          <SuccessMessage>
            Your vote of <strong>{isYes ? "Yes" : "No"}</strong> on &ldquo;
            {topic.title}&rdquo; has been securely recorded. Thank you for
            participating in this KiwiBurn community decision.
          </SuccessMessage>
          <Button asChild>
            <Link href="/">View all votes</Link>
          </Button>
        </CardContent>
      </Card>
    </CenterWrapper>
  )
}

const CenterWrapper = glide("div", {
  alignItems: "items-center",
  display: "flex",
  justifyContent: "justify-center",
  minHeight: "min-h-[60vh]",
})

const SuccessTitle = glide("h1", {
  fontSize: "text-2xl",
  fontWeight: "font-bold",
})

const SuccessMessage = glide("p", {
  color: "text-muted-foreground",
})
