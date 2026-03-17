"use client"

import { useState } from "react"
import { UploadMembersForm } from "@/app/member-lists/[listId]/upload-members-form"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AddUsersFormProps {
  memberLists: { id: string; name: string }[]
}

export function AddUsersForm({ memberLists }: AddUsersFormProps) {
  const [selectedListId, setSelectedListId] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Member list</Label>
        <Select onValueChange={setSelectedListId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a member list" />
          </SelectTrigger>
          <SelectContent>
            {memberLists.map((list) => (
              <SelectItem key={list.id} value={list.id}>
                {list.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selectedListId && <UploadMembersForm listId={selectedListId} />}
    </div>
  )
}
