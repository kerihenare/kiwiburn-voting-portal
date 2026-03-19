# Nullable Topic Dates & Open/Close Buttons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `opensAt` and `closesAt` nullable on topics so admins can create topics without scheduling, then open/close them manually via buttons on the edit page.

**Architecture:** Remove `.notNull()` from both timestamp columns in the Drizzle schema, update the validation schema to accept optional dates, update `getTopicStatus()` to handle nulls (null opensAt = "scheduled", null closesAt with opensAt = "open"), and add "Open now" / "Close now" buttons to the edit form footer.

**Tech Stack:** Drizzle ORM, Zod, React 19, Next.js server actions, Vitest

---

### Task 1: Update `getTopicStatus` to handle nullable dates

**Files:**
- Modify: `lib/types.ts:1-8`
- Test: `__tests__/lib/types.test.ts`

- [ ] **Step 1: Write failing tests for nullable date scenarios**

Add these tests to `__tests__/lib/types.test.ts`:

```typescript
it('returns "scheduled" when opensAt is null', () => {
  expect(getTopicStatus(null, null)).toBe("scheduled")
})

it('returns "scheduled" when opensAt is null even if closesAt is set', () => {
  expect(getTopicStatus(null, new Date("2026-07-01T00:00:00Z"))).toBe("scheduled")
})

it('returns "open" when opensAt is in the past and closesAt is null', () => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date("2026-06-15T00:00:00Z"))
  expect(getTopicStatus(new Date("2026-06-01T00:00:00Z"), null)).toBe("open")
})

it('returns "scheduled" when opensAt is in the future and closesAt is null', () => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date("2026-01-01T00:00:00Z"))
  expect(getTopicStatus(new Date("2026-06-01T00:00:00Z"), null)).toBe("scheduled")
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run __tests__/lib/types.test.ts`
Expected: FAIL — type errors since `getTopicStatus` doesn't accept `null`

- [ ] **Step 3: Update `getTopicStatus` to accept nullable dates**

Update `lib/types.ts`. The logic:
- No `opensAt` → "scheduled" (hasn't been opened)
- `opensAt` in future → "scheduled"
- `opensAt` in past, no `closesAt` → "open" (opened but not closed)
- `opensAt` in past, `closesAt` in past → "closed"
- `opensAt` in past, `closesAt` in future → "open"

```typescript
export type TopicStatus = "open" | "closed" | "scheduled"

export function getTopicStatus(opensAt: Date | null, closesAt: Date | null): TopicStatus {
  const now = new Date()
  if (!opensAt || now < opensAt) return "scheduled"
  if (closesAt && now > closesAt) return "closed"
  return "open"
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run __tests__/lib/types.test.ts`
Expected: PASS — all existing and new tests pass

- [ ] **Step 5: Commit**

```bash
git add lib/types.ts __tests__/lib/types.test.ts
git commit -m "feat: support nullable opensAt/closesAt in getTopicStatus"
```

---

### Task 2: Update Drizzle schema to make dates nullable

**Files:**
- Modify: `lib/db/schema.ts:80,90`

- [ ] **Step 1: Remove `.notNull()` from `opensAt` and `closesAt`**

In `lib/db/schema.ts`, change:
```typescript
closesAt: timestamp("closes_at").notNull(),
```
to:
```typescript
closesAt: timestamp("closes_at"),
```

And change:
```typescript
opensAt: timestamp("opens_at").notNull(),
```
to:
```typescript
opensAt: timestamp("opens_at"),
```

- [ ] **Step 2: Run typecheck to see what breaks**

Run: `pnpm typecheck`
Expected: Type errors in files that expect non-null dates — this confirms the blast radius and guides the remaining tasks.

- [ ] **Step 3: Push schema to database**

Run: `pnpm drizzle-kit push`
Expected: Alters `topics` table to make `opens_at` and `closes_at` nullable.

- [ ] **Step 4: Commit**

```bash
git add lib/db/schema.ts
git commit -m "feat: make topic opensAt and closesAt nullable in schema"
```

---

### Task 3: Update validation schema for nullable dates

**Files:**
- Modify: `lib/validations.ts:9-23`
- Test: `__tests__/lib/validations.test.ts`

- [ ] **Step 1: Write failing tests for optional date fields**

Add these tests to the `createTopicSchema` describe block in `__tests__/lib/validations.test.ts`:

```typescript
it("accepts input without opensAt", () => {
  const { opensAt, ...withoutOpensAt } = validInput
  const result = createTopicSchema.safeParse(withoutOpensAt)
  expect(result.success).toBe(true)
})

it("accepts input without closesAt", () => {
  const { closesAt, ...withoutClosesAt } = validInput
  const result = createTopicSchema.safeParse(withoutClosesAt)
  expect(result.success).toBe(true)
})

it("accepts input without both dates", () => {
  const { opensAt, closesAt, ...withoutDates } = validInput
  const result = createTopicSchema.safeParse(withoutDates)
  expect(result.success).toBe(true)
})

it("still rejects closesAt before opensAt when both provided", () => {
  const result = createTopicSchema.safeParse({
    ...validInput,
    closesAt: "2026-06-01T00:00:00Z",
    opensAt: "2026-07-01T00:00:00Z",
  })
  expect(result.success).toBe(false)
})
```

Also replace the existing "rejects empty opensAt" and "rejects empty closesAt" tests (lines 85-101) with:

```typescript
it("accepts empty opensAt as optional", () => {
  const result = createTopicSchema.safeParse({ ...validInput, opensAt: "" })
  expect(result.success).toBe(true)
})

it("accepts empty closesAt as optional", () => {
  const result = createTopicSchema.safeParse({ ...validInput, closesAt: "" })
  expect(result.success).toBe(true)
})
```

- [ ] **Step 2: Run tests to verify new ones fail**

Run: `pnpm vitest run __tests__/lib/validations.test.ts`
Expected: FAIL — new "accepts without" tests fail because fields are currently required

- [ ] **Step 3: Update `createTopicSchema` to make dates optional**

Update `lib/validations.ts`:

```typescript
export const createTopicSchema = z
  .object({
    closesAt: z.string().optional(),
    description: z.string().max(5000, "Description is too long").optional(),
    isActive: z.boolean().optional(),
    memberListId: z
      .string({ required_error: "Member list is required" })
      .uuid(),
    opensAt: z.string().optional(),
    title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  })
  .refine(
    (data) => {
      if (data.opensAt && data.closesAt) {
        return new Date(data.closesAt) > new Date(data.opensAt)
      }
      return true
    },
    {
      message: "Closes at must be after opens at",
      path: ["closesAt"],
    },
  )
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run __tests__/lib/validations.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/validations.ts __tests__/lib/validations.test.ts
git commit -m "feat: make opensAt and closesAt optional in topic validation"
```

---

### Task 4: Update server actions for nullable dates

**Files:**
- Modify: `lib/actions/topics.ts:10-67`
- Test: `__tests__/lib/actions/topics.test.ts`

- [ ] **Step 1: Write failing tests for nullable date handling in actions**

Add to `__tests__/lib/actions/topics.test.ts`:

In the `createTopic` describe block:
```typescript
it("creates topic with null dates when not provided", async () => {
  mockGetSession.mockResolvedValue(adminSession)
  const { opensAt, closesAt, ...inputWithoutDates } = validTopicInput
  await createTopic(inputWithoutDates)

  expect(mockDb.values).toHaveBeenCalledWith(
    expect.objectContaining({ closesAt: null, opensAt: null }),
  )
})
```

In the `updateTopic` describe block:
```typescript
it("updates topic with null dates when not provided", async () => {
  mockGetSession.mockResolvedValue(adminSession)
  const { opensAt, closesAt, ...inputWithoutDates } = validTopicInput
  await updateTopic(topicId, inputWithoutDates)

  expect(mockDb.set).toHaveBeenCalledWith(
    expect.objectContaining({ closesAt: null, opensAt: null }),
  )
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run __tests__/lib/actions/topics.test.ts`
Expected: FAIL

- [ ] **Step 3: Update server actions to handle optional dates**

Update `lib/actions/topics.ts`:

For `createTopic`, update the input type and values:
```typescript
export async function createTopic(input: {
  title: string
  description?: string
  memberListId: string
  opensAt?: string
  closesAt?: string
  isActive?: boolean
}) {
  await requireActionAdmin()
  const parsed = createTopicSchema.parse(input)

  await db.insert(topics).values({
    closesAt: parsed.closesAt ? new Date(parsed.closesAt) : null,
    description: parsed.description ?? null,
    isActive: parsed.isActive ?? false,
    memberListId: parsed.memberListId,
    opensAt: parsed.opensAt ? new Date(parsed.opensAt) : null,
    title: parsed.title,
  })

  revalidatePath("/topics")
  revalidatePath("/")
  return { success: true }
}
```

For `updateTopic`, same pattern:
```typescript
export async function updateTopic(
  id: string,
  input: {
    title: string
    description?: string
    memberListId: string
    opensAt?: string
    closesAt?: string
    isActive?: boolean
  },
) {
  await requireActionAdmin()
  uuidSchema.parse(id)
  const parsed = createTopicSchema.parse(input)

  await db
    .update(topics)
    .set({
      closesAt: parsed.closesAt ? new Date(parsed.closesAt) : null,
      description: parsed.description ?? null,
      isActive: parsed.isActive ?? false,
      memberListId: parsed.memberListId,
      opensAt: parsed.opensAt ? new Date(parsed.opensAt) : null,
      title: parsed.title,
      updatedAt: new Date(),
    })
    .where(eq(topics.id, id))

  revalidatePath("/topics")
  revalidatePath(`/topics/${id}`)
  revalidatePath("/")
  return { success: true }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run __tests__/lib/actions/topics.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/actions/topics.ts __tests__/lib/actions/topics.test.ts
git commit -m "feat: handle nullable dates in topic server actions"
```

---

### Task 5: Fix type errors across consumers

**Files:**
- Modify: `app/topics/[topicId]/edit-topic-form.tsx:34-46,53-56,117-137`
- Modify: `app/topics/[topicId]/page.tsx:30-35`
- Modify: `app/topics/page.tsx:13-20`
- Modify: `app/topics/topics-table.tsx:10-17,43-47,69-83`
- Modify: `app/topics/create/create-topic-form.tsx`
- Modify: `components/topic-card/topic-card.tsx:11-13`
- Modify: `components/timer-badge.tsx:11-13`
- Modify: `app/votes/[voteId]/page.tsx:30`
- Modify: `lib/actions/votes.ts:19`
- Modify: `app/member-lists/[listId]/page.tsx` (if it displays dates)

- [ ] **Step 1: Run typecheck to get the full list of errors**

Run: `pnpm typecheck`
Expected: Type errors wherever non-null `Date` is expected for `opensAt`/`closesAt`

- [ ] **Step 2: Fix `app/topics/[topicId]/page.tsx` — serialize nullable dates**

Change lines 32-34 from:
```typescript
closesAt: topic.closesAt.toISOString(),
...
opensAt: topic.opensAt.toISOString(),
```
to:
```typescript
closesAt: topic.closesAt?.toISOString() ?? null,
...
opensAt: topic.opensAt?.toISOString() ?? null,
```

- [ ] **Step 3: Fix `app/topics/page.tsx` — serialize nullable dates**

Change lines 14,18 from:
```typescript
closesAt: t.closesAt.toISOString(),
...
opensAt: t.opensAt.toISOString(),
```
to:
```typescript
closesAt: t.closesAt?.toISOString() ?? null,
...
opensAt: t.opensAt?.toISOString() ?? null,
```

- [ ] **Step 4: Fix `app/topics/topics-table.tsx` — handle nullable dates in table**

Update the `Topic` type (lines 10-17):
```typescript
type Topic = {
  id: string
  title: string
  isActive: boolean
  memberListName: string | null
  opensAt: string | null
  closesAt: string | null
}
```

Update the status column cell (lines 43-47) to handle nulls:
```typescript
cell: ({ row }) => {
  const status = getTopicStatus(
    row.original.opensAt ? new Date(row.original.opensAt) : null,
    row.original.closesAt ? new Date(row.original.closesAt) : null,
  )
  // ... rest unchanged
```

Update the opensAt column cell (lines 69-74):
```typescript
cell: ({ row }) => (
  <MutedText>
    {row.original.opensAt
      ? new Date(row.original.opensAt).toLocaleDateString()
      : "\u2014"}
  </MutedText>
),
```

Update the closesAt column cell (lines 79-83):
```typescript
cell: ({ row }) => (
  <MutedText>
    {row.original.closesAt
      ? new Date(row.original.closesAt).toLocaleDateString()
      : "\u2014"}
  </MutedText>
),
```

- [ ] **Step 5: Fix `components/topic-card/topic-card.tsx` — handle nullable dates**

Update the props interface:
```typescript
closesAt: Date | null
opensAt: Date | null
```

- [ ] **Step 6: Fix `components/timer-badge.tsx` — handle nullable dates**

Update the props interface:
```typescript
opensAt: Date | null
closesAt: Date | null
```

(Note: This component is currently commented out in usage, so just fix the types.)

- [ ] **Step 7: Fix `app/votes/[voteId]/page.tsx` — handle nullable dates in vote page**

Line 30 already calls `getTopicStatus(topic.opensAt, topic.closesAt)` — this will work since `getTopicStatus` now accepts nulls. No change needed if types align.

- [ ] **Step 8: Fix `lib/actions/votes.ts` — handle nullable dates**

Line 19: `getTopicStatus(topic.opensAt, topic.closesAt)` — already compatible after Task 1 changes. No change needed.

- [ ] **Step 9: Fix `app/member-lists/[listId]/page.tsx` — serialize nullable dates**

Change lines 33-37 from:
```typescript
const serializedTopics = list.topics.map((t) => ({
  closesAt: t.closesAt.toISOString(),
  id: t.id,
  opensAt: t.opensAt.toISOString(),
  title: t.title,
}))
```
to:
```typescript
const serializedTopics = list.topics.map((t) => ({
  closesAt: t.closesAt?.toISOString() ?? null,
  id: t.id,
  opensAt: t.opensAt?.toISOString() ?? null,
  title: t.title,
}))
```

- [ ] **Step 10: Fix `app/member-lists/[listId]/topics-table.tsx` — handle nullable dates**

Update the `Topic` type (lines 10-15):
```typescript
type Topic = {
  id: string
  title: string
  opensAt: string | null
  closesAt: string | null
}
```

Update the status column cell (lines 31-35) to handle nulls:
```typescript
cell: ({ row }) => {
  const status = getTopicStatus(
    row.original.opensAt ? new Date(row.original.opensAt) : null,
    row.original.closesAt ? new Date(row.original.closesAt) : null,
  )
  // ... rest unchanged
```

- [ ] **Step 11: Run typecheck to verify all errors resolved**

Run: `pnpm typecheck`
Expected: No type errors

- [ ] **Step 12: Run all tests**

Run: `pnpm test`
Expected: All tests pass

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "fix: update all consumers to handle nullable topic dates"
```

---

### Task 6: Update edit form with Open/Close buttons

**Files:**
- Modify: `app/topics/[topicId]/edit-topic-form.tsx`

- [ ] **Step 1: Update `EditTopicFormProps` for nullable dates**

Change the topic type in `EditTopicFormProps`:
```typescript
topic: {
  id: string
  title: string
  description: string | null
  isActive: boolean
  memberListId: string
  memberListName: string | null
  opensAt: string | null
  closesAt: string | null
}
```

- [ ] **Step 2: Update state initialization to handle null dates**

Change lines 53-56:
```typescript
const [opensAt, setOpensAt] = useState(
  props.topic.opensAt ? toLocalDatetime(props.topic.opensAt) : "",
)
const [closesAt, setClosesAt] = useState(
  props.topic.closesAt ? toLocalDatetime(props.topic.closesAt) : "",
)
```

- [ ] **Step 3: Remove `required` from date inputs**

Remove `required` prop from both datetime-local inputs (lines 123, 133).

- [ ] **Step 4: Add "Open now" and "Close now" button handlers**

Add these handlers inside the `EditTopicForm` component, after the existing `handleSubmit`:

```typescript
async function handleOpenNow() {
  setSubmitting(true)
  setError(null)
  try {
    const now = new Date().toISOString()
    await updateTopic(props.topic.id, {
      closesAt,
      description,
      isActive,
      memberListId,
      opensAt: now,
      title,
    })
    setOpensAt(toLocalDatetime(now))
    router.refresh()
  } catch (err) {
    setError(err instanceof Error ? err.message : "Something went wrong")
  } finally {
    setSubmitting(false)
  }
}

async function handleCloseNow() {
  setSubmitting(true)
  setError(null)
  try {
    const now = new Date().toISOString()
    await updateTopic(props.topic.id, {
      closesAt: now,
      description,
      isActive,
      memberListId,
      opensAt,
      title,
    })
    setClosesAt(toLocalDatetime(now))
    router.refresh()
  } catch (err) {
    setError(err instanceof Error ? err.message : "Something went wrong")
  } finally {
    setSubmitting(false)
  }
}
```

**Important:** We must update local state (`setOpensAt`/`setClosesAt`) after the server action succeeds, because `router.refresh()` re-renders the server component but does not reset client component state. Without this, the button would not switch from "Open now" to "Close now" after clicking.

- [ ] **Step 5: Add buttons to the form footer**

Update the `FormActions` section. Buttons go left of the save button (Delete is already on the far left via `justify-end` with a gap). Add the Open/Close buttons between Delete and Update:

```tsx
<FormActions>
  <DeleteTopicButton topicId={props.topic.id} />
  {!opensAt && !closesAt && (
    <Button disabled={submitting} onClick={handleOpenNow} type="button">
      {submitting ? "Opening\u2026" : "Open now"}
    </Button>
  )}
  {opensAt && !closesAt && (
    <Button disabled={submitting} onClick={handleCloseNow} type="button">
      {submitting ? "Closing\u2026" : "Close now"}
    </Button>
  )}
  <Button disabled={submitting} type="submit">
    {submitting ? "Saving\u2026" : "Update topic"}
  </Button>
</FormActions>
```

- [ ] **Step 6: Run typecheck and lint**

Run: `pnpm typecheck && pnpm lint`
Expected: No errors

- [ ] **Step 7: Run all tests**

Run: `pnpm test`
Expected: All tests pass

- [ ] **Step 8: Commit**

```bash
git add app/topics/[topicId]/edit-topic-form.tsx
git commit -m "feat: add Open now / Close now buttons to topic edit page"
```

---

### Task 7: Update create form for optional dates

**Files:**
- Modify: `app/topics/create/create-topic-form.tsx`

- [ ] **Step 1: Remove `required` from date inputs**

Remove `required` prop from both datetime-local inputs (lines 103, 113).

- [ ] **Step 2: Run lint**

Run: `pnpm lint`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/topics/create/create-topic-form.tsx
git commit -m "feat: make date fields optional on topic create form"
```

---

### Task 8: Fix null ordering in queries

**Files:**
- Modify: `lib/db/queries.ts:29,53`

Both `getTopicsWithCounts()` and `getAdminTopicsWithCounts()` order by `desc(topics.closesAt)`. With nullable `closesAt`, PostgreSQL sorts `NULL` first in `DESC` order. Topics without a close date (i.e., not yet closed or not yet opened) should appear at the top, which is reasonable — they're the most relevant. If this behavior is undesired, use `.nullsLast()`.

- [ ] **Step 1: Verify current behavior is acceptable**

No code change needed if nulls-first in descending order is desired (active/upcoming topics appear at top). If not, update with:
```typescript
.orderBy(desc(topics.closesAt).nullsLast())
```

- [ ] **Step 2: Commit (if changed)**

```bash
git add lib/db/queries.ts
git commit -m "fix: handle null closesAt ordering in topic queries"
```

---

### Task 9: Manual smoke test

- [ ] **Step 1: Start the dev server**

Run: `docker compose up -d && pnpm dev`

- [ ] **Step 2: Verify the following scenarios**

1. Create a topic without dates — should save with null opensAt/closesAt
2. On the edit page for that topic, verify "Open now" button appears
3. Click "Open now" — should set opensAt to now, page refreshes, button changes to "Close now"
4. Click "Close now" — should set closesAt to now, page refreshes, no Open/Close buttons shown
5. Create a topic with both dates set — no Open/Close buttons should appear on edit page
6. Verify the topics table shows dashes for null dates and correct status badges
7. Verify voting still works on topics with dates set
