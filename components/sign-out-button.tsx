"use client"

import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function SignOutButton() {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-white/80 hover:text-white hover:bg-white/10"
      onClick={async () => {
        await authClient.signOut()
        router.push("/")
        router.refresh()
      }}
    >
      Sign out
    </Button>
  )
}
