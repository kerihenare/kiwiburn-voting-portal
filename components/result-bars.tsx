import { glide } from "@/lib/glidepath"

interface ResultBarsProps {
  noCount: number
  totalVotes: number
  yesCount: number
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
      <ValueRow>
        <span>{props.yesCount.toLocaleString()}</span>
        <span>{props.noCount.toLocaleString()}</span>
      </ValueRow>
    </ResultWrapper>
  )
}

const BarTrack = glide("div", {
  borderRadius: "rounded-full",
  display: "flex",
  gap: "gap-0.5",
  height: "h-3",
  overflow: "overflow-hidden",
})

const LabelRow = glide("div", {
  display: "flex",
  fontSize: "text-sm",
  fontWeight: "font-medium",
  justifyContent: "justify-between",
})

const NoBar = glide("div", {
  backgroundColor: "bg-red-500",
  borderRadius: "rounded-r-full",
})

const ResultWrapper = glide("div", {
  flexGrow: "grow",
  spaceY: "space-y-1",
})

const ValueRow = glide("div", {
  color: "text-muted-foreground",
  display: "flex",
  fontSize: "text-sm",
  justifyContent: "justify-between",
})

const YesBar = glide("div", {
  backgroundColor: "bg-green-500",
  borderRadius: "rounded-l-full",
})
