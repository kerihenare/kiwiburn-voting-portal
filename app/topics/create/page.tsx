"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { createTopic } from "@/lib/actions/topics"

export default function CreateTopicPage() {
  const router = useRouter()
  const [lists, setLists] = useState<{ id: string; name: string }[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [memberListId, setMemberListId] = useState<string | null>(null)
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
      await createTopic({ closesAt, description, memberListId, opensAt, title })
      router.push("/topics")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-accent">Create topic</h1>
      <Card>
        <CardContent className="pt-6">
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
              <Select onValueChange={setMemberListId}>
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
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <Button disabled={submitting || !memberListId} type="submit">
              {submitting ? "Creating..." : "Create topic"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
