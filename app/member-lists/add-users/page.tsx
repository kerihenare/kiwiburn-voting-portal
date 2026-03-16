"use client"

import { useEffect, useState } from "react"
import { UploadMembersForm } from "@/app/member-lists/[listId]/upload-members-form"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AddUsersPage() {
  const [lists, setLists] = useState<{ id: string; name: string }[]>([])
  const [selectedListId, setSelectedListId] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/member-lists")
      .then((res) => res.json())
      .then(setLists)
  }, [])

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-accent">
        Add users to member list
      </h1>
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <Label>Member list</Label>
            <Select onValueChange={setSelectedListId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a member list" />
              </SelectTrigger>
              <SelectContent>
                {lists.map((list) => (
                  <SelectItem key={list.id} value={list.id}>
                    {list.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedListId && <UploadMembersForm listId={selectedListId} />}
        </CardContent>
      </Card>
    </div>
  )
}
