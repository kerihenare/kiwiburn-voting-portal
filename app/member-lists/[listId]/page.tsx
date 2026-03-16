import { notFound } from "next/navigation"
import { getMemberList } from "@/lib/db/queries"
import { getTopicStatus } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { EditListForm } from "./edit-list-form"
import { AddMemberForm } from "./add-member-form"
import { UploadMembersForm } from "./upload-members-form"
import { RemoveMemberButton } from "./remove-member-button"
import { DeleteListButton } from "./delete-list-button"

export default async function MemberListEditPage({
  params,
}: {
  params: Promise<{ listId: string }>
}) {
  const { listId } = await params
  const id = parseInt(listId, 10)
  if (isNaN(id)) notFound()

  const list = await getMemberList(id)
  if (!list) notFound()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#ab0232]">{list.name}</h1>

      <Card>
        <CardContent className="pt-6">
          <EditListForm list={list} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <h2 className="text-lg font-semibold">Members</h2>
          <div className="flex gap-2">
            <AddMemberForm listId={id} />
          </div>
          <UploadMembersForm listId={id} />
          <Separator />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.members.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                    No members yet.
                  </TableCell>
                </TableRow>
              ) : (
                list.members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.email}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {member.createdAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <RemoveMemberButton memberId={member.id} listId={id} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {list.topics.length > 0 && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-lg font-semibold">Topics</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.topics.map((topic) => {
                  const status = getTopicStatus(topic.opensAt, topic.closesAt)
                  return (
                    <TableRow key={topic.id}>
                      <TableCell>
                        <Link href={`/topics/${topic.id}`} className="text-primary hover:underline">
                          {topic.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={status === "open" ? "default" : "secondary"}
                          className={
                            status === "open"
                              ? "bg-green-100 text-green-800"
                              : status === "scheduled"
                                ? "bg-blue-100 text-blue-800"
                                : ""
                          }
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <DeleteListButton listId={id} hasTopics={list.topics.length > 0} />
    </div>
  )
}
