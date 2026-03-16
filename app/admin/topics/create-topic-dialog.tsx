'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface CreateTopicDialogProps {
  memberLists: { id: string; name: string }[]
}

export function CreateTopicDialog({ memberLists }: CreateTopicDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [memberListId, setMemberListId] = useState('')
  const [votingOpen, setVotingOpen] = useState(false)
  const [closesAt, setClosesAt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!memberListId) {
      setError('Please select a member list')
      setIsLoading(false)
      return
    }

    try {
      const { error: insertError } = await supabase
        .from('topics')
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          member_list_id: memberListId,
          voting_open: votingOpen,
          closes_at: closesAt ? new Date(closesAt).toISOString() : null,
        })

      if (insertError) throw insertError

      toast.success('Topic created successfully')
      setOpen(false)
      resetForm()
      router.refresh()
    } catch (err) {
      console.error('Error creating topic:', err)
      setError('Failed to create topic. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setMemberListId('')
    setVotingOpen(false)
    setClosesAt('')
    setError(null)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen)
      if (!isOpen) resetForm()
    }}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Topic
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Topic</DialogTitle>
            <DialogDescription>
              Create a new voting topic. You can open it for voting immediately or save it as a draft.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g., Proposal for new art grant program"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Provide details about this voting topic..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="memberList">Member List</Label>
              <Select value={memberListId} onValueChange={setMemberListId} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select who can vote" />
                </SelectTrigger>
                <SelectContent>
                  {memberLists.map((list) => (
                    <SelectItem key={list.id} value={list.id}>
                      {list.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {memberLists.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No member lists available. Create a member list first.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="closesAt">Closing Date (optional)</Label>
              <Input
                id="closesAt"
                type="datetime-local"
                value={closesAt}
                onChange={(e) => setClosesAt(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty for no deadline
              </p>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="votingOpen">Open for voting</Label>
                <p className="text-sm text-muted-foreground">
                  Enable this to allow members to vote immediately
                </p>
              </div>
              <Switch
                id="votingOpen"
                checked={votingOpen}
                onCheckedChange={setVotingOpen}
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !title.trim() || !memberListId}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Topic'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
