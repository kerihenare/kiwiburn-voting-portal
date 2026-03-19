import { glide } from "@/lib/glidepath"

export const MutedText = glide("span", {
  color: "text-muted-foreground",
})

export const AlignRight = glide("div", {
  textAlign: "text-right",
})

export const NumericCell = glide("div", {
  other: "tabular-nums",
  textAlign: "text-right",
})
