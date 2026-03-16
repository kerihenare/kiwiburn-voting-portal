# Kiwiburn Voting Portal --- Design Specification

------------------------------------------------------------------------

# 1. Overview

The **Kiwiburn Voting Portal** allows members of the Kiwiburn
Incorporated Society to securely vote on community decisions.

The portal prioritises:

-   clarity
-   security
-   accessibility
-   minimal friction
-   mobile-first usability

Voting is restricted to members of defined **Member Lists**, ensuring
only eligible members participate in specific decisions.

Authentication uses **email magic links** rather than passwords.

The application is intentionally **simple and minimal** to reduce
complexity and make participation easy for community members.

------------------------------------------------------------------------

# 2. Design Principles

## Clarity over decoration

UI elements exist only where they improve comprehension.

## Minimal cognitive load

Pages focus on a single task whenever possible.

## Card-based interface

Content is presented in bordered cards to visually group information.

## Colour communicates meaning

Colour is reserved for:

-   vote outcomes
-   alerts
-   status indicators
-   action buttons

## Mobile-first

Layouts begin as single-column designs and progressively expand.

## Accessibility first

The interface must remain usable via keyboard, screen reader, and high
contrast environments.

------------------------------------------------------------------------

# 3. Information Architecture

Users interact with three primary domains.

  Area           Description
  -------------- ----------------------------------------
  Votes          Public list of voting topics
  Member Lists   Admin-managed lists of eligible voters
  Topics         Admin management of voting topics

------------------------------------------------------------------------

# 4. Routes

  Route                       Purpose
  --------------------------- --------------------------
  `/`                         List of votes
  `/votes`                    Redirects to `/`
  `/votes/[:voteId]`          Individual vote
  `/sign-in`                  Magic link login
  `/member-lists`             Member lists overview
  `/member-lists/add-users`   Add users to member list
  `/member-lists/create`      Create member list
  `/member-lists/[:listId]`   Edit member list
  `/topics`                   Topic management
  `/topics/create`            Create topic
  `/topics/[:topicId]`        Edit topic

------------------------------------------------------------------------

# 5. Home --- Community Votes (`/`)

## Page Header

**Community Votes**\
View and participate in community decisions.

## Topic List

Topics appear as a vertical stack of cards.

### Topic Card Structure

    ┌──────────────────────────────────────────────┐
    │ [Timer]                                      │
    │                                              │
    │ Member List (small, muted)                   │
    │ Topic Title (bold, lg)                       │
    │ Description text, clamped to 2 lines...      │
    │                                              │
    │ (if closed: Yes bar ████████── 67%)          │
    │ (if closed: No bar  ███──────── 33%)         │
    │ (if closed: "12 votes" caption)              │
    │                                              │
    │ ──────────────────────────────────────────── │
    │ "You voted: Yes" badge            [Vote now] │
    └──────────────────────────────────────────────┘

### Timer Behaviour

  State          Example
  -------------- -----------------------
  Future close   Closes in 3 days
  Short close    Closes in 5 hours
  Very soon      Closes in 12 minutes
  Immediate      Closes in \< 1 minute
  Closed         Closed 2 days ago
  Scheduled      Opens in 4 days

------------------------------------------------------------------------

# 6. Authentication

## Sign In (`/sign-in`)

Single centred card.

### Default State

Title: **Sign in to vote**

Text: Enter your email to receive a secure login link.

Form:

-   Email address input\
-   Placeholder: `you@example.com`

Primary button: **Send login link**

### Submitting State

Button label changes to:

`Sending...`

Button becomes disabled.

------------------------------------------------------------------------

# 7. Voting Page (`/votes/:voteId`)

Voting is displayed inside a card.

## Layout

1.  Timer
2.  Topic title
3.  Description
4.  Divider
5.  Voting interface

### Authenticated + Eligible

Two vote buttons:

    [ YES ]   [ NO ]

Mobile: stacked\
Desktop: side-by-side

If already voted:

-   selected button has darker background
-   outline ring for accessibility

Success message:

> You voted **Yes**. You can change your vote while voting is open.

### Not Authenticated

Info alert:

> Please sign in to cast your vote.

### Not Eligible

Alert:

> You are not eligible to vote on this topic.

------------------------------------------------------------------------

# 8. Voting Results

Displayed when voting is closed.

## Layout

1.  Timer
2.  Topic title
3.  Description
4.  Divider
5.  Results heading

### Result Bars

    Yes ████████── 67%
    No  ███──────── 33%

### Additional Info

Total votes: **24**

If user voted:

> You voted: **Yes**

------------------------------------------------------------------------

# 9. Vote Success Page

## Layout

Large badge showing:

YES (green)\
or\
NO (red)

### Heading

**Vote recorded**

### Confirmation

Your vote to **Yes** has been securely recorded.\
Thank you for participating in this KiwiBurn community decision.

Button:

**View all votes**

------------------------------------------------------------------------

# 10. Member Lists (`/member-lists`)

## Header

Left: **Member Lists**\
Right: **Create member list** button

### Table Columns

  Name   Description   Members   Topics
  ------ ------------- --------- --------

Name links to list detail page.

------------------------------------------------------------------------

# 11. Member List Edit (`/member-lists/:listId`)

## List Details

Fields:

-   Name
-   Description

## Members

### Add by Email

Inline form:

    [ email input ] [ Add ]

### CSV Upload Flow

1.  User selects `.csv` or `.txt`
2.  Emails parsed client-side
3.  Preview displayed

Example:

    Found 24 emails

4.  Upload button confirms submission
5.  Results alert shows:

-   added
-   skipped
-   duplicates

Invalid rows are skipped.

### Members Table

| Email \| Added date \| Remove \|

Remove requires confirmation.

### Topics Section

Table showing topics for this member list.

### Delete List

Destructive button.\
Disabled if topics exist.

------------------------------------------------------------------------

# 12. Topics (`/topics`)

### Table Columns

| Title \| List \| Status \| Opens \| Closes \|

### Status Badges

  Status      Colour
  ----------- --------
  Open        Green
  Closed      Grey
  Scheduled   Blue

------------------------------------------------------------------------

# 13. Topic Create/Edit

Routes:

-   `/topics/create`
-   `/topics/:topicId`

### Fields

  Field         Type
  ------------- ----------------
  Title         Text input
  Description   Textarea
  List          Dropdown
  Opens at      datetime-local
  Closes at     datetime-local

Actions:

-   **Create topic**
-   **Update topic**
-   **Delete topic** (edit only)

------------------------------------------------------------------------

# 14. Error Pages

## 404

Centered card:

-   Red icon
-   Large "404"
-   Page not found
-   Go home button

## 500

Centered card:

-   Something went wrong
-   Try again button

------------------------------------------------------------------------

# 15. Visual Design

Minimal, card-centric interface using Shadcn components.

------------------------------------------------------------------------

# 16. Colour System

  Element             Colour
  ------------------- ---------
  Primary             #ed7703
  Page background     #f3f4f6
  Card background     #ffffff
  Text                #000000
  Heading text        #ab0232
  Border              #e5e7eb
  Button background   #ed7703
  Button text         #ffffff
  Header background   #332d2d
  Header text         #ffffff

------------------------------------------------------------------------

# 17. Shadcn Theme

Preset: **aIo4APA**

  Setting        Value
  -------------- -----------------
  Base           Base UI
  Style          Vega
  Base colour    Neutral
  Theme          Orange
  Icon library   Lucide
  Font           Inter
  Radius         Large
  Menu style     Default + Solid
  Menu accent    Subtle

------------------------------------------------------------------------

# 18. Components

-   Alert
-   Badge
-   Button
-   Card
-   Input
-   Label
-   Progress
-   Select
-   Textarea

------------------------------------------------------------------------

# 19. Accessibility

### Skip Link

"Skip to content"

### Focus Rings

3px ring, 50% opacity

### ARIA Usage

  Element            Attribute
  ------------------ ---------------------
  Buttons            aria-label
  Fields             aria-invalid
  Decorative icons   aria-hidden
  Alerts             role="alert"

### Semantic HTML

Use:

-   `<form>`
-   `<table>`
-   `<header>`
-   `<section>`
-   `<nav>`

### Keyboard Navigation

Full tab navigation and arrow key dropdown support.

### Language

`<html lang="en-NZ">`

### Native Control Theming

`color-scheme: light dark`

------------------------------------------------------------------------

# 20. Key Design Decisions

-   No sidebar navigation
-   No search
-   No avatars
-   No toast notifications
-   Magic link authentication only
-   System dark mode only

------------------------------------------------------------------------

# 21. Technology Stack

  Layer        Technology
  ------------ --------------------------
  Runtime      NodeJS
  Framework    NextJS
  UI           React
  Styling      TailwindCSS
  Database     Postgres (Supabase)
  ORM          Drizzle
  Auth         Better-Auth
  Forms        Tanstack Forms
  Validation   Zod
  Email        React Email + Nodemailer
  Testing      Vitest
  Components   Shadcn
