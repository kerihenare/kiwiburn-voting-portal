"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { uploadMembers } from "@/lib/actions/members"
import { useRouter } from "next/navigation"

export function UploadMembersForm({ listId }: { listId: number }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [emails, setEmails] = useState<string[]>([])
  const [invalidCount, setInvalidCount] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<{ added: number; duplicates: number; invalid: number } | null>(null)

  function parseFile(file: File) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split(/[\r\n]+/).filter(Boolean)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      const valid: string[] = []
      let invalid = 0

      for (const line of lines) {
        // Take first column (CSV support)
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
  }

  async function handleUpload() {
    setUploading(true)
    try {
      const res = await uploadMembers(listId, emails)
      setResult(res)
      setEmails([])
      setInvalidCount(0)
      if (fileRef.current) fileRef.current.value = ""
      router.refresh()
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.txt"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) parseFile(file)
          }}
          className="text-sm"
        />
      </div>

      {emails.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Found {emails.length} valid emails
            {invalidCount > 0 && ` (${invalidCount} invalid rows skipped)`}
          </p>
          <Button onClick={handleUpload} disabled={uploading} size="sm">
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      )}

      {result && (
        <Alert>
          <AlertDescription>
            {result.added} added, {result.duplicates} duplicates, {result.invalid} invalid
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
