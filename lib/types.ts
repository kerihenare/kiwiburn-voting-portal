export type TopicStatus = "open" | "closed" | "scheduled"

export function getTopicStatus(
  opensAt: Date | null,
  closesAt: Date | null,
): TopicStatus {
  const now = new Date()
  if (!opensAt || now < opensAt) return "scheduled"
  if (closesAt && now > closesAt) return "closed"
  return "open"
}
