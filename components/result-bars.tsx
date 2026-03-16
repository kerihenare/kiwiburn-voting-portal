import { Progress } from "@/components/ui/progress"

interface ResultBarsProps {
  yesCount: number
  noCount: number
  totalVotes: number
}

export function ResultBars({ yesCount, noCount, totalVotes }: ResultBarsProps) {
  const yesPercent = totalVotes > 0 ? Math.round((yesCount / totalVotes) * 100) : 0
  const noPercent = totalVotes > 0 ? Math.round((noCount / totalVotes) * 100) : 0

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Yes</span>
          <span className="text-muted-foreground">{yesPercent}%</span>
        </div>
        <Progress value={yesPercent} className="h-3 [&>div]:bg-green-500" />
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="font-medium">No</span>
          <span className="text-muted-foreground">{noPercent}%</span>
        </div>
        <Progress value={noPercent} className="h-3 [&>div]:bg-red-500" />
      </div>
      <p className="text-sm text-muted-foreground">{totalVotes} votes</p>
    </div>
  )
}
