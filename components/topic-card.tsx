import Link from "next/link"
import { ResultBars } from "@/components/result-bars"
import { TimerBadge } from "@/components/timer-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { glide } from "@/lib/glidepath"
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

export function TopicCard(props: TopicCardProps) {
  const status = getTopicStatus(props.topic.opensAt, props.topic.closesAt)

  return (
    <Card>
      <CardContent className="space-y-3">
        <TopicHeader>
          {props.topic.memberListName && (
            <ListName>{props.topic.memberListName}</ListName>
          )}
          <TimerBadge
            closesAt={props.topic.closesAt}
            opensAt={props.topic.opensAt}
          />
        </TopicHeader>
        <TopicTitle>{props.topic.title}</TopicTitle>
        {props.topic.description && (
          <TopicDescription>{props.topic.description}</TopicDescription>
        )}
        {status === "closed" && (
          <>
            <Separator className="mx-0 my-6 w-full opacity-50" />
            <ResultBars
              noCount={props.topic.noCount}
              totalVotes={props.topic.totalVotes}
              yesCount={props.topic.yesCount}
            />
          </>
        )}
      </CardContent>
      {status === "open" && props.userVote !== undefined && (
        <>
          <Separator className="opacity-50" />
          <CardFooter className="flex flex-wrap items-center justify-between gap-2">
            <div>
              {props.userVote && (
                <Badge variant="outline">
                  You voted:{" "}
                  {props.userVote.charAt(0).toUpperCase() +
                    props.userVote.slice(1)}
                </Badge>
              )}
            </div>
            <Button asChild size="sm">
              <Link href={`/votes/${props.topic.id}`}>
                {props.userVote ? "Change vote" : "Vote now"}
              </Link>
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  )
}

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

const TopicTitle = glide("h2", {
  color: "text-accent",
  fontSize: "text-2xl",
  fontWeight: "font-bold",
  other: "!mb-0",
})

const TopicDescription = glide("p", {
  color: "text-muted-foreground",
  fontSize: "text-base",
  other: "line-clamp-2 !mt-0",
})
