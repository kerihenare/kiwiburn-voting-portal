# Component Cleanup Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor all React components (excluding `components/ui/` and `emails/`) to use named props interfaces, `props.x` access pattern, and Glidepath styled elements.

**Architecture:** File-by-file refactoring applying three conventions per file: (1) named props interface, (2) no inline destructuring, (3) extract native HTML element className strings to `glide()` declarations below the component. className on shadcn/ui components, Next.js `Link`, and other third-party components stays inline.

**Tech Stack:** React 19, Next.js 16, TypeScript, Tailwind CSS v4, Glidepath (`@/lib/glidepath`)

**Spec:** `docs/superpowers/specs/2026-03-17-component-cleanup-design.md`

---

### Task 1: `components/header.tsx`

**Files:**
- Modify: `components/header.tsx`

This is an async server component with no props. Changes: extract native HTML elements to Glidepath. `Link` className stays inline.

- [ ] **Step 1: Refactor header.tsx**

```tsx
import { headers } from "next/headers"
import Link from "next/link"
import { SignOutButton } from "@/components/sign-out-button"
import { auth } from "@/lib/auth"
import { glide } from "@/lib/glidepath"

export async function Header() {
  const headersList = await headers()
  let session = null
  try {
    session = await auth.api.getSession({ headers: headersList })
  } catch {
    // Stale session cookie — treat as unauthenticated
  }
  const pathname = headersList.get("x-current-path")

  return (
    <HeaderBar>
      <Nav>
        <NavLeft>
          <Link
            className="font-bold text-lg rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            href="/"
          >
            Kiwiburn
          </Link>
          {session?.user.isAdmin && (
            <>
              <Link
                className="text-sm text-white/80 hover:text-white rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                href="/member-lists"
              >
                Member Lists
              </Link>
              <Link
                className="text-sm text-white/80 hover:text-white rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                href="/topics"
              >
                Topics
              </Link>
            </>
          )}
        </NavLeft>
        <NavRight>
          {session ? (
            <>
              <UserEmail>
                {session.user.email}
              </UserEmail>
              <SignOutButton />
            </>
          ) : pathname !== "/sign-in" ? (
            <Link
              className="text-sm bg-black/25 text-white px-3 py-1.5 rounded-md hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              href="/sign-in"
            >
              Sign in
            </Link>
          ) : null}
        </NavRight>
      </Nav>
    </HeaderBar>
  )
}

const HeaderBar = glide("header", {
  backgroundColor: "bg-[#332d2d]",
  color: "text-white",
})

const Nav = glide("nav", {
  margin: "mx-auto",
  padding: "px-4",
  maxWidth: "max-w-4xl",
  other: "container",
  display: "flex",
  alignItems: "items-center",
  justifyContent: "justify-between",
  height: "h-14",
})

const NavLeft = glide("div", {
  display: "flex",
  alignItems: "items-center",
  gap: "gap-6",
})

const NavRight = glide("div", {
  display: "flex",
  alignItems: "items-center",
  gap: "gap-4",
})

const UserEmail = glide("span", {
  fontSize: "text-sm",
  color: "text-white/70",
})
```

- [ ] **Step 2: Verify**

Run: `pnpm lint:fix && pnpm typecheck && pnpm lint`
Expected: No errors (lint:fix auto-sorts imports to match Biome ordering)

- [ ] **Step 3: Commit**

```bash
git add components/header.tsx
git commit -m "refactor: convert header.tsx to Glidepath conventions"
```

---

### Task 2: `components/timer-badge.tsx`

**Files:**
- Modify: `components/timer-badge.tsx`

Only uses shadcn/ui components (`Badge`, `Tooltip*`) — no native HTML elements to extract. Only change: props convention.

- [ ] **Step 1: Refactor timer-badge.tsx**

```tsx
"use client"

import { format, formatDistanceToNow, isFuture, isPast } from "date-fns"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface TimerBadgeProps {
  opensAt: Date
  closesAt: Date
}

export function TimerBadge(props: TimerBadgeProps) {
  const now = new Date()

  if (isFuture(props.opensAt)) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className="bg-blue-100 text-blue-800" variant="secondary">
            Opens in {formatDistanceToNow(props.opensAt)}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>{format(props.opensAt, "d MMM yyyy, h:mm a")}</TooltipContent>
      </Tooltip>
    )
  }

  if (isPast(props.closesAt)) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className="bg-gray-100 text-gray-600" variant="secondary">
            Closed {formatDistanceToNow(props.closesAt, { addSuffix: true })}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          {format(props.closesAt, "d MMM yyyy, h:mm a")}
        </TooltipContent>
      </Tooltip>
    )
  }

  // Currently open
  const msRemaining = props.closesAt.getTime() - now.getTime()
  const hoursRemaining = msRemaining / (1000 * 60 * 60)

  if (hoursRemaining < 1) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="destructive">Closes in {"< 1 minute"}</Badge>
        </TooltipTrigger>
        <TooltipContent>
          {format(props.closesAt, "d MMM yyyy, h:mm a")}
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          className={
            hoursRemaining < 24
              ? "bg-orange-100 text-orange-800"
              : "bg-green-100 text-green-800"
          }
          variant="secondary"
        >
          Closes in {formatDistanceToNow(props.closesAt)}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>{format(props.closesAt, "d MMM yyyy, h:mm a")}</TooltipContent>
    </Tooltip>
  )
}
```

- [ ] **Step 2: Verify**

Run: `pnpm lint:fix && pnpm typecheck && pnpm lint`
Expected: No errors (lint:fix auto-sorts imports to match Biome ordering)

- [ ] **Step 3: Commit**

```bash
git add components/timer-badge.tsx
git commit -m "refactor: convert timer-badge.tsx to props conventions"
```

---

### Task 3: `components/sign-out-button.tsx`

**Files:**
- Modify: `components/sign-out-button.tsx`

No props, only uses shadcn/ui `Button`. No changes needed — no props to convert and no native HTML elements.

- [ ] **Step 1: Skip — no changes needed**

This component has no props and no native HTML elements with className. It is already compliant.

---

### Task 4: `components/topic-card.tsx`

**Files:**
- Modify: `components/topic-card.tsx`

Has props interface. Uses shadcn/ui components (`Card`, `CardContent`, `Badge`, `Button`, `Separator`) and `Link` — all stay inline. Has native `div`, `p`, `h2` elements to extract.

- [ ] **Step 1: Refactor topic-card.tsx**

```tsx
import Link from "next/link"
import { ResultBars } from "@/components/result-bars"
import { TimerBadge } from "@/components/timer-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getTopicStatus } from "@/lib/types"
import { glide } from "@/lib/glidepath"

interface TopicCardProps {
  topic: {
    id: string
    title: string
    description: string | null
    memberListName: string | null
    opensAt: Date
    closesAt: Date
    yesCount: number
    noCount: number
    totalVotes: number
  }
  userVote?: string | null
}

export function TopicCard(props: TopicCardProps) {
  const status = getTopicStatus(props.topic.opensAt, props.topic.closesAt)

  return (
    <Card>
      <CardContent className="space-y-3">
        <TopicHeader>
          {props.topic.memberListName && (
            <ListName>
              {props.topic.memberListName}
            </ListName>
          )}
          <TimerBadge closesAt={props.topic.closesAt} opensAt={props.topic.opensAt} />
        </TopicHeader>
        <TopicTitle>{props.topic.title}</TopicTitle>
        {props.topic.description && (
          <TopicDescription>
            {props.topic.description}
          </TopicDescription>
        )}
        {status === "closed" && (
          <>
            <Separator className="mx-0 my-6 w-full opacity-50" />
            <ResultBars
              noCount={props.topic.noCount}
              totalVotes={props.topic.totalVotes}
              yesCount={props.topic.yesCount}
            />
          </>
        )}
      </CardContent>
      {status === "open" && props.userVote !== undefined && (
        <>
          <Separator className="opacity-50" />
          <CardFooter className="flex items-center justify-between">
            <div>
              {props.userVote && (
                <Badge variant="outline">
                  You voted:{" "}
                  {props.userVote.charAt(0).toUpperCase() + props.userVote.slice(1)}
                </Badge>
              )}
            </div>
            <Button asChild size="sm">
              <Link href={`/votes/${props.topic.id}`}>
                {props.userVote ? "Change vote" : "Vote now"}
              </Link>
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  )
}

const TopicHeader = glide("div", {
  display: "flex",
  alignItems: "items-center",
  justifyContent: "justify-between",
})

const ListName = glide("p", {
  margin: "mb-0",
  fontSize: "text-sm",
  color: "text-muted-foreground",
})

const TopicTitle = glide("h2", {
  fontSize: "text-2xl",
  fontWeight: "font-bold",
  color: "text-accent",
  other: "!mb-0",
})

const TopicDescription = glide("p", {
  fontSize: "text-base",
  color: "text-muted-foreground",
  other: "line-clamp-2 !mt-0",
})
```

- [ ] **Step 2: Verify**

Run: `pnpm lint:fix && pnpm typecheck && pnpm lint`
Expected: No errors (lint:fix auto-sorts imports to match Biome ordering)

- [ ] **Step 3: Commit**

```bash
git add components/topic-card.tsx
git commit -m "refactor: convert topic-card.tsx to Glidepath conventions"
```

---

### Task 5: `components/vote-buttons.tsx`

**Files:**
- Modify: `components/vote-buttons.tsx`

Has native `div` and `p` elements. `Button` stays inline (shadcn/ui).

- [ ] **Step 1: Refactor vote-buttons.tsx**

```tsx
"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { castVote } from "@/lib/actions/votes"
import { glide } from "@/lib/glidepath"

interface VoteButtonsProps {
  topicId: string
  currentVote: string | null
}

export function VoteButtons(props: VoteButtonsProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState<string | null>(null)

  async function handleVote(vote: "yes" | "no") {
    setSubmitting(vote)
    try {
      await castVote({ topicId: props.topicId, vote })
      router.push(`/votes/${props.topicId}/success?vote=${vote}`)
    } catch (error) {
      console.error(error)
      setSubmitting(null)
    }
  }

  return (
    <VoteWrapper>
      <ButtonRow>
        <Button
          aria-label="Vote yes"
          className={`flex-1 h-12 text-lg font-bold ${
            props.currentVote === "yes"
              ? "bg-green-600 hover:bg-green-700 ring-2 ring-green-600 ring-offset-2"
              : "hover:bg-green-50 hover:text-green-700 hover:border-green-300"
          }`}
          disabled={submitting !== null}
          onClick={() => handleVote("yes")}
          variant={props.currentVote === "yes" ? "default" : "outline"}
        >
          {submitting === "yes" ? "Submitting..." : "YES"}
        </Button>
        <Button
          aria-label="Vote no"
          className={`flex-1 h-12 text-lg font-bold ${
            props.currentVote === "no"
              ? "bg-red-600 hover:bg-red-700 ring-2 ring-red-600 ring-offset-2"
              : "hover:bg-red-50 hover:text-red-700 hover:border-red-300"
          }`}
          disabled={submitting !== null}
          onClick={() => handleVote("no")}
          variant={props.currentVote === "no" ? "default" : "outline"}
        >
          {submitting === "no" ? "Submitting..." : "NO"}
        </Button>
      </ButtonRow>
      {props.currentVote && (
        <VoteStatus>
          You voted{" "}
          <strong>
            {props.currentVote.charAt(0).toUpperCase() + props.currentVote.slice(1)}
          </strong>
          . You can change your vote while voting is open.
        </VoteStatus>
      )}
    </VoteWrapper>
  )
}

const VoteWrapper = glide("div", {
  other: "space-y-6",
})

const ButtonRow = glide("div", {
  display: "flex",
  flexDirection: ["flex-col", "sm:flex-row"],
  gap: "gap-3",
})

const VoteStatus = glide("p", {
  fontSize: "text-sm",
  color: "text-muted-foreground",
  textAlign: "text-center",
})
```

- [ ] **Step 2: Verify**

Run: `pnpm lint:fix && pnpm typecheck && pnpm lint`
Expected: No errors (lint:fix auto-sorts imports to match Biome ordering)

- [ ] **Step 3: Commit**

```bash
git add components/vote-buttons.tsx
git commit -m "refactor: convert vote-buttons.tsx to Glidepath conventions"
```

---

### Task 6: `components/result-bars.tsx`

**Files:**
- Modify: `components/result-bars.tsx`

All native HTML elements. Two `div` elements use inline `style` for dynamic width — keep `style` prop, use Glidepath for the className part.

- [ ] **Step 1: Refactor result-bars.tsx**

```tsx
import { glide } from "@/lib/glidepath"

interface ResultBarsProps {
  yesCount: number
  noCount: number
  totalVotes: number
}

export function ResultBars(props: ResultBarsProps) {
  const yesPercent =
    props.totalVotes > 0 ? Math.round((props.yesCount / props.totalVotes) * 100) : 0
  const noPercent =
    props.totalVotes > 0 ? Math.round((props.noCount / props.totalVotes) * 100) : 0

  return (
    <ResultWrapper>
      <LabelRow>
        <span>Yes</span>
        <span>No</span>
      </LabelRow>
      <BarTrack>
        <YesBar style={{ width: `${yesPercent}%` }} />
        <NoBar style={{ width: `${noPercent}%` }} />
      </BarTrack>
      <PercentRow>
        <span>{yesPercent}%</span>
        <span>{props.totalVotes} votes</span>
        <span>{noPercent}%</span>
      </PercentRow>
    </ResultWrapper>
  )
}

const ResultWrapper = glide("div", {
  other: "space-y-1",
})

const LabelRow = glide("div", {
  display: "flex",
  justifyContent: "justify-between",
  fontSize: "text-sm",
  fontWeight: "font-medium",
})

const BarTrack = glide("div", {
  display: "flex",
  height: "h-3",
  gap: "gap-0.5",
  borderRadius: "rounded-full",
  overflow: "overflow-hidden",
})

const YesBar = glide("div", {
  backgroundColor: "bg-green-500",
  borderRadius: "rounded-l-full",
})

const NoBar = glide("div", {
  backgroundColor: "bg-red-500",
  borderRadius: "rounded-r-full",
})

const PercentRow = glide("div", {
  display: "flex",
  justifyContent: "justify-between",
  fontSize: "text-sm",
  color: "text-muted-foreground",
})
```

- [ ] **Step 2: Verify**

Run: `pnpm lint:fix && pnpm typecheck && pnpm lint`
Expected: No errors (lint:fix auto-sorts imports to match Biome ordering)

- [ ] **Step 3: Commit**

```bash
git add components/result-bars.tsx
git commit -m "refactor: convert result-bars.tsx to Glidepath conventions"
```

---

### Task 7: `app/layout.tsx`

**Files:**
- Modify: `app/layout.tsx`

Has `Readonly<>` wrapper — drop it. Has `inter.className` dynamic runtime value — keep as className override. Extract native HTML elements.

- [ ] **Step 1: Refactor layout.tsx**

```tsx
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
        <SkipLink href="#main-content">
          Skip to content
        </SkipLink>
        <PageWrapper>
          <Header />
          <Main id="main-content">
            {props.children}
          </Main>
        </PageWrapper>
        <Analytics />
      </Body>
    </html>
  )
}

const Body = glide("body", {
  other: "antialiased",
  backgroundColor: "bg-background",
})

const SkipLink = glide("a", {
  other: "sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-primary focus:text-primary-foreground",
})

const PageWrapper = glide("div", {
  display: "flex",
  minHeight: "min-h-screen",
  flexDirection: "flex-col",
})

const Main = glide("main", {
  margin: "mx-auto",
  padding: ["px-4", "py-8"],
  maxWidth: "max-w-4xl",
  flex: "flex-1",
  display: "flex",
  flexDirection: "flex-col",
  other: "container",
})
```

- [ ] **Step 2: Verify**

Run: `pnpm lint:fix && pnpm typecheck && pnpm lint`
Expected: No errors (lint:fix auto-sorts imports to match Biome ordering)

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "refactor: convert layout.tsx to Glidepath conventions"
```

---

### Task 8: `app/page.tsx`

**Files:**
- Modify: `app/page.tsx`

No props (async server component). Extract native HTML elements.

- [ ] **Step 1: Refactor page.tsx**

```tsx
import { headers } from "next/headers"
import { TopicCard } from "@/components/topic-card"
import { auth } from "@/lib/auth"
import { getTopicsWithCounts, getUserVoteForTopic } from "@/lib/db/queries"
import { glide } from "@/lib/glidepath"

export default async function HomePage() {
  let session = null
  try {
    session = await auth.api.getSession({ headers: await headers() })
  } catch {
    // Stale session cookie — treat as unauthenticated
  }
  const topics = await getTopicsWithCounts()

  const userVotes: Record<string, string | null> = {}
  if (session) {
    for (const topic of topics) {
      userVotes[topic.id] = await getUserVoteForTopic(topic.id, session.user.id)
    }
  }

  return (
    <PageContent>
      <section>
        <PageTitle>
          Community Votes
        </PageTitle>
        <PageSubtitle>
          View and participate in community decisions.
        </PageSubtitle>
      </section>
      <TopicList>
        {topics.length === 0 ? (
          <EmptyMessage>
            No voting topics yet.
          </EmptyMessage>
        ) : (
          topics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              userVote={userVotes[topic.id]}
            />
          ))
        )}
      </TopicList>
    </PageContent>
  )
}

const PageContent = glide("div", {
  other: "space-y-6",
})

const PageTitle = glide("h1", {
  fontSize: "text-2xl",
  fontWeight: "font-bold",
  color: "text-accent",
  other: "!mb-0",
})

const PageSubtitle = glide("p", {
  color: "text-muted-foreground",
  other: "!mt-0",
})

const TopicList = glide("div", {
  other: "space-y-6",
})

const EmptyMessage = glide("p", {
  color: "text-muted-foreground",
  textAlign: "text-center",
  padding: "py-12",
})
```

- [ ] **Step 2: Verify**

Run: `pnpm lint:fix && pnpm typecheck && pnpm lint`
Expected: No errors (lint:fix auto-sorts imports to match Biome ordering)

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "refactor: convert home page to Glidepath conventions"
```

---

### Task 9: `app/error.tsx`

**Files:**
- Modify: `app/error.tsx`

Add props interface with full `{ error, reset }` shape. Extract native HTML elements. `Card`/`CardContent`/`Button` stay inline.

- [ ] **Step 1: Refactor error.tsx**

```tsx
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
          <ErrorTitle>
            Something went wrong
          </ErrorTitle>
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
  display: "flex",
  alignItems: "items-center",
  justifyContent: "justify-center",
  minHeight: "min-h-[60vh]",
})

const ErrorTitle = glide("h1", {
  fontSize: "text-2xl",
  fontWeight: "font-bold",
  color: "text-foreground",
})

const ErrorMessage = glide("p", {
  color: "text-muted-foreground",
})
```

- [ ] **Step 2: Verify**

Run: `pnpm lint:fix && pnpm typecheck && pnpm lint`
Expected: No errors (lint:fix auto-sorts imports to match Biome ordering)

- [ ] **Step 3: Commit**

```bash
git add app/error.tsx
git commit -m "refactor: convert error.tsx to Glidepath conventions"
```

---

### Task 10: `app/not-found.tsx`

**Files:**
- Modify: `app/not-found.tsx`

No props. Extract native HTML elements. `AlertCircle` (lucide-react) className stays inline.

- [ ] **Step 1: Refactor not-found.tsx**

```tsx
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
  display: "flex",
  alignItems: "items-center",
  justifyContent: "justify-center",
  minHeight: "min-h-[60vh]",
})

const ErrorCode = glide("h1", {
  fontSize: "text-6xl",
  fontWeight: "font-bold",
  color: "text-foreground",
})

const ErrorMessage = glide("p", {
  color: "text-muted-foreground",
  fontSize: "text-lg",
})
```

- [ ] **Step 2: Verify**

Run: `pnpm lint:fix && pnpm typecheck && pnpm lint`
Expected: No errors (lint:fix auto-sorts imports to match Biome ordering)

- [ ] **Step 3: Commit**

```bash
git add app/not-found.tsx
git commit -m "refactor: convert not-found.tsx to Glidepath conventions"
```

---

### Task 11: `app/sign-in/page.tsx`

**Files:**
- Modify: `app/sign-in/page.tsx`

No props. Extract native HTML elements. All shadcn/ui components stay inline.

- [ ] **Step 1: Refactor sign-in/page.tsx**

```tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
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
              <Heading>
                Check your email
              </Heading>
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
                <Heading>
                  Sign in to vote
                </Heading>
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
  display: "flex",
  flex: "flex-1",
  alignItems: "items-center",
  justifyContent: "justify-center",
})

const SentContent = glide("div", {
  textAlign: "text-center",
  other: "space-y-6",
})

const Heading = glide("h1", {
  fontSize: "text-2xl",
  fontWeight: "font-bold",
  color: "text-accent",
})

const Description = glide("p", {
  color: "text-muted-foreground",
})

const HeaderGroup = glide("div", {
  other: "space-y-1",
})

const FormStack = glide("form", {
  other: "space-y-6",
})

const FieldGroup = glide("div", {
  other: "space-y-2",
})

const FieldError = glide("p", {
  fontSize: "text-sm",
  color: "text-destructive",
})
```

- [ ] **Step 2: Verify**

Run: `pnpm lint:fix && pnpm typecheck && pnpm lint`
Expected: No errors (lint:fix auto-sorts imports to match Biome ordering)

- [ ] **Step 3: Commit**

```bash
git add app/sign-in/page.tsx
git commit -m "refactor: convert sign-in page to Glidepath conventions"
```

---

### Task 12: `app/votes/[voteId]/page.tsx`

**Files:**
- Modify: `app/votes/[voteId]/page.tsx`

Add props interface. Extract native HTML elements.

- [ ] **Step 1: Refactor votes/[voteId]/page.tsx**

```tsx
import { headers } from "next/headers"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ResultBars } from "@/components/result-bars"
import { TimerBadge } from "@/components/timer-badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { VoteButtons } from "@/components/vote-buttons"
import { auth } from "@/lib/auth"
import { glide } from "@/lib/glidepath"
import {
  checkEligibility,
  getTopic,
  getUserVoteForTopic,
  getVoteResults,
} from "@/lib/db/queries"
import { getTopicStatus } from "@/lib/types"

interface VotePageProps {
  params: Promise<{ voteId: string }>
}

export default async function VotePage(props: VotePageProps) {
  const { voteId: topicId } = await props.params

  const topic = await getTopic(topicId)
  if (!topic || !topic.isActive) notFound()

  let session = null
  try {
    session = await auth.api.getSession({ headers: await headers() })
  } catch {
    // Stale session cookie — treat as unauthenticated
  }
  const status = getTopicStatus(topic.opensAt, topic.closesAt)
  const results = await getVoteResults(topicId)

  let userVote: string | null = null
  let eligible = false

  if (session) {
    userVote = await getUserVoteForTopic(topicId, session.user.id)
    const eligibility = await checkEligibility(topicId, session.user.id)
    eligible = eligibility.eligible
  }

  return (
    <PageCenter>
      <Card className="max-w-2xl w-full">
        <CardContent className="space-y-6">
          <TopicHeader>
            {topic.memberListName && (
              <ListName>
                {topic.memberListName}
              </ListName>
            )}
            <TimerBadge closesAt={topic.closesAt} opensAt={topic.opensAt} />
          </TopicHeader>
          <TopicTitle>
            {topic.title}
          </TopicTitle>
          {topic.description && (
            <TopicDescription>{topic.description}</TopicDescription>
          )}

          {status === "closed" ? (
            <ResultsSection>
              <ResultsHeading>Results</ResultsHeading>
              <ResultBars
                noCount={results.noCount}
                totalVotes={results.totalVotes}
                yesCount={results.yesCount}
              />
              {userVote && (
                <Badge variant="outline">
                  You voted:{" "}
                  {userVote.charAt(0).toUpperCase() + userVote.slice(1)}
                </Badge>
              )}
            </ResultsSection>
          ) : !session ? (
            <Button asChild className="w-full">
              <Link href="/sign-in">Sign in to vote</Link>
            </Button>
          ) : !eligible ? (
            <Alert variant="destructive">
              <AlertDescription>
                You are not eligible to vote on this topic.
              </AlertDescription>
            </Alert>
          ) : status === "scheduled" ? (
            <Alert>
              <AlertDescription>
                Voting has not opened yet. Check back later.
              </AlertDescription>
            </Alert>
          ) : (
            <VoteButtons currentVote={userVote} topicId={topicId} />
          )}
        </CardContent>
      </Card>
      <Button asChild className="text-muted-foreground" variant="ghost">
        <Link href="/">
          <svg
            aria-hidden="true"
            className="mr-1"
            fill="none"
            height="16"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to votes
        </Link>
      </Button>
    </PageCenter>
  )
}

const PageCenter = glide("div", {
  display: "flex",
  flex: "flex-1",
  flexDirection: "flex-col",
  alignItems: "items-center",
  justifyContent: "justify-center",
  gap: "gap-4",
})

const TopicHeader = glide("div", {
  display: "flex",
  alignItems: "items-center",
  justifyContent: "justify-between",
})

const ListName = glide("p", {
  margin: "mb-0",
  fontSize: "text-sm",
  color: "text-muted-foreground",
})

const TopicTitle = glide("h1", {
  fontSize: "text-2xl",
  fontWeight: "font-bold",
  color: "text-accent",
  other: "!mb-0",
})

const TopicDescription = glide("p", {
  color: "text-muted-foreground",
  other: "!mt-0",
})

const ResultsSection = glide("section", {
  other: "space-y-6",
})

const ResultsHeading = glide("h2", {
  fontSize: "text-lg",
  fontWeight: "font-semibold",
})
```

- [ ] **Step 2: Verify**

Run: `pnpm lint:fix && pnpm typecheck && pnpm lint`
Expected: No errors (lint:fix auto-sorts imports to match Biome ordering)

- [ ] **Step 3: Commit**

```bash
git add app/votes/[voteId]/page.tsx
git commit -m "refactor: convert vote page to Glidepath conventions"
```

---

### Task 13: `app/votes/[voteId]/success/page.tsx`

**Files:**
- Modify: `app/votes/[voteId]/success/page.tsx`

Add props interface. Extract native HTML elements.

- [ ] **Step 1: Refactor success/page.tsx**

```tsx
import { headers } from "next/headers"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { auth } from "@/lib/auth"
import { getTopic, getUserVoteForTopic } from "@/lib/db/queries"
import { glide } from "@/lib/glidepath"

interface VoteSuccessPageProps {
  params: Promise<{ voteId: string }>
}

export default async function VoteSuccessPage(props: VoteSuccessPageProps) {
  const { voteId: topicId } = await props.params

  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/sign-in")

  const topic = await getTopic(topicId)
  if (!topic) notFound()

  const userVote = await getUserVoteForTopic(topicId, session.user.id)
  if (!userVote) redirect(`/votes/${topicId}`)

  const isYes = userVote === "yes"

  return (
    <CenterWrapper>
      <Card className="max-w-md w-full text-center">
        <CardContent className="pt-8 pb-8 space-y-6">
          <Badge
            className={`text-3xl px-6 py-3 font-bold ${
              isYes
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : "bg-red-100 text-red-800 hover:bg-red-100"
            }`}
          >
            {userVote.toUpperCase()}
          </Badge>
          <SuccessTitle>Vote recorded</SuccessTitle>
          <SuccessMessage>
            Your vote of <strong>{isYes ? "Yes" : "No"}</strong> on &ldquo;
            {topic.title}&rdquo; has been securely recorded. Thank you for
            participating in this KiwiBurn community decision.
          </SuccessMessage>
          <Button asChild>
            <Link href="/">View all votes</Link>
          </Button>
        </CardContent>
      </Card>
    </CenterWrapper>
  )
}

const CenterWrapper = glide("div", {
  display: "flex",
  alignItems: "items-center",
  justifyContent: "justify-center",
  minHeight: "min-h-[60vh]",
})

const SuccessTitle = glide("h1", {
  fontSize: "text-2xl",
  fontWeight: "font-bold",
})

const SuccessMessage = glide("p", {
  color: "text-muted-foreground",
})
```

- [ ] **Step 2: Verify**

Run: `pnpm lint:fix && pnpm typecheck && pnpm lint`
Expected: No errors (lint:fix auto-sorts imports to match Biome ordering)

- [ ] **Step 3: Commit**

```bash
git add app/votes/[voteId]/success/page.tsx
git commit -m "refactor: convert vote success page to Glidepath conventions"
```

---

### Task 14: `app/topics/page.tsx`

**Files:**
- Modify: `app/topics/page.tsx`

No props. Extract native HTML elements.

- [ ] **Step 1: Refactor topics/page.tsx**

```tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getAdminTopicsWithCounts } from "@/lib/db/queries"
import { glide } from "@/lib/glidepath"
import { requireAdmin } from "@/lib/auth-guard"
import { TopicsTable } from "./topics-table"

export default async function TopicsPage() {
  await requireAdmin()
  const topics = await getAdminTopicsWithCounts()

  const serializedTopics = topics.map((t) => ({
    closesAt: t.closesAt.toISOString(),
    id: t.id,
    isActive: t.isActive,
    memberListName: t.memberListName,
    opensAt: t.opensAt.toISOString(),
    title: t.title,
  }))

  return (
    <PageContent>
      <PageHeader>
        <PageTitle>Topics</PageTitle>
        <Button asChild>
          <Link href="/topics/create">Create topic</Link>
        </Button>
      </PageHeader>
      <Card>
        <CardContent>
          <TopicsTable data={serializedTopics} />
        </CardContent>
      </Card>
    </PageContent>
  )
}

const PageContent = glide("div", {
  other: "space-y-6",
})

const PageHeader = glide("div", {
  display: "flex",
  alignItems: "items-center",
  justifyContent: "justify-between",
})

const PageTitle = glide("h1", {
  fontSize: "text-2xl",
  fontWeight: "font-bold",
  color: "text-accent",
})
```

- [ ] **Step 2: Verify**

Run: `pnpm lint:fix && pnpm typecheck && pnpm lint`
Expected: No errors (lint:fix auto-sorts imports to match Biome ordering)

- [ ] **Step 3: Commit**

```bash
git add app/topics/page.tsx
git commit -m "refactor: convert topics page to Glidepath conventions"
```

---

### Task 15: `app/topics/[topicId]/page.tsx`

**Files:**
- Modify: `app/topics/[topicId]/page.tsx`

Add props interface. Extract native HTML elements.

- [ ] **Step 1: Refactor topics/[topicId]/page.tsx**

```tsx
import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { getAllMemberLists, getTopic } from "@/lib/db/queries"
import { glide } from "@/lib/glidepath"
import { requireAdmin } from "@/lib/auth-guard"
import { EditTopicForm } from "./edit-topic-form"

interface TopicEditPageProps {
  params: Promise<{ topicId: string }>
}

export default async function TopicEditPage(props: TopicEditPageProps) {
  await requireAdmin()
  const { topicId: id } = await props.params

  const [topic, memberLists] = await Promise.all([
    getTopic(id),
    getAllMemberLists(),
  ])
  if (!topic) notFound()

  return (
    <PageContent>
      <PageTitle>Edit topic</PageTitle>

      <Card>
        <CardContent>
          <EditTopicForm
            memberLists={memberLists}
            topic={{
              ...topic,
              closesAt: topic.closesAt.toISOString(),
              isActive: topic.isActive,
              opensAt: topic.opensAt.toISOString(),
            }}
          />
        </CardContent>
      </Card>
    </PageContent>
  )
}

const PageContent = glide("div", {
  other: "space-y-6",
})

const PageTitle = glide("h1", {
  fontSize: "text-2xl",
  fontWeight: "font-bold",
  color: "text-accent",
})
```

- [ ] **Step 2: Verify**

Run: `pnpm lint:fix && pnpm typecheck && pnpm lint`
Expected: No errors (lint:fix auto-sorts imports to match Biome ordering)

- [ ] **Step 3: Commit**

```bash
git add app/topics/[topicId]/page.tsx
git commit -m "refactor: convert topic edit page to Glidepath conventions"
```

---

### Task 16: `app/member-lists/page.tsx`

**Files:**
- Modify: `app/member-lists/page.tsx`

No props. Extract native HTML elements.

- [ ] **Step 1: Refactor member-lists/page.tsx**

```tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getMemberListsWithCounts } from "@/lib/db/queries"
import { glide } from "@/lib/glidepath"
import { requireAdmin } from "@/lib/auth-guard"
import { MemberListsTable } from "./member-lists-table"

export default async function MemberListsPage() {
  await requireAdmin()
  const lists = await getMemberListsWithCounts()

  return (
    <PageContent>
      <PageHeader>
        <PageTitle>Member Lists</PageTitle>
        <Button asChild>
          <Link href="/member-lists/create">Create member list</Link>
        </Button>
      </PageHeader>
      <Card>
        <CardContent>
          <MemberListsTable data={lists} />
        </CardContent>
      </Card>
    </PageContent>
  )
}

const PageContent = glide("div", {
  other: "space-y-6",
})

const PageHeader = glide("div", {
  display: "flex",
  alignItems: "items-center",
  justifyContent: "justify-between",
})

const PageTitle = glide("h1", {
  fontSize: "text-2xl",
  fontWeight: "font-bold",
  color: "text-accent",
})
```

- [ ] **Step 2: Verify**

Run: `pnpm lint:fix && pnpm typecheck && pnpm lint`
Expected: No errors (lint:fix auto-sorts imports to match Biome ordering)

- [ ] **Step 3: Commit**

```bash
git add app/member-lists/page.tsx
git commit -m "refactor: convert member lists page to Glidepath conventions"
```

---

### Task 17: `app/topics/topics-table.tsx`

**Files:**
- Modify: `app/topics/topics-table.tsx`

Add props interface. Extract native `span`/`div` elements from column renderers (3+ classes get extracted). `Badge` stays inline.

- [ ] **Step 1: Refactor topics-table.tsx**

```tsx
"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { getTopicStatus } from "@/lib/types"
import { glide } from "@/lib/glidepath"

type Topic = {
  id: string
  title: string
  isActive: boolean
  memberListName: string | null
  opensAt: string
  closesAt: string
}

const columns: ColumnDef<Topic>[] = [
  {
    accessorKey: "title",
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.title}
        {!row.original.isActive && (
          <Badge
            className="ml-2 bg-yellow-100 text-yellow-800"
            variant="secondary"
          >
            Draft
          </Badge>
        )}
      </span>
    ),
    header: "Title",
  },
  {
    accessorKey: "memberListName",
    cell: ({ row }) => (
      <MutedText>
        {row.original.memberListName}
      </MutedText>
    ),
    header: "List",
  },
  {
    cell: ({ row }) => {
      const status = getTopicStatus(
        new Date(row.original.opensAt),
        new Date(row.original.closesAt),
      )
      return (
        <AlignRight>
          <Badge
            className={
              status === "open"
                ? "bg-green-100 text-green-800"
                : status === "scheduled"
                  ? "bg-blue-100 text-blue-800"
                  : ""
            }
            variant={status === "open" ? "default" : "secondary"}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </AlignRight>
      )
    },
    header: () => <AlignRight>Status</AlignRight>,
    id: "status",
  },
  {
    accessorKey: "opensAt",
    cell: ({ row }) => (
      <MutedText>
        {new Date(row.original.opensAt).toLocaleDateString()}
      </MutedText>
    ),
    header: "Opens",
  },
  {
    accessorKey: "closesAt",
    cell: ({ row }) => (
      <MutedText>
        {new Date(row.original.closesAt).toLocaleDateString()}
      </MutedText>
    ),
    header: "Closes",
  },
]

interface TopicsTableProps {
  data: Topic[]
}

export function TopicsTable(props: TopicsTableProps) {
  const router = useRouter()

  return (
    <DataTable
      columns={columns}
      data={props.data}
      emptyMessage="No topics yet."
      onRowClick={(row) => router.push(`/topics/${row.id}`)}
    />
  )
}

const MutedText = glide("span", {
  color: "text-muted-foreground",
})

const AlignRight = glide("div", {
  textAlign: "text-right",
})
```

- [ ] **Step 2: Verify**

Run: `pnpm lint:fix && pnpm typecheck && pnpm lint`
Expected: No errors (lint:fix auto-sorts imports to match Biome ordering)

- [ ] **Step 3: Commit**

```bash
git add app/topics/topics-table.tsx
git commit -m "refactor: convert topics-table.tsx to Glidepath conventions"
```

---

### Task 18: `app/topics/create/create-topic-form.tsx`

**Files:**
- Modify: `app/topics/create/create-topic-form.tsx`

Props convention + extract native HTML elements. shadcn/ui components stay inline.

- [ ] **Step 1: Refactor create-topic-form.tsx**

```tsx
"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createTopic } from "@/lib/actions/topics"
import { glide } from "@/lib/glidepath"

interface CreateTopicFormProps {
  memberLists: { id: string; name: string }[]
}

export function CreateTopicForm(props: CreateTopicFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [memberListId, setMemberListId] = useState<string | null>(null)
  const [opensAt, setOpensAt] = useState("")
  const [closesAt, setClosesAt] = useState("")
  const [isActive, setIsActive] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!memberListId) return
    setSubmitting(true)
    setError(null)

    try {
      await createTopic({
        closesAt,
        description,
        isActive,
        memberListId,
        opensAt,
        title,
      })
      router.push("/topics")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setSubmitting(false)
    }
  }

  return (
    <FormStack onSubmit={handleSubmit}>
      <FieldGroup>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          onChange={(e) => setTitle(e.target.value)}
          required
          value={title}
        />
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />
      </FieldGroup>
      <FieldGroup>
        <Label>Member list</Label>
        <Select onValueChange={setMemberListId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a member list" />
          </SelectTrigger>
          <SelectContent>
            {props.memberLists.map((list) => (
              <SelectItem key={list.id} value={list.id}>
                {list.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldGroup>
      <DateGrid>
        <FieldGroup>
          <Label htmlFor="opensAt">Opens at</Label>
          <Input
            id="opensAt"
            onChange={(e) => setOpensAt(e.target.value)}
            required
            type="datetime-local"
            value={opensAt}
          />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="closesAt">Closes at</Label>
          <Input
            id="closesAt"
            onChange={(e) => setClosesAt(e.target.value)}
            required
            type="datetime-local"
            value={closesAt}
          />
        </FieldGroup>
      </DateGrid>
      <CheckboxRow>
        <input
          checked={isActive}
          id="isActive"
          onChange={(e) => setIsActive(e.target.checked)}
          type="checkbox"
        />
        <Label htmlFor="isActive">Active (visible to voters)</Label>
      </CheckboxRow>
      {error && (
        <FieldError role="alert">
          {error}
        </FieldError>
      )}
      <FormActions>
        <Button disabled={submitting || !memberListId} type="submit">
          {submitting ? "Creating..." : "Create topic"}
        </Button>
      </FormActions>
    </FormStack>
  )
}

const FormStack = glide("form", {
  other: "space-y-6",
})

const FieldGroup = glide("div", {
  other: "space-y-2",
})

const DateGrid = glide("div", {
  display: "grid",
  gridTemplateColumns: ["grid-cols-1", "sm:grid-cols-2"],
  gap: "gap-4",
})

const CheckboxRow = glide("div", {
  display: "flex",
  alignItems: "items-center",
  gap: "gap-2",
})

const FieldError = glide("p", {
  fontSize: "text-sm",
  color: "text-destructive",
})

const FormActions = glide("div", {
  display: "flex",
  justifyContent: "justify-end",
})
```

- [ ] **Step 2: Verify**

Run: `pnpm lint:fix && pnpm typecheck && pnpm lint`
Expected: No errors (lint:fix auto-sorts imports to match Biome ordering)

- [ ] **Step 3: Commit**

```bash
git add app/topics/create/create-topic-form.tsx
git commit -m "refactor: convert create-topic-form.tsx to Glidepath conventions"
```

---

### Task 19: `app/topics/[topicId]/edit-topic-form.tsx`

**Files:**
- Modify: `app/topics/[topicId]/edit-topic-form.tsx`

Props convention + extract native HTML elements. Very similar to create form.

- [ ] **Step 1: Refactor edit-topic-form.tsx**

```tsx
"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { glide } from "@/lib/glidepath"
import { updateTopic } from "@/lib/actions/topics"
import { DeleteTopicButton } from "./delete-topic-button"

function toLocalDatetime(dateStr: string) {
  const date = new Date(dateStr)
  const offset = date.getTimezoneOffset()
  const local = new Date(date.getTime() - offset * 60000)
  return local.toISOString().slice(0, 16)
}

interface EditTopicFormProps {
  memberLists: { id: string; name: string }[]
  topic: {
    id: string
    title: string
    description: string | null
    isActive: boolean
    memberListId: string
    memberListName: string | null
    opensAt: string // serialized from server component
    closesAt: string
  }
}

export function EditTopicForm(props: EditTopicFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(props.topic.title)
  const [description, setDescription] = useState(props.topic.description ?? "")
  const [memberListId, setMemberListId] = useState(props.topic.memberListId)
  const [opensAt, setOpensAt] = useState(toLocalDatetime(props.topic.opensAt))
  const [closesAt, setClosesAt] = useState(toLocalDatetime(props.topic.closesAt))
  const [isActive, setIsActive] = useState(props.topic.isActive)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      await updateTopic(props.topic.id, {
        closesAt,
        description,
        isActive,
        memberListId,
        opensAt,
        title,
      })
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <FormStack onSubmit={handleSubmit}>
      <FieldGroup>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          onChange={(e) => setTitle(e.target.value)}
          required
          value={title}
        />
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />
      </FieldGroup>
      <FieldGroup>
        <Label>Member list</Label>
        <Select onValueChange={setMemberListId} value={memberListId}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {props.memberLists.map((list) => (
              <SelectItem key={list.id} value={list.id}>
                {list.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldGroup>
      <DateGrid>
        <FieldGroup>
          <Label htmlFor="opensAt">Opens at</Label>
          <Input
            id="opensAt"
            onChange={(e) => setOpensAt(e.target.value)}
            required
            type="datetime-local"
            value={opensAt}
          />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="closesAt">Closes at</Label>
          <Input
            id="closesAt"
            onChange={(e) => setClosesAt(e.target.value)}
            required
            type="datetime-local"
            value={closesAt}
          />
        </FieldGroup>
      </DateGrid>
      <CheckboxRow>
        <input
          checked={isActive}
          id="isActive"
          onChange={(e) => setIsActive(e.target.checked)}
          type="checkbox"
        />
        <Label htmlFor="isActive">Active (visible to voters)</Label>
      </CheckboxRow>
      {error && (
        <FieldError role="alert">
          {error}
        </FieldError>
      )}
      <FormActions>
        <DeleteTopicButton topicId={props.topic.id} />
        <Button disabled={submitting} type="submit">
          {submitting ? "Saving\u2026" : "Update topic"}
        </Button>
      </FormActions>
    </FormStack>
  )
}

const FormStack = glide("form", {
  other: "space-y-6",
})

const FieldGroup = glide("div", {
  other: "space-y-2",
})

const DateGrid = glide("div", {
  display: "grid",
  gridTemplateColumns: ["grid-cols-1", "sm:grid-cols-2"],
  gap: "gap-4",
})

const CheckboxRow = glide("div", {
  display: "flex",
  alignItems: "items-center",
  gap: "gap-2",
})

const FieldError = glide("p", {
  fontSize: "text-sm",
  color: "text-destructive",
})

const FormActions = glide("div", {
  display: "flex",
  justifyContent: "justify-end",
  gap: "gap-2",
})
```

- [ ] **Step 2: Verify**

Run: `pnpm lint:fix && pnpm typecheck && pnpm lint`
Expected: No errors (lint:fix auto-sorts imports to match Biome ordering)

- [ ] **Step 3: Commit**

```bash
git add app/topics/[topicId]/edit-topic-form.tsx
git commit -m "refactor: convert edit-topic-form.tsx to Glidepath conventions"
```

---

### Task 20: `app/topics/[topicId]/delete-topic-button.tsx`

**Files:**
- Modify: `app/topics/[topicId]/delete-topic-button.tsx`

Props convention only. All elements are shadcn/ui — no native HTML elements to extract.

- [ ] **Step 1: Refactor delete-topic-button.tsx**

```tsx
"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { deleteTopic } from "@/lib/actions/topics"

interface DeleteTopicButtonProps {
  topicId: string
}

export function DeleteTopicButton(props: DeleteTopicButtonProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteTopic(props.topicId)
      router.push("/topics")
    } catch {
      setDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="text-destructive hover:bg-destructive hover:text-white"
          variant="ghost"
        >
          Delete topic
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete topic?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the topic and all associated votes.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={deleting}
            onClick={handleDelete}
          >
            {deleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

- [ ] **Step 2: Verify**

Run: `pnpm lint:fix && pnpm typecheck && pnpm lint`
Expected: No errors (lint:fix auto-sorts imports to match Biome ordering)

- [ ] **Step 3: Commit**

```bash
git add app/topics/[topicId]/delete-topic-button.tsx
git commit -m "refactor: convert delete-topic-button.tsx to props conventions"
```

---

### Task 21: `app/member-lists/member-lists-table.tsx`

**Files:**
- Modify: `app/member-lists/member-lists-table.tsx`

Props convention + extract column renderer elements.

- [ ] **Step 1: Refactor member-lists-table.tsx**

```tsx
"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { useRouter } from "next/navigation"
import { DataTable } from "@/components/ui/data-table"
import { glide } from "@/lib/glidepath"

type MemberList = {
  id: string
  name: string
  description: string | null
  memberCount: number
  topicCount: number
}

const columns: ColumnDef<MemberList>[] = [
  {
    accessorKey: "name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    header: "Name",
  },
  {
    accessorKey: "description",
    cell: ({ row }) => (
      <MutedText>
        {row.original.description || "No description"}
      </MutedText>
    ),
    header: "Description",
  },
  {
    accessorKey: "memberCount",
    cell: ({ row }) => (
      <NumericCell>{row.original.memberCount}</NumericCell>
    ),
    header: () => <AlignRight>Members</AlignRight>,
  },
  {
    accessorKey: "topicCount",
    cell: ({ row }) => (
      <NumericCell>{row.original.topicCount}</NumericCell>
    ),
    header: () => <AlignRight>Topics</AlignRight>,
  },
]

interface MemberListsTableProps {
  data: MemberList[]
}

export function MemberListsTable(props: MemberListsTableProps) {
  const router = useRouter()

  return (
    <DataTable
      columns={columns}
      data={props.data}
      emptyMessage="No member lists yet."
      onRowClick={(row) => router.push(`/member-lists/${row.id}`)}
    />
  )
}

const MutedText = glide("span", {
  color: "text-muted-foreground",
})

const AlignRight = glide("div", {
  textAlign: "text-right",
})

const NumericCell = glide("div", {
  textAlign: "text-right",
  other: "tabular-nums",
})
```

- [ ] **Step 2: Verify**

Run: `pnpm lint:fix && pnpm typecheck && pnpm lint`
Expected: No errors (lint:fix auto-sorts imports to match Biome ordering)

- [ ] **Step 3: Commit**

```bash
git add app/member-lists/member-lists-table.tsx
git commit -m "refactor: convert member-lists-table.tsx to Glidepath conventions"
```

---

### Task 22: `app/member-lists/create/page.tsx`

**Files:**
- Modify: `app/member-lists/create/page.tsx`

No props. Extract native HTML elements.

- [ ] **Step 1: Refactor member-lists/create/page.tsx**

```tsx
"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createMemberList } from "@/lib/actions/member-lists"
import { glide } from "@/lib/glidepath"

export default function CreateMemberListPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const result = await createMemberList({ description, name })
      router.push(`/member-lists/${result.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setSubmitting(false)
    }
  }

  return (
    <PageContent>
      <PageTitle>Create member list</PageTitle>
      <Card>
        <CardContent>
          <FormStack onSubmit={handleSubmit}>
            <FieldGroup>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                onChange={(e) => setName(e.target.value)}
                required
                value={name}
              />
            </FieldGroup>
            <FieldGroup>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              />
            </FieldGroup>
            {error && (
              <FieldError role="alert">
                {error}
              </FieldError>
            )}
            <FormActions>
              <Button disabled={submitting} type="submit">
                {submitting ? "Creating..." : "Create member list"}
              </Button>
            </FormActions>
          </FormStack>
        </CardContent>
      </Card>
    </PageContent>
  )
}

const PageContent = glide("div", {
  maxWidth: "max-w-screen-xl",
  margin: "mx-auto",
  width: "w-full",
  other: "space-y-6",
})

const PageTitle = glide("h1", {
  fontSize: "text-2xl",
  fontWeight: "font-bold",
  color: "text-accent",
})

const FormStack = glide("form", {
  other: "space-y-6",
})

const FieldGroup = glide("div", {
  other: "space-y-2",
})

const FieldError = glide("p", {
  fontSize: "text-sm",
  color: "text-destructive",
})

const FormActions = glide("div", {
  display: "flex",
  justifyContent: "justify-end",
})
```

- [ ] **Step 2: Verify**

Run: `pnpm lint:fix && pnpm typecheck && pnpm lint`
Expected: No errors (lint:fix auto-sorts imports to match Biome ordering)

- [ ] **Step 3: Commit**

```bash
git add app/member-lists/create/page.tsx
git commit -m "refactor: convert create member list page to Glidepath conventions"
```

---

### Task 23: `app/member-lists/[listId]/edit-list-form.tsx`

**Files:**
- Modify: `app/member-lists/[listId]/edit-list-form.tsx`

Props convention + extract native HTML elements.

- [ ] **Step 1: Refactor edit-list-form.tsx**

```tsx
"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { glide } from "@/lib/glidepath"
import { updateMemberList } from "@/lib/actions/member-lists"

interface EditListFormProps {
  list: { id: string; name: string; description: string | null }
}

export function EditListForm(props: EditListFormProps) {
  const router = useRouter()
  const [name, setName] = useState(props.list.name)
  const [description, setDescription] = useState(props.list.description ?? "")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await updateMemberList(props.list.id, { description, name })
      router.refresh()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <FormStack onSubmit={handleSubmit}>
      <FieldGroup>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          onChange={(e) => setName(e.target.value)}
          required
          value={name}
        />
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />
      </FieldGroup>
      <FormActions>
        <Button disabled={submitting} type="submit">
          {submitting ? "Saving\u2026" : "Save changes"}
        </Button>
      </FormActions>
    </FormStack>
  )
}

const FormStack = glide("form", {
  other: "space-y-6",
})

const FieldGroup = glide("div", {
  other: "space-y-2",
})

const FormActions = glide("div", {
  display: "flex",
  justifyContent: "justify-end",
})
```

- [ ] **Step 2: Verify**

Run: `pnpm lint:fix && pnpm typecheck && pnpm lint`
Expected: No errors (lint:fix auto-sorts imports to match Biome ordering)

- [ ] **Step 3: Commit**

```bash
git add app/member-lists/[listId]/edit-list-form.tsx
git commit -m "refactor: convert edit-list-form.tsx to Glidepath conventions"
```

---

### Task 24: `app/member-lists/[listId]/add-member-form.tsx`

**Files:**
- Modify: `app/member-lists/[listId]/add-member-form.tsx`

Props convention + extract native HTML elements.

- [ ] **Step 1: Refactor add-member-form.tsx**

```tsx
"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addMember } from "@/lib/actions/members"
import { glide } from "@/lib/glidepath"

interface AddMemberFormProps {
  listId: string
}

export function AddMemberForm(props: AddMemberFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await addMember(props.listId, { email })
      setEmail("")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add member")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AddMemberRow onSubmit={handleSubmit}>
      <InputWrapper>
        <Input
          aria-invalid={error ? true : undefined}
          aria-label="Email address"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          required
          type="email"
          value={email}
        />
        {error && (
          <FieldError role="alert">
            {error}
          </FieldError>
        )}
      </InputWrapper>
      <Button disabled={submitting} type="submit">
        {submitting ? "Adding\u2026" : "Add member"}
      </Button>
    </AddMemberRow>
  )
}

const AddMemberRow = glide("form", {
  display: "flex",
  gap: "gap-2",
  alignItems: "items-start",
  flex: "flex-1",
})

const InputWrapper = glide("div", {
  flex: "flex-1",
})

const FieldError = glide("p", {
  fontSize: "text-sm",
  color: "text-destructive",
  margin: "mt-1",
})
```

- [ ] **Step 2: Verify**

Run: `pnpm lint:fix && pnpm typecheck && pnpm lint`
Expected: No errors (lint:fix auto-sorts imports to match Biome ordering)

- [ ] **Step 3: Commit**

```bash
git add app/member-lists/[listId]/add-member-form.tsx
git commit -m "refactor: convert add-member-form.tsx to Glidepath conventions"
```

---

### Task 25: `app/member-lists/[listId]/members-table.tsx`

**Files:**
- Modify: `app/member-lists/[listId]/members-table.tsx`

Props convention + extract column renderer elements.

- [ ] **Step 1: Refactor members-table.tsx**

```tsx
"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { glide } from "@/lib/glidepath"
import { RemoveMemberButton } from "./remove-member-button"

type Member = {
  id: string
  email: string
  createdAt: string
}

interface MembersTableProps {
  data: Member[]
  listId: string
}

export function MembersTable(props: MembersTableProps) {
  const columns: ColumnDef<Member>[] = [
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "createdAt",
      cell: ({ row }) => (
        <MutedText>
          {new Date(row.original.createdAt).toLocaleDateString()}
        </MutedText>
      ),
      header: "Added",
    },
    {
      cell: ({ row }) => (
        <AlignRight>
          <RemoveMemberButton listId={props.listId} memberId={row.original.id} />
        </AlignRight>
      ),
      header: "",
      id: "actions",
    },
  ]

  return (
    <DataTable columns={columns} data={props.data} emptyMessage="No members yet." />
  )
}

const MutedText = glide("span", {
  color: "text-muted-foreground",
})

const AlignRight = glide("div", {
  textAlign: "text-right",
})
```

- [ ] **Step 2: Verify**

Run: `pnpm lint:fix && pnpm typecheck && pnpm lint`
Expected: No errors (lint:fix auto-sorts imports to match Biome ordering)

- [ ] **Step 3: Commit**

```bash
git add app/member-lists/[listId]/members-table.tsx
git commit -m "refactor: convert members-table.tsx to Glidepath conventions"
```

---

### Task 26: `app/member-lists/[listId]/delete-list-button.tsx`

**Files:**
- Modify: `app/member-lists/[listId]/delete-list-button.tsx`

Props convention only. All elements are shadcn/ui.

- [ ] **Step 1: Refactor delete-list-button.tsx**

```tsx
"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { deleteMemberList } from "@/lib/actions/member-lists"

interface DeleteListButtonProps {
  listId: string
}

export function DeleteListButton(props: DeleteListButtonProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteMemberList(props.listId)
      router.push("/member-lists")
    } catch {
      setDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete member list</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete member list?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the member list and all its members.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={deleting}
            onClick={handleDelete}
          >
            {deleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

- [ ] **Step 2: Verify**

Run: `pnpm lint:fix && pnpm typecheck && pnpm lint`
Expected: No errors (lint:fix auto-sorts imports to match Biome ordering)

- [ ] **Step 3: Commit**

```bash
git add app/member-lists/[listId]/delete-list-button.tsx
git commit -m "refactor: convert delete-list-button.tsx to props conventions"
```

---

### Task 27: `app/member-lists/[listId]/remove-member-button.tsx`

**Files:**
- Modify: `app/member-lists/[listId]/remove-member-button.tsx`

Props convention only. All elements are shadcn/ui.

- [ ] **Step 1: Refactor remove-member-button.tsx**

```tsx
"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { removeMember } from "@/lib/actions/members"

interface RemoveMemberButtonProps {
  memberId: string
  listId: string
}

export function RemoveMemberButton(props: RemoveMemberButtonProps) {
  const router = useRouter()
  const [removing, setRemoving] = useState(false)

  async function handleRemove() {
    setRemoving(true)
    try {
      await removeMember(props.memberId, props.listId)
      router.refresh()
    } finally {
      setRemoving(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="text-destructive hover:bg-destructive hover:text-white"
          size="sm"
          variant="ghost"
        >
          Remove
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove member?</AlertDialogTitle>
          <AlertDialogDescription>
            This member will be removed from the list and will no longer be
            eligible to vote on topics associated with this list.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={removing} onClick={handleRemove}>
            {removing ? "Removing..." : "Remove"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

- [ ] **Step 2: Verify**

Run: `pnpm lint:fix && pnpm typecheck && pnpm lint`
Expected: No errors (lint:fix auto-sorts imports to match Biome ordering)

- [ ] **Step 3: Commit**

```bash
git add app/member-lists/[listId]/remove-member-button.tsx
git commit -m "refactor: convert remove-member-button.tsx to props conventions"
```

---

### Task 28: `app/member-lists/[listId]/upload-members-form.tsx`

**Files:**
- Modify: `app/member-lists/[listId]/upload-members-form.tsx`

Props convention + extract native HTML elements.

- [ ] **Step 1: Refactor upload-members-form.tsx**

```tsx
"use client"

import { useRouter } from "next/navigation"
import { useCallback, useRef, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { glide } from "@/lib/glidepath"
import { uploadMembers } from "@/lib/actions/members"

interface UploadMembersFormProps {
  listId: string
}

export function UploadMembersForm(props: UploadMembersFormProps) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [emails, setEmails] = useState<string[]>([])
  const [invalidCount, setInvalidCount] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [result, setResult] = useState<{
    added: number
    duplicates: number
    invalid: number
  } | null>(null)

  const parseFile = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split(/[\r\n]+/).filter(Boolean)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      const valid: string[] = []
      let invalid = 0

      for (const line of lines) {
        const email = line.split(",")[0].trim().toLowerCase()
        if (emailRegex.test(email)) {
          valid.push(email)
        } else {
          invalid++
        }
      }

      setEmails(valid)
      setInvalidCount(invalid)
      setResult(null)
    }
    reader.readAsText(file)
  }, [])

  async function handleUpload() {
    setUploading(true)
    try {
      const res = await uploadMembers(props.listId, emails)
      setResult(res)
      setEmails([])
      setInvalidCount(0)
      if (fileRef.current) fileRef.current.value = ""
      router.refresh()
    } finally {
      setUploading(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) parseFile(file)
  }

  return (
    <UploadWrapper>
      <input
        accept=".csv,.txt"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) parseFile(file)
        }}
        ref={fileRef}
        type="file"
      />

      <Button
        className={dragging ? "bg-primary/10 border-primary" : ""}
        onClick={() => fileRef.current?.click()}
        onDragLeave={() => setDragging(false)}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDrop={handleDrop}
        type="button"
        variant="outline"
      >
        Bulk upload
      </Button>

      {emails.length > 0 && (
        <PreviewSection>
          <PreviewText>
            {emails.length} email{emails.length !== 1 && "s"} found
            {invalidCount > 0 && ` (${invalidCount} invalid skipped)`}
          </PreviewText>
          <Button disabled={uploading} onClick={handleUpload} size="sm">
            {uploading ? "Uploading\u2026" : `Upload ${emails.length}`}
          </Button>
        </PreviewSection>
      )}

      {result && (
        <ResultSection>
          <Alert>
            <AlertDescription>
              {result.added} added, {result.duplicates} duplicate
              {result.duplicates !== 1 && "s"}, {result.invalid} invalid
            </AlertDescription>
          </Alert>
        </ResultSection>
      )}
    </UploadWrapper>
  )
}

const UploadWrapper = glide("div", {
  flexShrink: "shrink-0",
})

const PreviewSection = glide("div", {
  margin: "mt-3",
  other: "space-y-2",
})

const PreviewText = glide("p", {
  fontSize: "text-sm",
  color: "text-muted-foreground",
})

const ResultSection = glide("div", {
  margin: "mt-3",
})
```

- [ ] **Step 2: Verify**

Run: `pnpm lint:fix && pnpm typecheck && pnpm lint`
Expected: No errors (lint:fix auto-sorts imports to match Biome ordering)

- [ ] **Step 3: Commit**

```bash
git add app/member-lists/[listId]/upload-members-form.tsx
git commit -m "refactor: convert upload-members-form.tsx to Glidepath conventions"
```

---

### Task 29: `app/member-lists/[listId]/topics-table.tsx`

**Files:**
- Modify: `app/member-lists/[listId]/topics-table.tsx`

Props convention + extract column renderer elements. `Link` and `Badge` stay inline.

- [ ] **Step 1: Refactor topics-table.tsx**

```tsx
"use client"

import type { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { getTopicStatus } from "@/lib/types"
import { glide } from "@/lib/glidepath"

type Topic = {
  id: string
  title: string
  opensAt: string
  closesAt: string
}

const columns: ColumnDef<Topic>[] = [
  {
    accessorKey: "title",
    cell: ({ row }) => (
      <Link
        className="text-primary hover:underline"
        href={`/topics/${row.original.id}`}
      >
        {row.original.title}
      </Link>
    ),
    header: "Title",
  },
  {
    cell: ({ row }) => {
      const status = getTopicStatus(
        new Date(row.original.opensAt),
        new Date(row.original.closesAt),
      )
      return (
        <AlignRight>
          <Badge
            className={
              status === "open"
                ? "bg-green-100 text-green-800"
                : status === "scheduled"
                  ? "bg-blue-100 text-blue-800"
                  : ""
            }
            variant={status === "open" ? "default" : "secondary"}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </AlignRight>
      )
    },
    header: () => <AlignRight>Status</AlignRight>,
    id: "status",
  },
]

interface ListTopicsTableProps {
  data: Topic[]
}

export function ListTopicsTable(props: ListTopicsTableProps) {
  return <DataTable columns={columns} data={props.data} />
}

const AlignRight = glide("div", {
  textAlign: "text-right",
})
```

- [ ] **Step 2: Verify**

Run: `pnpm lint:fix && pnpm typecheck && pnpm lint`
Expected: No errors (lint:fix auto-sorts imports to match Biome ordering)

- [ ] **Step 3: Commit**

```bash
git add app/member-lists/[listId]/topics-table.tsx
git commit -m "refactor: convert list topics-table.tsx to Glidepath conventions"
```

---

### Task 30: `app/member-lists/[listId]/page.tsx`

**Files:**
- Modify: `app/member-lists/[listId]/page.tsx`

Add props interface. Extract native HTML elements. Most elements are shadcn/ui (`Card`, `Tabs*`).

- [ ] **Step 1: Refactor member-lists/[listId]/page.tsx**

```tsx
import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getMemberList } from "@/lib/db/queries"
import { glide } from "@/lib/glidepath"
import { requireAdmin } from "@/lib/auth-guard"
import { AddMemberForm } from "./add-member-form"
import { DeleteListButton } from "./delete-list-button"
import { EditListForm } from "./edit-list-form"
import { MembersTable } from "./members-table"
import { ListTopicsTable } from "./topics-table"
import { UploadMembersForm } from "./upload-members-form"

interface MemberListEditPageProps {
  params: Promise<{ listId: string }>
}

export default async function MemberListEditPage(props: MemberListEditPageProps) {
  await requireAdmin()
  const { listId: id } = await props.params

  const list = await getMemberList(id)
  if (!list) notFound()

  const serializedMembers = list.members.map((m) => ({
    createdAt: m.createdAt.toISOString(),
    email: m.email,
    id: m.id,
  }))

  const serializedTopics = list.topics.map((t) => ({
    closesAt: t.closesAt.toISOString(),
    id: t.id,
    opensAt: t.opensAt.toISOString(),
    title: t.title,
  }))

  return (
    <PageContent>
      <Tabs defaultValue="edit">
        <TabHeader>
          <PageTitle>{list.name}</PageTitle>
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
          </TabsList>
        </TabHeader>

        <TabsContent className="space-y-6" value="edit">
          <Card>
            <CardContent className="">
              <EditListForm list={list} />
            </CardContent>
          </Card>
          {!list.topics.length && <DeleteListButton listId={id} />}
        </TabsContent>

        <TabsContent className="space-y-6" value="members">
          <Card>
            <CardContent className="space-y-3">
              <MemberActions>
                <AddMemberForm listId={id} />
                <UploadMembersForm listId={id} />
              </MemberActions>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <MembersTable data={serializedMembers} listId={id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topics">
          <Card>
            <CardContent className=" space-y-6">
              {serializedTopics.length > 0 ? (
                <ListTopicsTable data={serializedTopics} />
              ) : (
                <EmptyMessage>
                  No topics linked to this list.
                </EmptyMessage>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContent>
  )
}

const PageContent = glide("div", {
  other: "space-y-6",
})

const TabHeader = glide("div", {
  display: "flex",
  alignItems: "items-center",
  justifyContent: "justify-between",
})

const PageTitle = glide("h1", {
  fontSize: "text-2xl",
  fontWeight: "font-bold",
  color: "text-accent",
})

const MemberActions = glide("div", {
  display: "flex",
  gap: "gap-2",
  alignItems: "items-start",
})

const EmptyMessage = glide("p", {
  textAlign: "text-center",
  color: "text-muted-foreground",
  padding: "py-8",
})
```

- [ ] **Step 2: Verify**

Run: `pnpm lint:fix && pnpm typecheck && pnpm lint`
Expected: No errors (lint:fix auto-sorts imports to match Biome ordering)

- [ ] **Step 3: Commit**

```bash
git add app/member-lists/[listId]/page.tsx
git commit -m "refactor: convert member list edit page to Glidepath conventions"
```

---

### Task 31: Final verification

- [ ] **Step 1: Run full typecheck**

Run: `pnpm typecheck`
Expected: No errors

- [ ] **Step 2: Run full lint**

Run: `pnpm lint`
Expected: No errors

- [ ] **Step 3: Run all tests**

Run: `pnpm test`
Expected: All tests pass

- [ ] **Step 4: Verify build**

Run: `pnpm build`
Expected: Successful build
