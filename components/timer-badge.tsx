import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow, isPast, isFuture } from "date-fns"

interface TimerBadgeProps {
  opensAt: Date
  closesAt: Date
}

export function TimerBadge({ opensAt, closesAt }: TimerBadgeProps) {
  const now = new Date()

  if (isFuture(opensAt)) {
    return (
      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
        Opens in {formatDistanceToNow(opensAt)}
      </Badge>
    )
  }

  if (isPast(closesAt)) {
    return (
      <Badge variant="secondary" className="bg-gray-100 text-gray-600">
        Closed {formatDistanceToNow(closesAt, { addSuffix: true })}
      </Badge>
    )
  }

  // Currently open
  const msRemaining = closesAt.getTime() - now.getTime()
  const hoursRemaining = msRemaining / (1000 * 60 * 60)

  if (hoursRemaining < 1) {
    return (
      <Badge variant="destructive">
        Closes in {"< 1 minute"}
      </Badge>
    )
  }

  return (
    <Badge
      variant="secondary"
      className={hoursRemaining < 24 ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"}
    >
      Closes in {formatDistanceToNow(closesAt)}
    </Badge>
  )
}
