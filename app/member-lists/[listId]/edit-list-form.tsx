"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateMemberList } from "@/lib/actions/member-lists"

interface EditListFormProps {
  list: { id: string; name: string; description: string | null }
}

export function EditListForm({ list }: EditListFormProps) {
  const router = useRouter()
  const [name, setName] = useState(list.name)
  const [description, setDescription] = useState(list.description ?? "")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await updateMemberList(list.id, { description, name })
      router.refresh()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          onChange={(e) => setName(e.target.value)}
          required
          value={name}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />
      </div>
      <div className="flex justify-end">
        <Button disabled={submitting} type="submit">
          {submitting ? "Saving\u2026" : "Save changes"}
        </Button>
      </div>
    </form>
  )
}
