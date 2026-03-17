import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { requireAdmin } from "@/lib/auth-guard"
import { getMemberList } from "@/lib/db/queries"
import { glide } from "@/lib/glidepath"
import { AddMemberForm } from "./add-member-form"
import { DeleteListButton } from "./delete-list-button"
import { EditListForm } from "./edit-list-form"
import { MembersTable } from "./members-table"
import { ListTopicsTable } from "./topics-table"
import { UploadMembersForm } from "./upload-members-form"

interface MemberListEditPageProps {
  params: Promise<{ listId: string }>
}

export default async function MemberListEditPage(
  props: MemberListEditPageProps,
) {
  await requireAdmin()
  const { listId: id } = await props.params

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
    <PageContent>
      <Tabs defaultValue="edit">
        <TabHeader>
          <PageTitle>{list.name}</PageTitle>
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
          </TabsList>
        </TabHeader>

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
              <MemberActions>
                <AddMemberForm listId={id} />
                <UploadMembersForm listId={id} />
              </MemberActions>
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
                <EmptyMessage>No topics linked to this list.</EmptyMessage>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContent>
  )
}

const PageContent = glide("div", {
  other: "space-y-6",
})

const TabHeader = glide("div", {
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

const MemberActions = glide("div", {
  alignItems: "items-start",
  display: "flex",
  flexWrap: "flex-wrap",
  gap: "gap-2",
})

const EmptyMessage = glide("p", {
  color: "text-muted-foreground",
  paddingY: "py-8",
  textAlign: "text-center",
})
