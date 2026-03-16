import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full text-center">
        <CardContent className="pt-8 pb-8 space-y-4">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive" aria-hidden="true" />
          <h1 className="text-6xl font-bold text-foreground">404</h1>
          <p className="text-muted-foreground text-lg">Page not found</p>
          <Button asChild>
            <Link href="/">Go home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
