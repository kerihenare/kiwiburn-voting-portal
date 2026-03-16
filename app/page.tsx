import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { getTopicsWithCounts, getUserVoteForTopic } from "@/lib/db/queries"
import { TopicCard } from "@/components/topic-card"

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const topics = await getTopicsWithCounts()

  const userVotes: Record<number, string | null> = {}
  if (session) {
    for (const topic of topics) {
      userVotes[topic.id] = await getUserVoteForTopic(topic.id, session.user.id)
    }
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold text-[#ab0232]">Community Votes</h1>
        <p className="text-muted-foreground">
          View and participate in community decisions.
        </p>
      </section>
      <div className="space-y-4">
        {topics.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">
            No voting topics yet.
          </p>
        ) : (
          topics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              userVote={userVotes[topic.id]}
            />
          ))
        )}
      </div>
    </div>
  )
}
