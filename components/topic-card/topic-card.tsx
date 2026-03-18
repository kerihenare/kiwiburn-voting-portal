import Link from "next/link"
import { ResultBars } from "@/components/result-bars"
// import { TimerBadge } from "@/components/timer-badge"
import { Badge as BaseBadge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { glide } from "@/lib/glidepath"
import { getTopicStatus } from "@/lib/types"

interface TopicCardProps {
  topic: {
    closesAt: Date
    description: string | null
    id: string
    memberListName: string | null
    noCount: number
    opensAt: Date
    title: string
    totalVotes: number
    yesCount: number
  }
  userVote?: string | null
}

export function TopicCard(props: TopicCardProps) {
  const status = getTopicStatus(props.topic.opensAt, props.topic.closesAt)

  return (
    <Card>
      <CardContent className="space-y-3">
        {/* <TopicHeader>
          {props.topic.memberListName && (
            <ListName>{props.topic.memberListName}</ListName>
          )}
          <TimerBadge
            closesAt={props.topic.closesAt}
            opensAt={props.topic.opensAt}
          />
        </TopicHeader> */}

        <TopicTitle>{props.topic.title}</TopicTitle>

        {props.topic.description && (
          <TopicDescription>{props.topic.description}</TopicDescription>
        )}
      </CardContent>

      <Footer>
        {status === "closed" && (
          <ResultBars
            noCount={props.topic.noCount}
            totalVotes={props.topic.totalVotes}
            yesCount={props.topic.yesCount}
          />
        )}

        {status === "open" && props.userVote === undefined && (
          <Button asChild size="sm">
            <Link href="/sign-in">Sign in to vote</Link>
          </Button>
        )}

        {status === "open" && props.userVote === null && (
          <Button asChild size="sm">
            <Link href={`/votes/${props.topic.id}`}>Vote now</Link>
          </Button>
        )}

        {status === "open" && typeof props.userVote === "string" && (
          <>
            <Link
              className="text-muted-foreground hover:text-foreground text-sm"
              href={`/votes/${props.topic.id}`}
            >
              Change vote
            </Link>
            <Badge
              className={
                props.userVote === "yes"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              }
              variant="outline"
            >
              You voted {props.userVote}
            </Badge>
          </>
        )}

        {status === "scheduled" && (
          <Button disabled size="sm">
            Vote soon
          </Button>
        )}
      </Footer>
    </Card>
  )
}

const Badge = glide(BaseBadge, {
  borderWidth: "border-0",
  fontSize: "text-sm",
  fontWeight: "font-medium",
  height: "h-8",
  paddingX: "px-3",
})

const Footer = glide(CardFooter, {
  other: "flex flex-wrap items-center justify-end gap-2 mt-4",
})

// const ListName = glide("p", {
//   color: "text-muted-foreground",
//   fontSize: "text-sm",
//   marginBottom: "mb-0",
// })

const TopicDescription = glide("p", {
  color: "text-muted-foreground",
  fontSize: "text-base",
  other: "line-clamp-2 !mt-0",
})

// const TopicHeader = glide("div", {
//   alignItems: "items-center",
//   display: "flex",
//   flexWrap: "flex-wrap",
//   gap: "gap-2",
//   justifyContent: "justify-between",
// })

const TopicTitle = glide("h2", {
  color: "text-accent",
  fontSize: "text-2xl",
  fontWeight: "font-bold",
  other: "!mb-0",
})
