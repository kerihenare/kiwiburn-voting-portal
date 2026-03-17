import { sql } from "drizzle-orm"
import { testDb } from "./db"

export async function resetDatabase() {
  await testDb.execute(
    sql`TRUNCATE "user", session, verification, member_lists, members, topics, votes CASCADE`,
  )
}
