"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UploadMembersForm } from "@/app/member-lists/[listId]/upload-members-form"

export default function AddUsersPage() {
  const [lists, setLists] = useState<{ id: number; name: string }[]>([])
  const [selectedListId, setSelectedListId] = useState<number | null>(null)

  useEffect(() => {
    fetch("/api/member-lists")
      .then((res) => res.json())
      .then(setLists)
  }, [])

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#ab0232]">Add users to member list</h1>
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label>Member list</Label>
            <Select onValueChange={(v) => setSelectedListId(parseInt(v, 10))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a member list" />
              </SelectTrigger>
              <SelectContent>
                {lists.map((list) => (
                  <SelectItem key={list.id} value={String(list.id)}>
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
