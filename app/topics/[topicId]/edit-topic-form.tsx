"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { updateTopic } from "@/lib/actions/topics"
import { DeleteTopicButton } from "./delete-topic-button"

function toLocalDatetime(dateStr: string) {
  const date = new Date(dateStr)
  const offset = date.getTimezoneOffset()
  const local = new Date(date.getTime() - offset * 60000)
  return local.toISOString().slice(0, 16)
}

interface EditTopicFormProps {
  topic: {
    id: string
    title: string
    description: string | null
    isActive: boolean
    memberListId: string
    memberListName: string | null
    opensAt: string // serialized from server component
    closesAt: string
  }
}

export function EditTopicForm({ topic }: EditTopicFormProps) {
  const router = useRouter()
  const [lists, setLists] = useState<{ id: string; name: string }[]>([])
  const [title, setTitle] = useState(topic.title)
  const [description, setDescription] = useState(topic.description ?? "")
  const [memberListId, setMemberListId] = useState(topic.memberListId)
  const [opensAt, setOpensAt] = useState(toLocalDatetime(topic.opensAt))
  const [closesAt, setClosesAt] = useState(toLocalDatetime(topic.closesAt))
  const [isActive, setIsActive] = useState(topic.isActive)
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
      await updateTopic(topic.id, {
        closesAt,
        description,
        isActive,
        memberListId,
        opensAt,
        title,
      })
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          onChange={(e) => setTitle(e.target.value)}
          required
          value={title}
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
      <div className="space-y-2">
        <Label>Member list</Label>
        <Select onValueChange={setMemberListId} value={memberListId}>
          <SelectTrigger className="w-full">
            <SelectValue />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="opensAt">Opens at</Label>
          <Input
            id="opensAt"
            onChange={(e) => setOpensAt(e.target.value)}
            required
            type="datetime-local"
            value={opensAt}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="closesAt">Closes at</Label>
          <Input
            id="closesAt"
            onChange={(e) => setClosesAt(e.target.value)}
            required
            type="datetime-local"
            value={closesAt}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          checked={isActive}
          id="isActive"
          onChange={(e) => setIsActive(e.target.checked)}
          type="checkbox"
        />
        <Label htmlFor="isActive">Active (visible to voters)</Label>
      </div>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <DeleteTopicButton topicId={topic.id} />
        <Button disabled={submitting} type="submit">
          {submitting ? "Saving\u2026" : "Update topic"}
        </Button>
      </div>
    </form>
  )
}
