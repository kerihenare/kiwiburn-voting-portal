export type TopicStatus = "open" | "closed" | "scheduled"

export function getTopicStatus(opensAt: Date, closesAt: Date): TopicStatus {
  const now = new Date()
  if (now < opensAt) return "scheduled"
  if (now > closesAt) return "closed"
  return "open"
}
