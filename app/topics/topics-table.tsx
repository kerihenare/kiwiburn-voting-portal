"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { getTopicStatus } from "@/lib/types"

type Topic = {
  id: string
  title: string
  memberListName: string | null
  opensAt: string
  closesAt: string
}

const columns: ColumnDef<Topic>[] = [
  {
    accessorKey: "title",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.title}</span>
    ),
    header: "Title",
  },
  {
    accessorKey: "memberListName",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.memberListName}
      </span>
    ),
    header: "List",
  },
  {
    cell: ({ row }) => {
      const status = getTopicStatus(
        new Date(row.original.opensAt),
        new Date(row.original.closesAt),
      )
      return (
        <div className="text-right">
          <Badge
            className={
              status === "open"
                ? "bg-green-100 text-green-800"
                : status === "scheduled"
                  ? "bg-blue-100 text-blue-800"
                  : ""
            }
            variant={status === "open" ? "default" : "secondary"}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      )
    },
    header: () => <div className="text-right">Status</div>,
    id: "status",
  },
  {
    accessorKey: "opensAt",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {new Date(row.original.opensAt).toLocaleDateString()}
      </span>
    ),
    header: "Opens",
  },
  {
    accessorKey: "closesAt",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {new Date(row.original.closesAt).toLocaleDateString()}
      </span>
    ),
    header: "Closes",
  },
]

export function TopicsTable({ data }: { data: Topic[] }) {
  const router = useRouter()

  return (
    <DataTable
      columns={columns}
      data={data}
      emptyMessage="No topics yet."
      onRowClick={(row) => router.push(`/topics/${row.id}`)}
    />
  )
}
