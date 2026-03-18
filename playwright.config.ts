import { defineConfig, devices } from "@playwright/test"
import dotenv from "dotenv"

dotenv.config({ path: ".env.test" })

export default defineConfig({
  globalSetup: "./test/e2e/global-setup.ts",
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  retries: process.env.CI ? 2 : 0,
  testDir: "./test/e2e/specs",
  use: {
    baseURL: "http://localhost:3001",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "pnpm dev --port 3001",
    env: {
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL!,
      NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL!,
      POSTGRES_URL: process.env.POSTGRES_URL!,
      SMTP_FROM: process.env.SMTP_FROM!,
      SMTP_HOST: process.env.SMTP_HOST!,
      SMTP_PASS: process.env.SMTP_PASS!,
      SMTP_PORT: process.env.SMTP_PORT!,
      SMTP_USER: process.env.SMTP_USER!,
    },
    reuseExistingServer: !process.env.CI,
    url: "http://localhost:3001",
  },
  workers: 1,
})
