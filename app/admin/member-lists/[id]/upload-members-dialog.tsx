'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, Loader2, FileText, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

interface UploadMembersDialogProps {
  memberListId: string
}

interface ParsedMember {
  email: string
  name: string | null
}

export function UploadMembersDialog({ memberListId }: UploadMembersDialogProps) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [parsedMembers, setParsedMembers] = useState<ParsedMember[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadResult, setUploadResult] = useState<{ added: number; skipped: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const parseCSV = (content: string): ParsedMember[] => {
    const lines = content.split('\n').filter(line => line.trim())
    const members: ParsedMember[] = []
    
    // Skip header row if present
    const startIndex = lines[0]?.toLowerCase().includes('email') ? 1 : 0
    
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      // Handle both comma-separated and single column formats
      const parts = line.split(',').map(p => p.trim().replace(/^["']|["']$/g, ''))
      const email = parts[0]?.toLowerCase()
      const name = parts[1] || null
      
      // Basic email validation
      if (email && email.includes('@')) {
        members.push({ email, name })
      }
    }
    
    return members
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    setError(null)
    setUploadResult(null)
    
    if (!selectedFile) {
      setFile(null)
      setParsedMembers([])
      return
    }

    if (!selectedFile.name.endsWith('.csv')) {
      setError('Please select a CSV file')
      setFile(null)
      setParsedMembers([])
      return
    }

    setFile(selectedFile)
    
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      const members = parseCSV(content)
      
      if (members.length === 0) {
        setError('No valid email addresses found in the CSV file')
        setParsedMembers([])
      } else {
        setParsedMembers(members)
      }
    }
    reader.readAsText(selectedFile)
  }

  const handleUpload = async () => {
    if (parsedMembers.length === 0) return
    
    setIsLoading(true)
    setError(null)

    try {
      // Insert members, ignoring duplicates
      const { data, error: insertError } = await supabase
        .from('members')
        .upsert(
          parsedMembers.map(m => ({
            member_list_id: memberListId,
            email: m.email,
            name: m.name,
          })),
          { onConflict: 'member_list_id,email', ignoreDuplicates: true }
        )
        .select()

      if (insertError) throw insertError

      const addedCount = data?.length || 0
      const skippedCount = parsedMembers.length - addedCount

      setUploadResult({ added: addedCount, skipped: skippedCount })
      toast.success(`${addedCount} member${addedCount !== 1 ? 's' : ''} added successfully`)
      router.refresh()
    } catch (err) {
      console.error('Error uploading members:', err)
      setError('Failed to upload members. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setFile(null)
    setParsedMembers([])
    setError(null)
    setUploadResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => isOpen ? setOpen(true) : handleClose()}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Upload CSV
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Members from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file with email addresses. The file should have an &quot;email&quot; column, and optionally a &quot;name&quot; column.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {uploadResult && (
            <Alert className="border-green-500/50 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                {uploadResult.added} member{uploadResult.added !== 1 ? 's' : ''} added
                {uploadResult.skipped > 0 && `, ${uploadResult.skipped} duplicate${uploadResult.skipped !== 1 ? 's' : ''} skipped`}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="csv-file">CSV File</Label>
            <input
              ref={fileInputRef}
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={isLoading}
              className="block w-full text-sm text-muted-foreground
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-primary file:text-primary-foreground
                hover:file:bg-primary/90
                file:cursor-pointer cursor-pointer"
            />
          </div>

          {file && parsedMembers.length > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-muted">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {parsedMembers.length} email{parsedMembers.length !== 1 ? 's' : ''} found in {file.name}
              </span>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-1">Example CSV format:</p>
            <pre className="p-2 bg-muted rounded text-xs">
              email,name{'\n'}
              alice@example.com,Alice Smith{'\n'}
              bob@example.com,Bob Jones
            </pre>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            {uploadResult ? 'Close' : 'Cancel'}
          </Button>
          {!uploadResult && (
            <Button 
              onClick={handleUpload} 
              disabled={isLoading || parsedMembers.length === 0}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                `Upload ${parsedMembers.length} Member${parsedMembers.length !== 1 ? 's' : ''}`
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
