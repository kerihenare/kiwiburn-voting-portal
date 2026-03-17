"use client"

import type { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { glide } from "@/lib/glidepath"
import { getTopicStatus } from "@/lib/types"

type Topic = {
  id: string
  title: string
  opensAt: string
  closesAt: string
}

const columns: ColumnDef<Topic>[] = [
  {
    accessorKey: "title",
    cell: ({ row }) => (
      <Link
        className="text-primary hover:underline"
        href={`/topics/${row.original.id}`}
      >
        {row.original.title}
      </Link>
    ),
    header: "Title",
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
                ? "bg-green-100 text-green-800"
                : status === "scheduled"
                  ? "bg-blue-100 text-blue-800"
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
]

interface ListTopicsTableProps {
  data: Topic[]
}

export function ListTopicsTable(props: ListTopicsTableProps) {
  return <DataTable columns={columns} data={props.data} />
}

const AlignRight = glide("div", {
  textAlign: "text-right",
})
