import Link from "next/link"
import { getMemberListsWithCounts } from "@/lib/db/queries"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function MemberListsPage() {
  const lists = await getMemberListsWithCounts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#ab0232]">Member Lists</h1>
        <Button asChild>
          <Link href="/member-lists/create">Create member list</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Topics</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lists.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                No member lists yet.
              </TableCell>
            </TableRow>
          ) : (
            lists.map((list) => (
              <TableRow key={list.id}>
                <TableCell>
                  <Link
                    href={`/member-lists/${list.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {list.name}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {list.description || "—"}
                </TableCell>
                <TableCell>{list.memberCount}</TableCell>
                <TableCell>{list.topicCount}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
