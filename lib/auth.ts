import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { APIError } from "better-auth/api"
import { magicLink } from "better-auth/plugins"
import { db } from "@/lib/db"
import { isEmailInAnyMemberList } from "@/lib/db/queries"
import * as schema from "@/lib/db/schema"
import { sendMagicLinkEmail } from "@/lib/email"

export const auth = betterAuth({
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
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
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
