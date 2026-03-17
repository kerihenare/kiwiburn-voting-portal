import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { requireAdmin } from "@/lib/auth-guard"
import { getAdminTopicsWithCounts } from "@/lib/db/queries"
import { glide } from "@/lib/glidepath"
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
    <PageContent>
      <PageHeader>
        <PageTitle>Topics</PageTitle>
        <Button asChild>
          <Link href="/topics/create">Create topic</Link>
        </Button>
      </PageHeader>
      <Card>
        <CardContent>
          <TopicsTable data={serializedTopics} />
        </CardContent>
      </Card>
    </PageContent>
  )
}

const PageContent = glide("div", {
  other: "space-y-6",
})

const PageHeader = glide("div", {
  alignItems: "items-center",
  display: "flex",
  justifyContent: "justify-between",
})

const PageTitle = glide("h1", {
  color: "text-accent",
  fontSize: "text-2xl",
  fontWeight: "font-bold",
})
