"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { glide } from "@/lib/glidepath"
import { RemoveMemberButton } from "./remove-member-button"

type Member = {
  id: string
  email: string
  createdAt: string
}

interface MembersTableProps {
  data: Member[]
  listId: string
}

export function MembersTable(props: MembersTableProps) {
  const columns: ColumnDef<Member>[] = [
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "createdAt",
      cell: ({ row }) => (
        <MutedText>
          {new Date(row.original.createdAt).toLocaleDateString()}
        </MutedText>
      ),
      header: "Added",
    },
    {
      cell: ({ row }) => (
        <AlignRight>
          <RemoveMemberButton
            listId={props.listId}
            memberId={row.original.id}
          />
        </AlignRight>
      ),
      header: "",
      id: "actions",
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={props.data}
      emptyMessage="No members yet."
    />
  )
}

const MutedText = glide("span", {
  color: "text-muted-foreground",
})

const AlignRight = glide("div", {
  textAlign: "text-right",
})
