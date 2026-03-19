"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createMemberList } from "@/lib/actions/member-lists"
import {
  FieldError,
  FieldGroup,
  FormActions,
  FormStack,
} from "@/lib/form-styles"
import { glide } from "@/lib/glidepath"

export default function CreateMemberListPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const result = await createMemberList({ description, name })
      router.push(`/member-lists/${result.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setSubmitting(false)
    }
  }

  return (
    <PageContent>
      <PageTitle>Create member list</PageTitle>
      <Card>
        <CardContent>
          <FormStack onSubmit={handleSubmit}>
            <FieldGroup>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                onChange={(e) => setName(e.target.value)}
                required
                value={name}
              />
            </FieldGroup>
            <FieldGroup>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              />
            </FieldGroup>
            {error && <FieldError role="alert">{error}</FieldError>}
            <FormActions>
              <Button disabled={submitting} type="submit">
                {submitting ? "Creating..." : "Create member list"}
              </Button>
            </FormActions>
          </FormStack>
        </CardContent>
      </Card>
    </PageContent>
  )
}

const PageContent = glide("div", {
  marginX: "mx-auto",
  maxWidth: "max-w-screen-xl",
  other: "space-y-6",
  width: "w-full",
})

const PageTitle = glide("h1", {
  color: "text-accent",
  fontSize: "text-2xl",
  fontWeight: "font-bold",
})
