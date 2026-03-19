"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { useRouter } from "next/navigation"
import { DataTable } from "@/components/ui/data-table"
import { AlignRight, MutedText, NumericCell } from "@/lib/table-styles"

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
      <MutedText>{row.original.description || "No description"}</MutedText>
    ),
    header: "Description",
  },
  {
    accessorKey: "memberCount",
    cell: ({ row }) => <NumericCell>{row.original.memberCount}</NumericCell>,
    header: () => <AlignRight>Members</AlignRight>,
  },
  {
    accessorKey: "topicCount",
    cell: ({ row }) => <NumericCell>{row.original.topicCount}</NumericCell>,
    header: () => <AlignRight>Topics</AlignRight>,
  },
]

interface MemberListsTableProps {
  data: MemberList[]
}

export function MemberListsTable(props: MemberListsTableProps) {
  const router = useRouter()

  return (
    <DataTable
      columns={columns}
      data={props.data}
      emptyMessage="No member lists yet."
      onRowClick={(row) => router.push(`/member-lists/${row.id}`)}
    />
  )
}
