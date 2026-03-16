import { ThumbsUp, ThumbsDown, MinusCircle, Users } from 'lucide-react'

interface VoteResultsProps {
  voteCounts: {
    yes_count: number
    no_count: number
    abstain_count: number
    total_votes: number
    total_members: number
  }
  showPercentages?: boolean
}

export function VoteResults({ voteCounts, showPercentages = false }: VoteResultsProps) {
  const { yes_count, no_count, abstain_count, total_votes, total_members } = voteCounts
  
  const getPercentage = (count: number) => {
    if (total_votes === 0) return 0
    return Math.round((count / total_votes) * 100)
  }

  const participation = total_members > 0 
    ? Math.round((total_votes / total_members) * 100) 
    : 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{total_votes} of {total_members} members voted ({participation}% participation)</span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Yes */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-green-600" />
              <span>Yes</span>
            </div>
            <span className="font-medium">
              {yes_count} {showPercentages && `(${getPercentage(yes_count)}%)`}
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-600 rounded-full transition-all duration-500"
              style={{ width: `${getPercentage(yes_count)}%` }}
            />
          </div>
        </div>

        {/* No */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <ThumbsDown className="h-4 w-4 text-red-600" />
              <span>No</span>
            </div>
            <span className="font-medium">
              {no_count} {showPercentages && `(${getPercentage(no_count)}%)`}
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-600 rounded-full transition-all duration-500"
              style={{ width: `${getPercentage(no_count)}%` }}
            />
          </div>
        </div>

        {/* Abstain */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <MinusCircle className="h-4 w-4 text-muted-foreground" />
              <span>Abstain</span>
            </div>
            <span className="font-medium">
              {abstain_count} {showPercentages && `(${getPercentage(abstain_count)}%)`}
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-muted-foreground rounded-full transition-all duration-500"
              style={{ width: `${getPercentage(abstain_count)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
