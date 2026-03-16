import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { magicLink } from "better-auth/plugins"
import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"
import { sendMagicLinkEmail } from "@/lib/email"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendMagicLinkEmail({ email, url })
      },
      expiresIn: 900, // 15 minutes
    }),
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  user: {
    additionalFields: {
      isAdmin: {
        type: "boolean",
        defaultValue: false,
        input: false,
      },
    },
  },
})

export type Session = typeof auth.$Infer.Session
