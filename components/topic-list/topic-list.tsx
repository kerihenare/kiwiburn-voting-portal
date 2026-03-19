import { TopicCard } from "@/components/topic-card/topic-card"
import { getTopicsWithCounts, getUserVotes } from "@/lib/db/queries"
import { glide } from "@/lib/glidepath"

interface TopicListProps {
  userId: null | string
}

export async function TopicList(props: TopicListProps) {
  const [topics, userVotes] = await Promise.all([
    getTopicsWithCounts(),
    props.userId
      ? getUserVotes(props.userId)
      : Promise.resolve({} as Record<string, string | null>),
  ])

  return (
    <List>
      {topics.length === 0 ? (
        <EmptyMessage>No voting topics yet</EmptyMessage>
      ) : (
        topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            userVote={
              props.userId ? (userVotes[topic.id] ?? null) : undefined
            }
          />
        ))
      )}
    </List>
  )
}

const EmptyMessage = glide("p", {
  color: "text-muted-foreground",
  paddingY: "py-12",
  textAlign: "text-center",
})

const List = glide("div", {
  other: "space-y-6",
})
