import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { requireAdmin } from "@/lib/auth-guard"
import { getAdminTopicsWithCounts } from "@/lib/db/queries"
import { TopicsTable } from "./topics-table"

export default async function TopicsPage() {
  await requireAdmin()
  const topics = await getAdminTopicsWithCounts()

  const serializedTopics = topics.map((t) => ({
    closesAt: t.closesAt.toISOString(),
    id: t.id,
    isActive: t.isActive,
    memberListName: t.memberListName,
    opensAt: t.opensAt.toISOString(),
    title: t.title,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-accent">Topics</h1>
        <Button asChild>
          <Link href="/topics/create">Create topic</Link>
        </Button>
      </div>
      <Card>
        <CardContent>
          <TopicsTable data={serializedTopics} />
        </CardContent>
      </Card>
    </div>
  )
}
