"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateMemberList } from "@/lib/actions/member-lists"
import { glide } from "@/lib/glidepath"

interface EditListFormProps {
  list: { id: string; name: string; description: string | null }
}

export function EditListForm(props: EditListFormProps) {
  const router = useRouter()
  const [name, setName] = useState(props.list.name)
  const [description, setDescription] = useState(props.list.description ?? "")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await updateMemberList(props.list.id, { description, name })
      router.refresh()
    } finally {
      setSubmitting(false)
    }
  }

  return (
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
      <FormActions>
        <Button disabled={submitting} type="submit">
          {submitting ? "Saving\u2026" : "Save changes"}
        </Button>
      </FormActions>
    </FormStack>
  )
}

const FormStack = glide("form", {
  other: "space-y-6",
})

const FieldGroup = glide("div", {
  other: "space-y-2",
})

const FormActions = glide("div", {
  display: "flex",
  justifyContent: "justify-end",
})
