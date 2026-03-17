"use client"

import { useRouter } from "next/navigation"
import { useCallback, useRef, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { uploadMembers } from "@/lib/actions/members"
import { glide } from "@/lib/glidepath"

interface UploadMembersFormProps {
  listId: string
}

export function UploadMembersForm(props: UploadMembersFormProps) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [emails, setEmails] = useState<string[]>([])
  const [invalidCount, setInvalidCount] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [result, setResult] = useState<{
    added: number
    duplicates: number
    invalid: number
  } | null>(null)

  const parseFile = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split(/[\r\n]+/).filter(Boolean)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      const valid: string[] = []
      let invalid = 0

      for (const line of lines) {
        const email = line.split(",")[0].trim().toLowerCase()
        if (emailRegex.test(email)) {
          valid.push(email)
        } else {
          invalid++
        }
      }

      setEmails(valid)
      setInvalidCount(invalid)
      setResult(null)
    }
    reader.readAsText(file)
  }, [])

  async function handleUpload() {
    setUploading(true)
    try {
      const res = await uploadMembers(props.listId, emails)
      setResult(res)
      setEmails([])
      setInvalidCount(0)
      if (fileRef.current) fileRef.current.value = ""
      router.refresh()
    } finally {
      setUploading(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) parseFile(file)
  }

  return (
    <UploadWrapper>
      <input
        accept=".csv,.txt"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) parseFile(file)
        }}
        ref={fileRef}
        type="file"
      />

      <Button
        className={dragging ? "bg-primary/10 border-primary" : ""}
        onClick={() => fileRef.current?.click()}
        onDragLeave={() => setDragging(false)}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDrop={handleDrop}
        type="button"
        variant="outline"
      >
        Bulk upload
      </Button>

      {emails.length > 0 && (
        <PreviewSection>
          <PreviewText>
            {emails.length} email{emails.length !== 1 && "s"} found
            {invalidCount > 0 && ` (${invalidCount} invalid skipped)`}
          </PreviewText>
          <Button disabled={uploading} onClick={handleUpload} size="sm">
            {uploading ? "Uploading\u2026" : `Upload ${emails.length}`}
          </Button>
        </PreviewSection>
      )}

      {result && (
        <ResultSection>
          <Alert>
            <AlertDescription>
              {result.added} added, {result.duplicates} duplicate
              {result.duplicates !== 1 && "s"}, {result.invalid} invalid
            </AlertDescription>
          </Alert>
        </ResultSection>
      )}
    </UploadWrapper>
  )
}

const UploadWrapper = glide("div", {
  flexShrink: "shrink-0",
})

const PreviewSection = glide("div", {
  marginTop: "mt-3",
  other: "space-y-2",
})

const PreviewText = glide("p", {
  color: "text-muted-foreground",
  fontSize: "text-sm",
})

const ResultSection = glide("div", {
  marginTop: "mt-3",
})
