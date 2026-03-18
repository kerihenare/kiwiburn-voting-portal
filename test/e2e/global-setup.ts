import { execSync } from "node:child_process"
import dotenv from "dotenv"
import postgres from "postgres"

dotenv.config({ path: ".env.test" })

export default async function globalSetup() {
  const adminUrl = process.env.POSTGRES_URL!.replace(
    /\/[^/]+$/,
    "/voting_portal",
  )
  const adminClient = postgres(adminUrl)

  const result = await adminClient`
    SELECT 1 FROM pg_database WHERE datname = 'voting_portal_test'
  `

  if (result.length === 0) {
    await adminClient`CREATE DATABASE voting_portal_test`
  }

  await adminClient.end()

  execSync("npx drizzle-kit push --force", {
    env: {
      ...process.env,
      POSTGRES_URL: process.env.POSTGRES_URL,
    },
    stdio: "inherit",
  })
}
