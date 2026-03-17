"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { glide } from "@/lib/glidepath"

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage(props: ErrorPageProps) {
  return (
    <CenterWrapper>
      <Card className="max-w-md w-full text-center">
        <CardContent className="pt-8 pb-8 space-y-6">
          <ErrorTitle>Something went wrong</ErrorTitle>
          <ErrorMessage>
            An unexpected error occurred. Please try again.
          </ErrorMessage>
          <Button onClick={props.reset}>Try again</Button>
        </CardContent>
      </Card>
    </CenterWrapper>
  )
}

const CenterWrapper = glide("div", {
  alignItems: "items-center",
  display: "flex",
  justifyContent: "justify-center",
  minHeight: "min-h-[60vh]",
})

const ErrorTitle = glide("h1", {
  color: "text-foreground",
  fontSize: "text-2xl",
  fontWeight: "font-bold",
})

const ErrorMessage = glide("p", {
  color: "text-muted-foreground",
})
