import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { glide } from "@/lib/glidepath"

export default function NotFound() {
  return (
    <CenterWrapper>
      <Card className="max-w-md w-full text-center">
        <CardContent className="pt-8 pb-8 space-y-6">
          <AlertCircle
            aria-hidden="true"
            className="mx-auto h-12 w-12 text-destructive"
          />
          <ErrorCode>404</ErrorCode>
          <ErrorMessage>Page not found</ErrorMessage>
          <Button asChild>
            <Link href="/">Go home</Link>
          </Button>
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

const ErrorCode = glide("h1", {
  color: "text-foreground",
  fontSize: "text-6xl",
  fontWeight: "font-bold",
})

const ErrorMessage = glide("p", {
  color: "text-muted-foreground",
  fontSize: "text-lg",
})
