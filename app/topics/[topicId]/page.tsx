import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { requireAdmin } from "@/lib/auth-guard"
import { getAllMemberLists, getTopic } from "@/lib/db/queries"
import { glide } from "@/lib/glidepath"
import { EditTopicForm } from "./edit-topic-form"

interface TopicEditPageProps {
  params: Promise<{ topicId: string }>
}

export default async function TopicEditPage(props: TopicEditPageProps) {
  await requireAdmin()
  const { topicId: id } = await props.params

  const [topic, memberLists] = await Promise.all([
    getTopic(id),
    getAllMemberLists(),
  ])
  if (!topic) notFound()

  return (
    <PageContent>
      <PageTitle>Edit topic</PageTitle>

      <Card>
        <CardContent>
          <EditTopicForm
            memberLists={memberLists}
            topic={{
              ...topic,
              closesAt: topic.closesAt?.toISOString() ?? null,
              isActive: topic.isActive,
              opensAt: topic.opensAt?.toISOString() ?? null,
            }}
          />
        </CardContent>
      </Card>
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
})
