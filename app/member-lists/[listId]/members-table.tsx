"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { RemoveMemberButton } from "./remove-member-button"

type Member = {
  id: string
  email: string
  createdAt: string
}

export function MembersTable({
  data,
  listId,
}: {
  data: Member[]
  listId: string
}) {
  const columns: ColumnDef<Member>[] = [
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "createdAt",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </span>
      ),
      header: "Added",
    },
    {
      cell: ({ row }) => (
        <div className="text-right">
          <RemoveMemberButton listId={listId} memberId={row.original.id} />
        </div>
      ),
      header: "",
      id: "actions",
    },
  ]

  return (
    <DataTable columns={columns} data={data} emptyMessage="No members yet." />
  )
}
