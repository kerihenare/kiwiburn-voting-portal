# Component Cleanup: Glidepath Conversion & Props Conventions

## Goal

Refactor all React components (excluding `components/ui/` and `emails/`) to follow three conventions:

1. **Named props interface** — every component with props gets a `ComponentNameProps` interface
2. **No inline destructuring** — use `props.x` access instead of `{ x }` in function args
3. **Glidepath styled elements** — extract inline `className` strings into `glide()` declarations placed below the component export

## Scope

### In scope (29 files)

**Feature components (6):**
1. `components/header.tsx`
2. `components/timer-badge.tsx`
3. `components/sign-out-button.tsx`
4. `components/topic-card.tsx`
5. `components/vote-buttons.tsx`
6. `components/result-bars.tsx`

**Pages (10):**
7. `app/layout.tsx`
8. `app/page.tsx`
9. `app/error.tsx`
10. `app/not-found.tsx`
11. `app/sign-in/page.tsx`
12. `app/votes/[voteId]/page.tsx`
13. `app/votes/[voteId]/success/page.tsx`
14. `app/topics/page.tsx`
15. `app/topics/[topicId]/page.tsx`
16. `app/member-lists/page.tsx`

**Forms & admin components (13):**
17. `app/topics/topics-table.tsx`
18. `app/topics/create/create-topic-form.tsx`
19. `app/topics/[topicId]/edit-topic-form.tsx`
20. `app/topics/[topicId]/delete-topic-button.tsx`
21. `app/member-lists/member-lists-table.tsx`
22. `app/member-lists/create/page.tsx`
23. `app/member-lists/[listId]/edit-list-form.tsx`
24. `app/member-lists/[listId]/add-member-form.tsx`
25. `app/member-lists/[listId]/members-table.tsx`
26. `app/member-lists/[listId]/delete-list-button.tsx`
27. `app/member-lists/[listId]/remove-member-button.tsx`
28. `app/member-lists/[listId]/upload-members-form.tsx`
29. `app/member-lists/[listId]/topics-table.tsx`

### Out of scope

- `components/ui/*` — shadcn/ui convention, leave as-is
- `emails/*` — inline CSS objects, not Tailwind classes
- `app/votes/page.tsx` — redirect only, no JSX

## Conventions

### Props interface

Every component that receives props gets a named interface:

```tsx
interface ComponentNameProps {
  name: string
}

export function ComponentName(props: ComponentNameProps) {
```

Components with no props (zero-arg pages, server components that only use hooks/fetches) are left as-is.

Next.js async pages with `params`:

```tsx
interface VotePageProps {
  params: Promise<{ voteId: string }>
}

export default async function VotePage(props: VotePageProps) {
  const { voteId } = await props.params
```

### No inline destructuring

Change `function Foo({ a, b }: FooProps)` to `function Foo(props: FooProps)`, then access as `props.a`, `props.b` throughout the body.

### Glidepath elements

Import `glide` from `@/lib/glidepath`. Extract inline `className` strings on **native HTML elements** (`div`, `span`, `h1`, `p`, `a`, `section`, `header`, `nav`, `form`, etc.) into `const Name = glide('element', { ... })` declarations placed **after** the component export.

Glidepath elements work in both server and client components. No special handling needed for `"use client"` files.

```tsx
import { glide } from "@/lib/glidepath"

export function Component(props: ComponentProps) {
  return (
    <Wrapper>
      <Title>{props.title}</Title>
    </Wrapper>
  )
}

const Wrapper = glide("div", {
  padding: "p-6",
  backgroundColor: "bg-white",
})

const Title = glide("h2", {
  fontSize: "text-lg",
  fontWeight: "font-semibold",
})
```

### What NOT to wrap with Glidepath

- **shadcn/ui components** (`Card`, `Button`, `Badge`, `Input`, etc.) — leave `className` props on these inline. Do not wrap them with `glide()`.
- **Next.js `Link`** — leave `className` props inline. Do not wrap with `glide()`.
- **Other third-party components** — same rule, keep `className` inline.

Only native HTML elements get extracted to Glidepath.

### Conditional styles

Static styles go in the Glidepath definition. Conditional styles stay as `className` overrides on the Glidepath element instance:

```tsx
<StatusBadge className={props.isActive ? "bg-green-500" : "bg-gray-300"} />
```

### Dynamic runtime className values

When `className` includes non-Tailwind runtime values (e.g., `inter.className` from Next.js font loading), keep the dynamic part as a `className` override and extract only the static Tailwind utilities to the Glidepath definition:

```tsx
// inter.className is a runtime value — stays as className override
<Body className={inter.className}>
  {props.children}
</Body>

const Body = glide("body", {
  other: "antialiased",
  backgroundColor: "bg-background",
})
```

### Naming conventions

- Semantic PascalCase names: `Title`, `Wrapper`, `ActionBar`, `VoteCount`
- Prefix with component context when needed to disambiguate: `VoteCount` not `Count`
- No generic names: avoid `Div1`, `StyledDiv`
- Names only need to be unique within their file (they are module-scoped `const` declarations)

### Table column renderers

Column `cell` renderers with className strings get Glidepath elements where practical. 1-2 utility classes may stay inline; 3+ should be extracted.

### Props edge cases

- **`Readonly<>` wrappers**: Drop them. Use plain interfaces for consistency (e.g., `interface RootLayoutProps { children: React.ReactNode }`).
- **Next.js error boundary**: The `error` prop must remain in the interface even if unused (Next.js requires the `{ error, reset }` shape):

```tsx
interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage(props: ErrorPageProps) {
  // props.error may be unused, but must be in the interface
```

## Execution order

1. Feature components first (shared, may inform patterns)
2. Pages second
3. Forms & admin components last

File-by-file, applying all three conventions to each file in a single pass.
