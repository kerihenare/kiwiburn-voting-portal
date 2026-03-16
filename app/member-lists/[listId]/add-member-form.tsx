"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { addMember } from "@/lib/actions/members"
import { useRouter } from "next/navigation"

export function AddMemberForm({ listId }: { listId: number }) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await addMember(listId, { email })
      setEmail("")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add member")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end w-full">
      <div className="flex-1">
        <Input
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label="Email address"
          aria-invalid={error ? true : undefined}
        />
        {error && <p className="text-sm text-destructive mt-1" role="alert">{error}</p>}
      </div>
      <Button type="submit" disabled={submitting} size="sm">
        {submitting ? "Adding..." : "Add"}
      </Button>
    </form>
  )
}
