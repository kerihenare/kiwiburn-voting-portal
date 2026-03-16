"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("sending")

    try {
      await authClient.signIn.magicLink({ email })
      setStatus("sent")
    } catch {
      setStatus("error")
    }
  }

  async function handleResend() {
    setStatus("sending")
    try {
      await authClient.signIn.magicLink({ email })
      setStatus("sent")
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 space-y-4">
          {status === "sent" ? (
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-[#ab0232]">Check your email</h1>
              <p className="text-muted-foreground">
                We sent a login link to <strong>{email}</strong>. Click the link
                in the email to sign in.
              </p>
              <Button variant="outline" onClick={handleResend}>
                Resend login link
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-[#ab0232]">Sign in to vote</h1>
                <p className="text-muted-foreground">
                  Enter your email to receive a secure login link.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-invalid={status === "error" ? true : undefined}
                  />
                  {status === "error" && (
                    <p className="text-sm text-destructive" role="alert">
                      Something went wrong. Please try again.
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Sending..." : "Send login link"}
                </Button>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
