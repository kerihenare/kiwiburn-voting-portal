import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { requireAdmin } from "@/lib/auth-guard"
import { getMemberListsWithCounts } from "@/lib/db/queries"
import { MemberListsTable } from "./member-lists-table"

export default async function MemberListsPage() {
  await requireAdmin()
  const lists = await getMemberListsWithCounts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-accent">Member Lists</h1>
        <Button asChild>
          <Link href="/member-lists/create">Create member list</Link>
        </Button>
      </div>
      <Card>
        <CardContent>
          <MemberListsTable data={lists} />
        </CardContent>
      </Card>
    </div>
  )
}
