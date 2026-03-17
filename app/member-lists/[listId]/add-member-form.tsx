"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addMember } from "@/lib/actions/members"
import { glide } from "@/lib/glidepath"

interface AddMemberFormProps {
  listId: string
}

export function AddMemberForm(props: AddMemberFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await addMember(props.listId, { email })
      setEmail("")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add member")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AddMemberRow onSubmit={handleSubmit}>
      <InputWrapper>
        <Input
          aria-invalid={error ? true : undefined}
          aria-label="Email address"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          required
          type="email"
          value={email}
        />
        {error && <FieldError role="alert">{error}</FieldError>}
      </InputWrapper>
      <Button disabled={submitting} type="submit">
        {submitting ? "Adding\u2026" : "Add member"}
      </Button>
    </AddMemberRow>
  )
}

const AddMemberRow = glide("form", {
  alignItems: "items-start",
  display: "flex",
  flex: "flex-1",
  flexDirection: ["flex-col", "sm:flex-row"],
  gap: "gap-2",
})

const InputWrapper = glide("div", {
  flex: "flex-1",
})

const FieldError = glide("p", {
  color: "text-destructive",
  fontSize: "text-sm",
  marginTop: "mt-1",
})
