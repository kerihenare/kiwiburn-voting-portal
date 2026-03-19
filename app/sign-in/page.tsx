"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { FieldError, FieldGroup, FormStack } from "@/lib/form-styles"
import { glide } from "@/lib/glidepath"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "error" | "not-member"
  >("idle")

  async function sendLink() {
    setStatus("sending")
    const { error } = await authClient.signIn.magicLink({ email })
    if (error) {
      setStatus(error.message?.includes("member") ? "not-member" : "error")
    } else {
      setStatus("sent")
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await sendLink()
  }

  async function handleResend() {
    await sendLink()
  }

  return (
    <PageCenter>
      <Card className="max-w-md w-full">
        <CardContent className="space-y-6">
          {status === "sent" ? (
            <SentContent>
              <Heading>Check your email</Heading>
              <Description>
                We sent a login link to <strong>{email}</strong>. Click the link
                in the email to sign in.
              </Description>
              <Button
                className="hover:bg-primary hover:text-primary-foreground"
                onClick={handleResend}
                variant="outline"
              >
                Resend sign in link
              </Button>
            </SentContent>
          ) : (
            <>
              <HeaderGroup>
                <Heading>Sign in to vote</Heading>
                <label className="text-muted-foreground" htmlFor="email">
                  Enter your email to receive a secure login link
                </label>
              </HeaderGroup>
              <FormStack onSubmit={handleSubmit}>
                <FieldGroup>
                  <Input
                    aria-invalid={
                      status === "error" || status === "not-member"
                        ? true
                        : undefined
                    }
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
                  {status === "not-member" && (
                    <FieldError role="alert">
                      This email is not on any member list. Only members can
                      sign in.
                    </FieldError>
                  )}
                  {status === "error" && (
                    <FieldError role="alert">
                      Unable to send login link. Check your email address and
                      try again.
                    </FieldError>
                  )}
                </FieldGroup>
                <Button
                  className="w-full"
                  disabled={status === "sending"}
                  type="submit"
                >
                  {status === "sending" ? "Sending\u2026" : "Send login link"}
                </Button>
              </FormStack>
            </>
          )}
        </CardContent>
      </Card>
    </PageCenter>
  )
}

const PageCenter = glide("div", {
  alignItems: "items-center",
  display: "flex",
  flex: "flex-1",
  justifyContent: "justify-center",
})

const SentContent = glide("div", {
  other: "space-y-6",
  textAlign: "text-center",
})

const Heading = glide("h1", {
  color: "text-accent",
  fontSize: "text-2xl",
  fontWeight: "font-bold",
})

const Description = glide("p", {
  color: "text-muted-foreground",
})

const HeaderGroup = glide("div", {
  other: "space-y-1",
})
