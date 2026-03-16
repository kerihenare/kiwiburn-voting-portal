import { config } from "dotenv"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { v7 as uuidv7 } from "uuid"
import { memberLists, members, topics, user as users, votes } from "./schema"

config({ path: ".env" })

const client = postgres(process.env.DATABASE_URL ?? "", { prepare: false })
const db = drizzle(client)

// Deterministic seed for reproducible random values
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

const random = seededRandom(42)

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(random() * arr.length)]
}

async function seed() {
  console.log("Seeding database...")

  // --- Users ---
  const userIds: string[] = []
  const userRows = []

  for (let i = 1; i <= 200; i++) {
    const id = uuidv7()
    userIds.push(id)
    userRows.push({
      createdAt: new Date(),
      email: `user${i}@example.com`,
      emailVerified: false,
      id,
      isAdmin: false,
      name: `User ${i}`,
      updatedAt: new Date(),
    })
  }

  // Add the real user as admin
  const keriId = uuidv7()
  userRows.push({
    createdAt: new Date(),
    email: "keri.kiwiburn@henare.co.nz",
    emailVerified: true,
    id: keriId,
    isAdmin: true,
    name: "Keri Henare",
    updatedAt: new Date(),
  })

  await db.insert(users).values(userRows).onConflictDoNothing()
  console.log(`  Created ${userRows.length} users`)

  // --- Member Lists ---
  const listAId = uuidv7()
  const listBId = uuidv7()
  const listCId = uuidv7()

  await db.insert(memberLists).values([
    {
      description: "First list for testing",
      id: listAId,
      name: "List A",
    },
    {
      description: "Second list for testing",
      id: listBId,
      name: "List B",
    },
    {
      description: "Third list for testing",
      id: listCId,
      name: "List C",
    },
  ])
  console.log("  Created 3 member lists")

  // --- Members ---
  const memberRows = []

  // Users #1-#100 → List A
  for (let i = 0; i < 100; i++) {
    memberRows.push({
      email: `user${i + 1}@example.com`,
      id: uuidv7(),
      memberListId: listAId,
    })
  }

  // Users #50-#150 → List B
  for (let i = 49; i < 150; i++) {
    memberRows.push({
      email: `user${i + 1}@example.com`,
      id: uuidv7(),
      memberListId: listBId,
    })
  }

  // Users #100-#200 → List C
  for (let i = 99; i < 200; i++) {
    memberRows.push({
      email: `user${i + 1}@example.com`,
      id: uuidv7(),
      memberListId: listCId,
    })
  }

  // Keri → List B and List C
  memberRows.push({
    email: "keri.kiwiburn@henare.co.nz",
    id: uuidv7(),
    memberListId: listBId,
  })
  memberRows.push({
    email: "keri.kiwiburn@henare.co.nz",
    id: uuidv7(),
    memberListId: listCId,
  })

  await db.insert(members).values(memberRows).onConflictDoNothing()
  console.log(`  Created ${memberRows.length} members`)

  // --- Topics ---
  const now = new Date()
  const DAY = 86_400_000

  function makeTopic(
    title: string,
    description: string,
    memberListId: string,
    opensAt: Date,
    closesAt: Date,
  ) {
    return {
      closesAt,
      description,
      id: uuidv7(),
      memberListId,
      opensAt,
      title,
    }
  }

  // 3 closed topics for List A
  const listATopics = [
    makeTopic(
      "Should we add a new art installation?",
      "Proposal to fund a large-scale interactive art piece for the main plaza.",
      listAId,
      new Date(now.getTime() - 30 * DAY),
      new Date(now.getTime() - 20 * DAY),
    ),
    makeTopic(
      "Extended burn night schedule",
      "Proposal to extend the Saturday night burn ceremony by 2 hours.",
      listAId,
      new Date(now.getTime() - 25 * DAY),
      new Date(now.getTime() - 15 * DAY),
    ),
    makeTopic(
      "Community kitchen funding",
      "Should we allocate budget for a shared community kitchen?",
      listAId,
      new Date(now.getTime() - 20 * DAY),
      new Date(now.getTime() - 10 * DAY),
    ),
  ]

  // 4 closed topics for List B
  const listBTopics = [
    makeTopic(
      "New volunteer coordinator role",
      "Create a dedicated volunteer coordinator position for the event.",
      listBId,
      new Date(now.getTime() - 28 * DAY),
      new Date(now.getTime() - 18 * DAY),
    ),
    makeTopic(
      "Sound camp guidelines update",
      "Revised noise level guidelines for sound camps.",
      listBId,
      new Date(now.getTime() - 24 * DAY),
      new Date(now.getTime() - 14 * DAY),
    ),
    makeTopic(
      "Ticket pricing for next year",
      "Should we increase ticket prices by 10% to cover rising costs?",
      listBId,
      new Date(now.getTime() - 20 * DAY),
      new Date(now.getTime() - 10 * DAY),
    ),
    makeTopic(
      "Sustainability initiative",
      "Proposal to implement a zero-waste policy for all camps.",
      listBId,
      new Date(now.getTime() - 15 * DAY),
      new Date(now.getTime() - 5 * DAY),
    ),
  ]

  // 1 closed + 3 open + 1 scheduled topics for List C
  const listCTopics = [
    makeTopic(
      "Theme camp registration process",
      "Should we change the theme camp registration to a lottery system?",
      listCId,
      new Date(now.getTime() - 20 * DAY),
      new Date(now.getTime() - 10 * DAY),
    ),
    makeTopic(
      "Workshop space allocation",
      "How should we allocate shared workshop spaces between camps?",
      listCId,
      new Date(now.getTime() - 5 * DAY),
      new Date(now.getTime() + 10 * DAY),
    ),
    makeTopic(
      "First aid station locations",
      "Vote on proposed locations for additional first aid stations.",
      listCId,
      new Date(now.getTime() - 3 * DAY),
      new Date(now.getTime() + 14 * DAY),
    ),
    makeTopic(
      "Art grant funding increase",
      "Proposal to increase the art grant budget by 25%.",
      listCId,
      new Date(now.getTime() - 1 * DAY),
      new Date(now.getTime() + 21 * DAY),
    ),
    makeTopic(
      "Next year venue selection",
      "Vote on the proposed venue for next year's event.",
      listCId,
      new Date(now.getTime() + 7 * DAY),
      new Date(now.getTime() + 30 * DAY),
    ),
  ]

  const allTopics = [...listATopics, ...listBTopics, ...listCTopics]
  await db.insert(topics).values(allTopics)
  console.log(`  Created ${allTopics.length} topics`)

  // --- Votes ---
  // Map list IDs to their member emails for generating valid votes
  const listMemberUserIds: Record<string, string[]> = {
    [listAId]: userIds.slice(0, 100),
    [listBId]: [...userIds.slice(49, 150), keriId],
    [listCId]: [...userIds.slice(99, 200), keriId],
  }

  const voteValues: Array<"yes" | "no"> = ["yes", "no"]
  const voteRows: Array<{
    id: string
    topicId: string
    userId: string
    vote: "yes" | "no"
    createdAt: Date
    updatedAt: Date
  }> = []

  for (const topic of allTopics) {
    const eligibleVoters = listMemberUserIds[topic.memberListId]
    // Each topic gets 20-60 random votes from eligible members
    const voterCount = Math.floor(random() * 41) + 20
    const shuffled = [...eligibleVoters].sort(() => random() - 0.5)
    const voters = shuffled.slice(0, Math.min(voterCount, shuffled.length))

    for (const userId of voters) {
      const votedAt = new Date(
        topic.opensAt.getTime() +
          random() * (now.getTime() - topic.opensAt.getTime()),
      )
      voteRows.push({
        createdAt: votedAt,
        id: uuidv7(),
        topicId: topic.id,
        updatedAt: votedAt,
        userId,
        vote: randomItem(voteValues),
      })
    }
  }

  // Insert votes in batches (avoid hitting parameter limits)
  const BATCH_SIZE = 500
  for (let i = 0; i < voteRows.length; i += BATCH_SIZE) {
    await db.insert(votes).values(voteRows.slice(i, i + BATCH_SIZE))
  }
  console.log(`  Created ${voteRows.length} votes`)

  console.log("Seed complete.")
  await client.end()
}

seed().catch((err) => {
  console.error("Seed failed:", err)
  process.exit(1)
})
