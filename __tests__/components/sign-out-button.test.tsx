import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

const { mockPush, mockRefresh, mockSignOut } = vi.hoisted(() => ({
  mockPush: vi.fn(),
  mockRefresh: vi.fn(),
  mockSignOut: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}))

vi.mock("@/lib/auth-client", () => ({
  authClient: { signOut: mockSignOut },
}))

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}))

import { SignOutButton } from "@/components/sign-out-button"

describe("SignOutButton", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders the sign out button", () => {
    render(<SignOutButton />)
    expect(screen.getByText("Sign out")).toBeInTheDocument()
  })

  it("calls signOut and navigates on click", async () => {
    const user = userEvent.setup()
    render(<SignOutButton />)

    await user.click(screen.getByText("Sign out"))

    expect(mockSignOut).toHaveBeenCalled()
    expect(mockPush).toHaveBeenCalledWith("/")
    expect(mockRefresh).toHaveBeenCalled()
  })
})
