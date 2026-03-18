import { waitUntil } from "@vercel/functions"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { APIError } from "better-auth/api"
import { magicLink } from "better-auth/plugins"
import { db } from "@/lib/db"
import { isEmailInAnyMemberList } from "@/lib/db/queries"
import * as schema from "@/lib/db/schema"
import { sendMagicLinkEmail } from "@/lib/email"

export const auth = betterAuth({
  advanced: {
    backgroundTasks: { handler: waitUntil },
  },
  appName: "Kiwiburn Voting Portal",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  plugins: [
    magicLink({
      disableSignUp: true,
      expiresIn: 900, // 15 minutes
      sendMagicLink: async ({ email, url }) => {
        const isMember = await isEmailInAnyMemberList(email)

        if (!isMember) {
          throw new APIError("FORBIDDEN", {
            message: "This email is not on any member list",
          })
        }

        await sendMagicLinkEmail({ email, url })
      },
    }),
  ],
  rateLimit: {
    customRules: {
      "/sign-in/magic-link": {
        max: 3,
        window: 60,
      },
    },
    enabled: true,
    max: 100,
    storage: "memory",
    window: 60,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
    expiresIn: 2 * 60 * 60, // 2 hours
  },
  user: {
    additionalFields: {
      isAdmin: {
        defaultValue: false,
        input: false,
        type: "boolean",
      },
    },
  },
})
