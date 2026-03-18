import { defineConfig } from "drizzle-kit"

export default defineConfig({
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
  dialect: "postgresql",
  out: "./drizzle",
  schema: "./lib/db/schema.ts",
})
