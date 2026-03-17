import dotenv from "dotenv"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "../../../lib/db/schema"

dotenv.config({ path: ".env.test" })

const connectionString = process.env.DATABASE_URL!
const client = postgres(connectionString)

export const testDb = drizzle(client, { schema })
export { client as testClient }
