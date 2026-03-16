"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { castVote } from "@/lib/actions/votes"

interface VoteButtonsProps {
  topicId: number
  currentVote: string | null
}

export function VoteButtons({ topicId, currentVote }: VoteButtonsProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState<string | null>(null)

  async function handleVote(vote: "yes" | "no") {
    setSubmitting(vote)
    try {
      await castVote({ topicId, vote })
      router.push(`/votes/${topicId}/success?vote=${vote}`)
    } catch (error) {
      console.error(error)
      setSubmitting(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => handleVote("yes")}
          disabled={submitting !== null}
          variant={currentVote === "yes" ? "default" : "outline"}
          className={`flex-1 h-12 text-lg font-bold ${
            currentVote === "yes"
              ? "bg-green-600 hover:bg-green-700 ring-2 ring-green-600 ring-offset-2"
              : "hover:bg-green-50 hover:text-green-700 hover:border-green-300"
          }`}
          aria-label="Vote yes"
        >
          {submitting === "yes" ? "Submitting..." : "YES"}
        </Button>
        <Button
          onClick={() => handleVote("no")}
          disabled={submitting !== null}
          variant={currentVote === "no" ? "default" : "outline"}
          className={`flex-1 h-12 text-lg font-bold ${
            currentVote === "no"
              ? "bg-red-600 hover:bg-red-700 ring-2 ring-red-600 ring-offset-2"
              : "hover:bg-red-50 hover:text-red-700 hover:border-red-300"
          }`}
          aria-label="Vote no"
        >
          {submitting === "no" ? "Submitting..." : "NO"}
        </Button>
      </div>
      {currentVote && (
        <p className="text-sm text-muted-foreground">
          You voted <strong>{currentVote.charAt(0).toUpperCase() + currentVote.slice(1)}</strong>.
          You can change your vote while voting is open.
        </p>
      )}
    </div>
  )
}
