import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { requireAdmin } from "@/lib/auth-guard"
import { getTopic } from "@/lib/db/queries"
import { EditTopicForm } from "./edit-topic-form"

export default async function TopicEditPage({
  params,
}: {
  params: Promise<{ topicId: string }>
}) {
  await requireAdmin()
  const { topicId: id } = await params

  const topic = await getTopic(id)
  if (!topic) notFound()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-accent">Edit topic</h1>

      <Card>
        <CardContent>
          <EditTopicForm
            topic={{
              ...topic,
              closesAt: topic.closesAt.toISOString(),
              opensAt: topic.opensAt.toISOString(),
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
