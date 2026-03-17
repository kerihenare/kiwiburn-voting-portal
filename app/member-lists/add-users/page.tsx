import { Card, CardContent } from "@/components/ui/card"
import { requireAdmin } from "@/lib/auth-guard"
import { getAllMemberLists } from "@/lib/db/queries"
import { AddUsersForm } from "./add-users-form"

export default async function AddUsersPage() {
  await requireAdmin()
  const memberLists = await getAllMemberLists()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-accent">
        Add users to member list
      </h1>
      <Card>
        <CardContent className="pt-6">
          <AddUsersForm memberLists={memberLists} />
        </CardContent>
      </Card>
    </div>
  )
}
