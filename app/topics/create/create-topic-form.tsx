"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
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
import { createTopic } from "@/lib/actions/topics"
import {
  CheckboxRow,
  DateGrid,
  FieldError,
  FieldGroup,
  FormActions,
  FormStack,
} from "@/lib/form-styles"

interface CreateTopicFormProps {
  memberLists: { id: string; name: string }[]
}

export function CreateTopicForm(props: CreateTopicFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [memberListId, setMemberListId] = useState<string | null>(null)
  const [opensAt, setOpensAt] = useState("")
  const [closesAt, setClosesAt] = useState("")
  const [isActive, setIsActive] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!memberListId) return
    setSubmitting(true)
    setError(null)

    try {
      await createTopic({
        closesAt,
        description,
        isActive,
        memberListId,
        opensAt,
        title,
      })
      router.push("/topics")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setSubmitting(false)
    }
  }

  return (
    <FormStack onSubmit={handleSubmit}>
      <FieldGroup>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          onChange={(e) => setTitle(e.target.value)}
          required
          value={title}
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
      <FieldGroup>
        <Label>Member list</Label>
        <Select onValueChange={setMemberListId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a member list" />
          </SelectTrigger>
          <SelectContent>
            {props.memberLists.map((list) => (
              <SelectItem key={list.id} value={list.id}>
                {list.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldGroup>
      <DateGrid>
        <FieldGroup>
          <Label htmlFor="opensAt">Opens at</Label>
          <Input
            id="opensAt"
            onChange={(e) => setOpensAt(e.target.value)}
            required
            type="datetime-local"
            value={opensAt}
          />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="closesAt">Closes at</Label>
          <Input
            id="closesAt"
            onChange={(e) => setClosesAt(e.target.value)}
            required
            type="datetime-local"
            value={closesAt}
          />
        </FieldGroup>
      </DateGrid>
      <CheckboxRow>
        <input
          checked={isActive}
          id="isActive"
          onChange={(e) => setIsActive(e.target.checked)}
          type="checkbox"
        />
        <Label htmlFor="isActive">
          Active{" "}
          <span className="text-muted-foreground text-sm">
            (visible to voters)
          </span>
        </Label>
      </CheckboxRow>
      {error && <FieldError role="alert">{error}</FieldError>}
      <FormActions>
        <Button disabled={submitting || !memberListId} type="submit">
          {submitting ? "Creating..." : "Create topic"}
        </Button>
      </FormActions>
    </FormStack>
  )
}
