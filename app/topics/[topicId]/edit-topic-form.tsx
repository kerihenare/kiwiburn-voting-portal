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
import { updateTopic } from "@/lib/actions/topics"
import {
  CheckboxRow,
  DateGrid,
  FieldError,
  FieldGroup,
  FormActions,
  FormStack,
} from "@/lib/form-styles"
import { DeleteTopicButton } from "./delete-topic-button"

function toLocalDatetime(dateStr: string) {
  const date = new Date(dateStr)
  const offset = date.getTimezoneOffset()
  const local = new Date(date.getTime() - offset * 60000)
  return local.toISOString().slice(0, 16)
}

interface EditTopicFormProps {
  memberLists: { id: string; name: string }[]
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

export function EditTopicForm(props: EditTopicFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(props.topic.title)
  const [description, setDescription] = useState(props.topic.description ?? "")
  const [memberListId, setMemberListId] = useState(props.topic.memberListId)
  const [opensAt, setOpensAt] = useState(toLocalDatetime(props.topic.opensAt))
  const [closesAt, setClosesAt] = useState(
    toLocalDatetime(props.topic.closesAt),
  )
  const [isActive, setIsActive] = useState(props.topic.isActive)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      await updateTopic(props.topic.id, {
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
        <Select onValueChange={setMemberListId} value={memberListId}>
          <SelectTrigger className="w-full">
            <SelectValue />
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
        <DeleteTopicButton topicId={props.topic.id} />
        <Button disabled={submitting} type="submit">
          {submitting ? "Saving\u2026" : "Update topic"}
        </Button>
      </FormActions>
    </FormStack>
  )
}
