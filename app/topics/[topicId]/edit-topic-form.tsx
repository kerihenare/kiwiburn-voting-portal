"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateTopic } from "@/lib/actions/topics"

function toLocalDatetime(dateStr: string) {
  const date = new Date(dateStr)
  const offset = date.getTimezoneOffset()
  const local = new Date(date.getTime() - offset * 60000)
  return local.toISOString().slice(0, 16)
}

interface EditTopicFormProps {
  topic: {
    id: number
    title: string
    description: string | null
    memberListId: number
    memberListName: string | null
    opensAt: string // serialized from server component
    closesAt: string
  }
}

export function EditTopicForm({ topic }: EditTopicFormProps) {
  const router = useRouter()
  const [lists, setLists] = useState<{ id: number; name: string }[]>([])
  const [title, setTitle] = useState(topic.title)
  const [description, setDescription] = useState(topic.description ?? "")
  const [memberListId, setMemberListId] = useState(topic.memberListId)
  const [opensAt, setOpensAt] = useState(toLocalDatetime(topic.opensAt))
  const [closesAt, setClosesAt] = useState(toLocalDatetime(topic.closesAt))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/member-lists")
      .then((res) => res.json())
      .then(setLists)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      await updateTopic(topic.id, { title, description, memberListId, opensAt, closesAt })
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Member list</Label>
        <Select value={String(memberListId)} onValueChange={(v) => setMemberListId(parseInt(v, 10))}>
          <SelectTrigger>
            <SelectValue />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="opensAt">Opens at</Label>
          <Input id="opensAt" type="datetime-local" value={opensAt} onChange={(e) => setOpensAt(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="closesAt">Closes at</Label>
          <Input id="closesAt" type="datetime-local" value={closesAt} onChange={(e) => setClosesAt(e.target.value)} required />
        </div>
      </div>
      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
      <Button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : "Update topic"}
      </Button>
    </form>
  )
}
