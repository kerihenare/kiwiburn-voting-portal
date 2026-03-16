import { describe, expect, it, vi } from "vitest"

vi.mock("better-auth/react", () => ({
  createAuthClient: vi.fn().mockReturnValue({
    signIn: vi.fn(),
    signOut: vi.fn(),
    useSession: vi.fn(),
  }),
}))

vi.mock("better-auth/client/plugins", () => ({
  magicLinkClient: vi.fn().mockReturnValue({}),
}))

import { magicLinkClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import { authClient, signIn, signOut, useSession } from "@/lib/auth-client"

describe("auth-client", () => {
  it("exports authClient", () => {
    expect(authClient).toBeDefined()
  })

  it("exports signIn", () => {
    expect(signIn).toBeDefined()
  })

  it("exports signOut", () => {
    expect(signOut).toBeDefined()
  })

  it("exports useSession", () => {
    expect(useSession).toBeDefined()
  })

  it("calls createAuthClient with correct config", () => {
    expect(createAuthClient).toHaveBeenCalledWith({
      baseURL: expect.any(String),
      plugins: [expect.any(Object)],
    })
  })

  it("uses magicLinkClient plugin", () => {
    expect(magicLinkClient).toHaveBeenCalled()
  })
})
