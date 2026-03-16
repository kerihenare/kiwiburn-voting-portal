import path from "node:path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    coverage: {
      exclude: [
        "lib/db/index.ts",
        "lib/db/schema.ts",
        "lib/db/seed.ts",
        "lib/auth.ts",
        "app/api/auth/**",
        "components/ui/**",
      ],
      include: [
        "lib/**/*.ts",
        "hooks/**/*.ts",
        "components/header.tsx",
        "components/topic-card.tsx",
        "components/vote-buttons.tsx",
        "components/result-bars.tsx",
        "components/timer-badge.tsx",
        "components/sign-out-button.tsx",
        "middleware.ts",
        "emails/**/*.tsx",
        "app/api/**/*.ts",
      ],
      provider: "v8",
    },
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
})
