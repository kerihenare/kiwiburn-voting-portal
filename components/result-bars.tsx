interface ResultBarsProps {
  yesCount: number
  noCount: number
  totalVotes: number
}

export function ResultBars({ yesCount, noCount, totalVotes }: ResultBarsProps) {
  const yesPercent =
    totalVotes > 0 ? Math.round((yesCount / totalVotes) * 100) : 0
  const noPercent =
    totalVotes > 0 ? Math.round((noCount / totalVotes) * 100) : 0

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm font-medium">
        <span>Yes</span>
        <span>No</span>
      </div>
      <div className="flex h-3 gap-0.5 rounded-full overflow-hidden">
        <div
          className="bg-green-500 rounded-l-full"
          style={{ width: `${yesPercent}%` }}
        />
        <div
          className="bg-red-500 rounded-r-full"
          style={{ width: `${noPercent}%` }}
        />
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{yesPercent}%</span>
        <span>{totalVotes} votes</span>
        <span>{noPercent}%</span>
      </div>
    </div>
  )
}
