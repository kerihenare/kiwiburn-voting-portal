"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

export function SignOutButton() {
  const router = useRouter()

  return (
    <Button
      className="text-white/80 hover:text-white hover:bg-white/10"
      onClick={async () => {
        await authClient.signOut()
        router.push("/")
        router.refresh()
      }}
      size="sm"
      variant="ghost"
    >
      Sign out
    </Button>
  )
}
