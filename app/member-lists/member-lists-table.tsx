"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { useRouter } from "next/navigation"
import { DataTable } from "@/components/ui/data-table"

type MemberList = {
  id: string
  name: string
  description: string | null
  memberCount: number
  topicCount: number
}

const columns: ColumnDef<MemberList>[] = [
  {
    accessorKey: "name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    header: "Name",
  },
  {
    accessorKey: "description",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.description || "No description"}
      </span>
    ),
    header: "Description",
  },
  {
    accessorKey: "memberCount",
    cell: ({ row }) => (
      <div className="text-right tabular-nums">{row.original.memberCount}</div>
    ),
    header: () => <div className="text-right">Members</div>,
  },
  {
    accessorKey: "topicCount",
    cell: ({ row }) => (
      <div className="text-right tabular-nums">{row.original.topicCount}</div>
    ),
    header: () => <div className="text-right">Topics</div>,
  },
]

export function MemberListsTable({ data }: { data: MemberList[] }) {
  const router = useRouter()

  return (
    <DataTable
      columns={columns}
      data={data}
      emptyMessage="No member lists yet."
      onRowClick={(row) => router.push(`/member-lists/${row.id}`)}
    />
  )
}
