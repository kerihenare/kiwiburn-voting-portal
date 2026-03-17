import { Card, CardContent } from "@/components/ui/card"
import { requireAdmin } from "@/lib/auth-guard"
import { getAllMemberLists } from "@/lib/db/queries"
import { CreateTopicForm } from "./create-topic-form"

export default async function CreateTopicPage() {
  await requireAdmin()
  const memberLists = await getAllMemberLists()

  return (
    <div className="max-w-screen-xl mx-auto w-full space-y-6">
      <h1 className="text-2xl font-bold text-accent">Create topic</h1>
      <Card>
        <CardContent>
          <CreateTopicForm memberLists={memberLists} />
        </CardContent>
      </Card>
    </div>
  )
}
