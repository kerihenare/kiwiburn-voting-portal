import Link from "next/link"
import { getTopicsWithCounts } from "@/lib/db/queries"
import { getTopicStatus } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function TopicsPage() {
  const topics = await getTopicsWithCounts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#ab0232]">Topics</h1>
        <Button asChild>
          <Link href="/topics/create">Create topic</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>List</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Opens</TableHead>
            <TableHead>Closes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topics.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                No topics yet.
              </TableCell>
            </TableRow>
          ) : (
            topics.map((topic) => {
              const status = getTopicStatus(topic.opensAt, topic.closesAt)
              return (
                <TableRow key={topic.id}>
                  <TableCell>
                    <Link
                      href={`/topics/${topic.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {topic.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {topic.memberListName}
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
                  <TableCell className="text-muted-foreground">
                    {topic.opensAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {topic.closesAt.toLocaleDateString()}
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
