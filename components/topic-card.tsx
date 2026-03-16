import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { TimerBadge } from "@/components/timer-badge"
import { ResultBars } from "@/components/result-bars"
import { getTopicStatus } from "@/lib/types"

interface TopicCardProps {
  topic: {
    id: number
    title: string
    description: string | null
    memberListName: string | null
    opensAt: Date
    closesAt: Date
    yesCount: number
    noCount: number
    totalVotes: number
  }
  userVote?: string | null
}

export function TopicCard({ topic, userVote }: TopicCardProps) {
  const status = getTopicStatus(topic.opensAt, topic.closesAt)

  return (
    <Card>
      <CardContent className="pt-6 space-y-3">
        <TimerBadge opensAt={topic.opensAt} closesAt={topic.closesAt} />
        {topic.memberListName && (
          <p className="text-sm text-muted-foreground">{topic.memberListName}</p>
        )}
        <h2 className="text-lg font-bold text-[#ab0232]">{topic.title}</h2>
        {topic.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {topic.description}
          </p>
        )}
        {status === "closed" && (
          <ResultBars
            yesCount={topic.yesCount}
            noCount={topic.noCount}
            totalVotes={topic.totalVotes}
          />
        )}
      </CardContent>
      <Separator />
      <CardFooter className="flex items-center justify-between py-3">
        <div>
          {userVote && (
            <Badge variant="outline">
              You voted: {userVote.charAt(0).toUpperCase() + userVote.slice(1)}
            </Badge>
          )}
        </div>
        <Button asChild size="sm">
          <Link href={`/votes/${topic.id}`}>
            {status === "closed"
              ? "View results"
              : userVote
                ? "Change vote"
                : "Vote now"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
