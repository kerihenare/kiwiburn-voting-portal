import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { requireAdmin } from "@/lib/auth-guard"
import { getMemberList } from "@/lib/db/queries"
import { AddMemberForm } from "./add-member-form"
import { DeleteListButton } from "./delete-list-button"
import { EditListForm } from "./edit-list-form"
import { MembersTable } from "./members-table"
import { ListTopicsTable } from "./topics-table"
import { UploadMembersForm } from "./upload-members-form"

export default async function MemberListEditPage({
  params,
}: {
  params: Promise<{ listId: string }>
}) {
  await requireAdmin()
  const { listId: id } = await params

  const list = await getMemberList(id)
  if (!list) notFound()

  const serializedMembers = list.members.map((m) => ({
    createdAt: m.createdAt.toISOString(),
    email: m.email,
    id: m.id,
  }))

  const serializedTopics = list.topics.map((t) => ({
    closesAt: t.closesAt.toISOString(),
    id: t.id,
    opensAt: t.opensAt.toISOString(),
    title: t.title,
  }))

  return (
    <div className="space-y-6">
      <Tabs defaultValue="edit">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-accent">{list.name}</h1>
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent className="space-y-6" value="edit">
          <Card>
            <CardContent className="">
              <EditListForm list={list} />
            </CardContent>
          </Card>
          {!list.topics.length && <DeleteListButton listId={id} />}
        </TabsContent>

        <TabsContent className="space-y-6" value="members">
          <Card>
            <CardContent className="space-y-3">
              <div className="flex gap-2 items-start">
                <AddMemberForm listId={id} />
                <UploadMembersForm listId={id} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <MembersTable data={serializedMembers} listId={id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topics">
          <Card>
            <CardContent className=" space-y-6">
              {serializedTopics.length > 0 ? (
                <ListTopicsTable data={serializedTopics} />
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No topics linked to this list.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
