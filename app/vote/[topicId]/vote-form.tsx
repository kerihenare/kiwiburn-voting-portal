'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, ThumbsUp, ThumbsDown, MinusCircle, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import type { Vote } from '@/lib/types'

interface VoteFormProps {
  topicId: string
  memberId: string
  currentVote: Vote | null
}

export function VoteForm({ topicId, memberId, currentVote }: VoteFormProps) {
  const [selectedVote, setSelectedVote] = useState<string>(currentVote?.vote_value || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedVote) {
      setError('Please select an option')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      if (currentVote) {
        // Update existing vote
        const { error: updateError } = await supabase
          .from('votes')
          .update({ vote_value: selectedVote })
          .eq('id', currentVote.id)

        if (updateError) throw updateError
        toast.success('Your vote has been updated')
      } else {
        // Insert new vote
        const { error: insertError } = await supabase
          .from('votes')
          .insert({
            topic_id: topicId,
            member_id: memberId,
            vote_value: selectedVote,
          })

        if (insertError) throw insertError
        toast.success('Your vote has been recorded')
      }

      router.refresh()
    } catch (err) {
      console.error('Vote error:', err)
      setError('Failed to submit vote. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const voteOptions = [
    { value: 'yes', label: 'Yes', icon: ThumbsUp, description: 'I support this proposal' },
    { value: 'no', label: 'No', icon: ThumbsDown, description: 'I do not support this proposal' },
    { value: 'abstain', label: 'Abstain', icon: MinusCircle, description: 'I choose not to vote on this matter' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {currentVote && (
        <Alert className="border-primary/50 bg-primary/5">
          <CheckCircle className="h-4 w-4 text-primary" />
          <AlertDescription>
            You previously voted <strong className="capitalize">{currentVote.vote_value}</strong>. 
            You can change your vote below.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <RadioGroup
        value={selectedVote}
        onValueChange={setSelectedVote}
        className="grid gap-4"
      >
        {voteOptions.map((option) => {
          const Icon = option.icon
          const isSelected = selectedVote === option.value
          
          return (
            <div key={option.value}>
              <RadioGroupItem
                value={option.value}
                id={option.value}
                className="peer sr-only"
              />
              <Label
                htmlFor={option.value}
                className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${isSelected 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
              >
                <div className={`p-2 rounded-full ${isSelected ? 'bg-primary/10' : 'bg-muted'}`}>
                  <Icon className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-muted-foreground">{option.description}</div>
                </div>
                {isSelected && (
                  <CheckCircle className="h-5 w-5 text-primary" />
                )}
              </Label>
            </div>
          )
        })}
      </RadioGroup>

      <Button 
        type="submit" 
        className="w-full" 
        size="lg"
        disabled={isSubmitting || !selectedVote}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : currentVote ? (
          'Update my vote'
        ) : (
          'Submit my vote'
        )}
      </Button>
    </form>
  )
}
