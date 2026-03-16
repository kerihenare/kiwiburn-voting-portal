"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
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
import { createTopic } from "@/lib/actions/topics"

export default function CreateTopicPage() {
  const router = useRouter()
  const [lists, setLists] = useState<{ id: number; name: string }[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [memberListId, setMemberListId] = useState<number | null>(null)
  const [opensAt, setOpensAt] = useState("")
  const [closesAt, setClosesAt] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/member-lists")
      .then((res) => res.json())
      .then(setLists)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!memberListId) return
    setSubmitting(true)
    setError(null)

    try {
      await createTopic({ title, description, memberListId, opensAt, closesAt })
      router.push("/topics")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#ab0232]">Create topic</h1>
      <Card>
        <CardContent className="pt-6">
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
              <Select onValueChange={(v) => setMemberListId(parseInt(v, 10))}>
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
            <Button type="submit" disabled={submitting || !memberListId}>
              {submitting ? "Creating..." : "Create topic"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
