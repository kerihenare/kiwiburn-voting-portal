import { Flame } from "lucide-react"
import { TopicCard } from "@/components/topic-card/topic-card"
import { getTopicsWithCounts, getUserVotes } from "@/lib/db/queries"
import { glide } from "@/lib/glidepath"
import { getSession } from "@/lib/session"

export default async function HomePage() {
  const [session, topics] = await Promise.all([
    getSession(),
    getTopicsWithCounts(),
  ])
  const userVotes = session ? await getUserVotes(session.user.id) : {}

  return (
    <PageContent>
      <HeroSection>
        <IconRow>
          <IconBadge>
            <Flame className="size-12 text-primary" />
          </IconBadge>
        </IconRow>
        <HeroTitle>Kiwiburn Voting Portal</HeroTitle>
        <HeroSubtitle>
          Your voice matters. Cast your vote on important community decisions
          and help shape the future of Kiwiburn.
        </HeroSubtitle>
      </HeroSection>

      <TopicList>
        {topics.length === 0 ? (
          <EmptyMessage>No voting topics yet</EmptyMessage>
        ) : (
          topics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              userVote={session ? (userVotes[topic.id] ?? null) : undefined}
            />
          ))
        )}
      </TopicList>
    </PageContent>
  )
}

const EmptyMessage = glide("p", {
  color: "text-muted-foreground",
  paddingY: "py-12",
  textAlign: "text-center",
})

const HeroSection = glide("section", {
  marginBottom: "mb-8",
  textAlign: "text-center",
})

const HeroSubtitle = glide("p", {
  color: "text-muted-foreground",
  fontSize: "text-lg",
  marginX: "mx-auto",
  maxWidth: "max-w-2xl",
  textWrap: "text-balance",
})

const HeroTitle = glide("h1", {
  color: "text-foreground",
  fontSize: "text-4xl",
  fontWeight: "font-bold",
  marginBottom: "mb-4",
  other: "text-balance",
})

const IconBadge = glide("div", {
  backgroundColor: "bg-primary/10",
  borderRadius: "rounded-full",
  padding: "p-4",
})

const IconRow = glide("div", {
  display: "flex",
  justifyContent: "justify-center",
  marginBottom: "mb-4",
})

const PageContent = glide("div", {
  other: "space-y-6",
})

const TopicList = glide("div", {
  other: "space-y-6",
})
