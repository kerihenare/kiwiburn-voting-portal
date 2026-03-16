'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Loader2, Lock, Unlock } from 'lucide-react'
import { toast } from 'sonner'

interface ToggleVotingButtonProps {
  topicId: string
  currentStatus: boolean
  isClosed: boolean
}

export function ToggleVotingButton({ topicId, currentStatus, isClosed }: ToggleVotingButtonProps) {
  const [isOpen, setIsOpen] = useState(currentStatus)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleToggle = async (newStatus: boolean) => {
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from('topics')
        .update({ voting_open: newStatus })
        .eq('id', topicId)

      if (error) throw error

      setIsOpen(newStatus)
      toast.success(newStatus ? 'Voting is now open' : 'Voting has been closed')
      router.refresh()
    } catch (err) {
      console.error('Error toggling voting status:', err)
      toast.error('Failed to update voting status')
    } finally {
      setIsLoading(false)
    }
  }

  if (isClosed) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Lock className="h-5 w-5" />
          <span>Voting has closed (deadline passed)</span>
        </div>
        <p className="text-sm text-muted-foreground">
          The voting deadline has passed. Members can no longer cast or change their votes.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isOpen ? (
            <Unlock className="h-5 w-5 text-green-600" />
          ) : (
            <Lock className="h-5 w-5 text-muted-foreground" />
          )}
          <div>
            <Label htmlFor="voting-toggle" className="text-base">
              {isOpen ? 'Voting is open' : 'Voting is closed'}
            </Label>
            <p className="text-sm text-muted-foreground">
              {isOpen 
                ? 'Members can cast and change their votes' 
                : 'Members cannot vote at this time'
              }
            </p>
          </div>
        </div>
        <Switch
          id="voting-toggle"
          checked={isOpen}
          onCheckedChange={handleToggle}
          disabled={isLoading}
        />
      </div>
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Updating...
        </div>
      )}
    </div>
  )
}
