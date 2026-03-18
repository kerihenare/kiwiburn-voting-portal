import { headers } from "next/headers"
import { cache } from "react"
import { auth } from "@/lib/auth"

/**
 * React.cache()-wrapped session getter. Deduplicates auth.api.getSession()
 * calls within a single React server render pass (layout + page + components).
 */
export const getSession = cache(async () => {
  try {
    return await auth.api.getSession({ headers: await headers() })
  } catch {
    // Stale session cookie — treat as unauthenticated
    return null
  }
})
