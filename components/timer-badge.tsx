"use client"

import { format, formatDistanceToNow, isFuture, isPast } from "date-fns"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface TimerBadgeProps {
  opensAt: Date
  closesAt: Date
}

export function TimerBadge(props: TimerBadgeProps) {
  const now = new Date()

  if (isFuture(props.opensAt)) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className="bg-blue-100 text-blue-800" variant="secondary">
            Opens in {formatDistanceToNow(props.opensAt)}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          {format(props.opensAt, "d MMM yyyy, h:mm a")}
        </TooltipContent>
      </Tooltip>
    )
  }

  if (isPast(props.closesAt)) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className="bg-gray-100 text-gray-600" variant="secondary">
            Closed {formatDistanceToNow(props.closesAt, { addSuffix: true })}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          {format(props.closesAt, "d MMM yyyy, h:mm a")}
        </TooltipContent>
      </Tooltip>
    )
  }

  // Currently open
  const msRemaining = props.closesAt.getTime() - now.getTime()
  const hoursRemaining = msRemaining / (1000 * 60 * 60)

  if (hoursRemaining < 1) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="destructive">Closes in {"< 1 minute"}</Badge>
        </TooltipTrigger>
        <TooltipContent>
          {format(props.closesAt, "d MMM yyyy, h:mm a")}
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          className={
            hoursRemaining < 24
              ? "bg-orange-100 text-orange-800"
              : "bg-green-100 text-green-800"
          }
          variant="secondary"
        >
          Closes in {formatDistanceToNow(props.closesAt)}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        {format(props.closesAt, "d MMM yyyy, h:mm a")}
      </TooltipContent>
    </Tooltip>
  )
}
