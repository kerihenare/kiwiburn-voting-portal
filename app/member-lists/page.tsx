import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { requireAdmin } from "@/lib/auth-guard"
import { getMemberListsWithCounts } from "@/lib/db/queries"
import { glide } from "@/lib/glidepath"
import { MemberListsTable } from "./member-lists-table"

export default async function MemberListsPage() {
  await requireAdmin()
  const lists = await getMemberListsWithCounts()

  return (
    <PageContent>
      <PageHeader>
        <PageTitle>Member Lists</PageTitle>
        <Button asChild>
          <Link href="/member-lists/create">Create member list</Link>
        </Button>
      </PageHeader>
      <Card>
        <CardContent>
          <MemberListsTable data={lists} />
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
  flexWrap: "flex-wrap",
  gap: "gap-3",
  justifyContent: "justify-between",
})

const PageTitle = glide("h1", {
  color: "text-accent",
  fontSize: "text-2xl",
  fontWeight: "font-bold",
})
