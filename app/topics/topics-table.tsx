"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { glide } from "@/lib/glidepath"
import { getTopicStatus } from "@/lib/types"

type Topic = {
  id: string
  title: string
  isActive: boolean
  memberListName: string | null
  opensAt: string
  closesAt: string
}

const columns: ColumnDef<Topic>[] = [
  {
    accessorKey: "title",
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.title}
        {!row.original.isActive && (
          <Badge
            className="ml-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            variant="secondary"
          >
            Draft
          </Badge>
        )}
      </span>
    ),
    header: "Title",
  },
  {
    accessorKey: "memberListName",
    cell: ({ row }) => <MutedText>{row.original.memberListName}</MutedText>,
    header: "List",
  },
  {
    cell: ({ row }) => {
      const status = getTopicStatus(
        new Date(row.original.opensAt),
        new Date(row.original.closesAt),
      )
      return (
        <AlignRight>
          <Badge
            className={
              status === "open"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : status === "scheduled"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  : ""
            }
            variant={status === "open" ? "default" : "secondary"}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </AlignRight>
      )
    },
    header: () => <AlignRight>Status</AlignRight>,
    id: "status",
  },
  {
    accessorKey: "opensAt",
    cell: ({ row }) => (
      <MutedText>
        {new Date(row.original.opensAt).toLocaleDateString()}
      </MutedText>
    ),
    header: "Opens",
  },
  {
    accessorKey: "closesAt",
    cell: ({ row }) => (
      <MutedText>
        {new Date(row.original.closesAt).toLocaleDateString()}
      </MutedText>
    ),
    header: "Closes",
  },
]

interface TopicsTableProps {
  data: Topic[]
}

export function TopicsTable(props: TopicsTableProps) {
  const router = useRouter()

  return (
    <DataTable
      columns={columns}
      data={props.data}
      emptyMessage="No topics yet."
      onRowClick={(row) => router.push(`/topics/${row.id}`)}
    />
  )
}

const MutedText = glide("span", {
  color: "text-muted-foreground",
})

const AlignRight = glide("div", {
  textAlign: "text-right",
})
