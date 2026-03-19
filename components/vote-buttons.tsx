"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { castVote } from "@/lib/actions/votes"
import { glide } from "@/lib/glidepath"

interface VoteButtonsProps {
  currentVote: string | null
  topicId: string
}

export function VoteButtons(props: VoteButtonsProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState<string | null>(null)

  async function handleVote(vote: "yes" | "no") {
    setSubmitting(vote)
    try {
      await castVote({ topicId: props.topicId, vote })
      router.push(`/votes/${props.topicId}/success?vote=${vote}`)
    } catch (error) {
      console.error(error)
      setSubmitting(null)
    }
  }

  return (
    <VoteWrapper>
      <ButtonRow>
        <Button
          aria-label="Vote yes"
          className={`flex-1 h-12 text-lg font-bold ${
            props.currentVote === "yes"
              ? "bg-green-600 hover:bg-green-700 ring-2 ring-green-600 ring-offset-2 dark:ring-offset-background"
              : "hover:bg-green-50 hover:text-green-700 hover:border-green-300 dark:hover:bg-green-950 dark:hover:text-green-400 dark:hover:border-green-700"
          }`}
          disabled={submitting !== null}
          onClick={() => handleVote("yes")}
          variant={props.currentVote === "yes" ? "default" : "outline"}
        >
          {submitting === "yes" ? "Submitting..." : "YES"}
        </Button>
        <Button
          aria-label="Vote no"
          className={`flex-1 h-12 text-lg font-bold ${
            props.currentVote === "no"
              ? "bg-red-600 hover:bg-red-700 ring-2 ring-red-600 ring-offset-2 dark:ring-offset-background"
              : "hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:hover:bg-red-950 dark:hover:text-red-400 dark:hover:border-red-700"
          }`}
          disabled={submitting !== null}
          onClick={() => handleVote("no")}
          variant={props.currentVote === "no" ? "default" : "outline"}
        >
          {submitting === "no" ? "Submitting..." : "NO"}
        </Button>
      </ButtonRow>
      {props.currentVote && (
        <VoteStatus>
          You voted{" "}
          <strong>
            {props.currentVote.charAt(0).toUpperCase() +
              props.currentVote.slice(1)}
          </strong>
          . You can change your vote while voting is open.
        </VoteStatus>
      )}
    </VoteWrapper>
  )
}

const VoteWrapper = glide("div", {
  other: "space-y-6",
})

const ButtonRow = glide("div", {
  display: "flex",
  flexDirection: ["flex-col", "sm:flex-row"],
  gap: "gap-3",
})

const VoteStatus = glide("p", {
  color: "text-muted-foreground",
  fontSize: "text-sm",
  textAlign: "text-center",
})
