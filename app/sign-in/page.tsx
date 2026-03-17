"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  )

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
    <div className="flex flex-1 items-center justify-center">
      <Card className="max-w-md w-full">
        <CardContent className="space-y-6">
          {status === "sent" ? (
            <div className="text-center space-y-6">
              <h1 className="text-2xl font-bold text-accent">
                Check your email
              </h1>
              <p className="text-muted-foreground">
                We sent a login link to <strong>{email}</strong>. Click the link
                in the email to sign in.
              </p>
              <Button
                className="hover:bg-primary hover:text-primary-foreground"
                onClick={handleResend}
                variant="outline"
              >
                Resend sign in link
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-accent text-balance">
                  Sign in to vote
                </h1>
                <label className="text-muted-foreground" htmlFor="email">
                  Enter your email to receive a secure login link
                </label>
              </div>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Input
                    aria-invalid={status === "error" ? true : undefined}
                    autoComplete="email"
                    autoFocus={true}
                    id="email"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    spellCheck={false}
                    type="email"
                    value={email}
                  />
                  {status === "error" && (
                    <p className="text-sm text-destructive" role="alert">
                      Unable to send login link. Check your email address and
                      try again.
                    </p>
                  )}
                </div>
                <Button
                  className="w-full"
                  disabled={status === "sending"}
                  type="submit"
                >
                  {status === "sending" ? "Sending\u2026" : "Send login link"}
                </Button>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
