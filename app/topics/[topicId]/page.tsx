import { notFound } from "next/navigation"
import { getTopic, getVoteResults } from "@/lib/db/queries"
import { Card, CardContent } from "@/components/ui/card"
import { ResultBars } from "@/components/result-bars"
import { EditTopicForm } from "./edit-topic-form"
import { DeleteTopicButton } from "./delete-topic-button"

export default async function TopicEditPage({
  params,
}: {
  params: Promise<{ topicId: string }>
}) {
  const { topicId } = await params
  const id = parseInt(topicId, 10)
  if (isNaN(id)) notFound()

  const topic = await getTopic(id)
  if (!topic) notFound()

  const results = await getVoteResults(id)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#ab0232]">Edit topic</h1>

      <Card>
        <CardContent className="pt-6">
          <EditTopicForm
            topic={{
              ...topic,
              opensAt: topic.opensAt.toISOString(),
              closesAt: topic.closesAt.toISOString(),
            }}
          />
        </CardContent>
      </Card>

      {results.totalVotes > 0 && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-lg font-semibold">Vote Results</h2>
            <ResultBars
              yesCount={results.yesCount}
              noCount={results.noCount}
              totalVotes={results.totalVotes}
            />
          </CardContent>
        </Card>
      )}

      <DeleteTopicButton topicId={id} />
    </div>
  )
}
