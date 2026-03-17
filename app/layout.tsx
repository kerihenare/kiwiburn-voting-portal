import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Header } from "@/components/header"
import { glide } from "@/lib/glidepath"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  description: "Vote on topics for Kiwiburn community decisions",
  title: "Kiwiburn Voting Portal",
}

export const viewport: Viewport = {
  colorScheme: "light",
  initialScale: 1,
  themeColor: "#ed7703",
  width: "device-width",
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout(props: RootLayoutProps) {
  return (
    <html lang="en-NZ">
      <Body className={inter.className}>
        <SkipLink href="#main-content">Skip to content</SkipLink>
        <PageWrapper>
          <Header />
          <Main id="main-content">{props.children}</Main>
        </PageWrapper>
        <Analytics />
      </Body>
    </html>
  )
}

const Body = glide("body", {
  backgroundColor: "bg-background",
  other: "antialiased",
})

const SkipLink = glide("a", {
  other:
    "sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-primary focus:text-primary-foreground",
})

const PageWrapper = glide("div", {
  display: "flex",
  flexDirection: "flex-col",
  minHeight: "min-h-screen",
})

const Main = glide("main", {
  display: "flex",
  flex: "flex-1",
  flexDirection: "flex-col",
  marginX: "mx-auto",
  maxWidth: "max-w-4xl",
  other: "container",
  paddingX: "px-4",
  paddingY: "py-8",
})
