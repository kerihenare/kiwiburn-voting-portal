import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Header } from "@/components/header"
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-NZ">
      <body className={`${inter.className} antialiased bg-background`}>
        <a
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-primary focus:text-primary-foreground"
          href="#main-content"
        >
          Skip to content
        </a>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main
            className="container mx-auto px-4 py-8 max-w-4xl flex-1 flex flex-col"
            id="main-content"
          >
            {children}
          </main>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
