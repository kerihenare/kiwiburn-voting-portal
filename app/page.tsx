import { headers } from "next/headers"
import { TopicCard } from "@/components/topic-card"
import { auth } from "@/lib/auth"
import { getTopicsWithCounts, getUserVoteForTopic } from "@/lib/db/queries"
import { glide } from "@/lib/glidepath"

export default async function HomePage() {
  let session = null
  try {
    session = await auth.api.getSession({ headers: await headers() })
  } catch {
    // Stale session cookie — treat as unauthenticated
  }
  const topics = await getTopicsWithCounts()

  const userVotes: Record<string, string | null> = {}
  if (session) {
    for (const topic of topics) {
      userVotes[topic.id] = await getUserVoteForTopic(topic.id, session.user.id)
    }
  }

  return (
    <PageContent>
      <section>
        <PageTitle>Community Votes</PageTitle>
        <PageSubtitle>
          View and participate in community decisions.
        </PageSubtitle>
      </section>
      <TopicList>
        {topics.length === 0 ? (
          <EmptyMessage>No voting topics yet.</EmptyMessage>
        ) : (
          topics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              userVote={userVotes[topic.id]}
            />
          ))
        )}
      </TopicList>
    </PageContent>
  )
}

const PageContent = glide("div", {
  other: "space-y-6",
})

const PageTitle = glide("h1", {
  color: "text-accent",
  fontSize: "text-2xl",
  fontWeight: "font-bold",
  other: "!mb-0",
})

const PageSubtitle = glide("p", {
  color: "text-muted-foreground",
  other: "!mt-0",
})

const TopicList = glide("div", {
  other: "space-y-6",
})

const EmptyMessage = glide("p", {
  color: "text-muted-foreground",
  paddingY: "py-12",
  textAlign: "text-center",
})
