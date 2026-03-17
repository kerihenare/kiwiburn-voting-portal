import Link from "next/link"
import { ResultBars } from "@/components/result-bars"
import { TimerBadge } from "@/components/timer-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getTopicStatus } from "@/lib/types"

interface TopicCardProps {
  topic: {
    id: string
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
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          {topic.memberListName && (
            <p className="mb-0 text-sm text-muted-foreground">
              {topic.memberListName}
            </p>
          )}
          <TimerBadge closesAt={topic.closesAt} opensAt={topic.opensAt} />
        </div>
        <h2 className="text-2xl font-bold text-accent !mb-0">{topic.title}</h2>
        {topic.description && (
          <p className="text-base text-muted-foreground line-clamp-2 !mt-0">
            {topic.description}
          </p>
        )}
        {status === "closed" && (
          <>
            <Separator className="mx-0 my-6 w-full opacity-50" />
            <ResultBars
              noCount={topic.noCount}
              totalVotes={topic.totalVotes}
              yesCount={topic.yesCount}
            />
          </>
        )}
      </CardContent>
      {status === "open" && userVote !== undefined && (
        <>
          <Separator className="opacity-50" />
          <CardFooter className="flex items-center justify-between">
            <div>
              {userVote && (
                <Badge variant="outline">
                  You voted:{" "}
                  {userVote.charAt(0).toUpperCase() + userVote.slice(1)}
                </Badge>
              )}
            </div>
            <Button asChild size="sm">
              <Link href={`/votes/${topic.id}`}>
                {userVote ? "Change vote" : "Vote now"}
              </Link>
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  )
}
