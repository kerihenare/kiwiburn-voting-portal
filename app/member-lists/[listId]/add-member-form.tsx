"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addMember } from "@/lib/actions/members"

export function AddMemberForm({ listId }: { listId: string }) {
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
    <form className="flex gap-2 items-start flex-1" onSubmit={handleSubmit}>
      <div className="flex-1">
        <Input
          aria-invalid={error ? true : undefined}
          aria-label="Email address"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          required
          type="email"
          value={email}
        />
        {error && (
          <p className="text-sm text-destructive mt-1" role="alert">
            {error}
          </p>
        )}
      </div>
      <Button disabled={submitting} type="submit">
        {submitting ? "Adding\u2026" : "Add member"}
      </Button>
    </form>
  )
}
