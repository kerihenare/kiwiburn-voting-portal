import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const { mockGetSession } = vi.hoisted(() => ({
  mockGetSession: vi.fn(),
}))

vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession: mockGetSession } },
}))
vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}))
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))
vi.mock("@/components/header/sign-out-button", () => ({
  SignOutButton: () => <button type="button">Sign out</button>,
}))

import { AdminNav } from "@/components/header/admin-nav"
import { User } from "@/components/header/user"

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("shows sign in link when no session", async () => {
    mockGetSession.mockResolvedValue(null)
    render(await User())
    expect(screen.getByText("Sign in")).toBeInTheDocument()
  })

  it("shows user email and sign out when logged in", async () => {
    mockGetSession.mockResolvedValue({
      user: { email: "user@example.com", isAdmin: false },
    })
    const { container } = render(await User())
    expect(screen.getByText("user@example.com")).toBeInTheDocument()
    expect(screen.getByText("Sign out")).toBeInTheDocument()

    render(await AdminNav(), { container })
    expect(screen.queryByText("Member Lists")).not.toBeInTheDocument()
    expect(screen.queryByText("Topics")).not.toBeInTheDocument()
  })

  it("shows admin links when user is admin", async () => {
    mockGetSession.mockResolvedValue({
      user: { email: "admin@example.com", isAdmin: true },
    })
    render(await AdminNav())
    expect(screen.getByText("Member Lists")).toBeInTheDocument()
    expect(screen.getByText("Topics")).toBeInTheDocument()
  })
})
