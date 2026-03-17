import { glide } from "@/lib/glidepath"

interface ResultBarsProps {
  yesCount: number
  noCount: number
  totalVotes: number
}

export function ResultBars(props: ResultBarsProps) {
  const yesPercent =
    props.totalVotes > 0
      ? Math.round((props.yesCount / props.totalVotes) * 100)
      : 0
  const noPercent =
    props.totalVotes > 0
      ? Math.round((props.noCount / props.totalVotes) * 100)
      : 0

  return (
    <ResultWrapper>
      <LabelRow>
        <span>Yes</span>
        <span>No</span>
      </LabelRow>
      <BarTrack>
        <YesBar style={{ width: `${yesPercent}%` }} />
        <NoBar style={{ width: `${noPercent}%` }} />
      </BarTrack>
      <PercentRow>
        <span>{yesPercent}%</span>
        <span>{props.totalVotes} votes</span>
        <span>{noPercent}%</span>
      </PercentRow>
    </ResultWrapper>
  )
}

const ResultWrapper = glide("div", {
  other: "space-y-1",
})

const LabelRow = glide("div", {
  display: "flex",
  fontSize: "text-sm",
  fontWeight: "font-medium",
  justifyContent: "justify-between",
})

const BarTrack = glide("div", {
  borderRadius: "rounded-full",
  display: "flex",
  gap: "gap-0.5",
  height: "h-3",
  overflow: "overflow-hidden",
})

const YesBar = glide("div", {
  backgroundColor: "bg-green-500",
  borderRadius: "rounded-l-full",
})

const NoBar = glide("div", {
  backgroundColor: "bg-red-500",
  borderRadius: "rounded-r-full",
})

const PercentRow = glide("div", {
  color: "text-muted-foreground",
  display: "flex",
  fontSize: "text-sm",
  justifyContent: "justify-between",
})
