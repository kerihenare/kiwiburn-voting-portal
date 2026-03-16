import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useIsMobile } from "@/hooks/use-mobile"

describe("useIsMobile", () => {
  let listeners: Map<string, Function>
  let mockMql: {
    addEventListener: ReturnType<typeof vi.fn>
    removeEventListener: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    listeners = new Map()
    mockMql = {
      addEventListener: vi.fn((event: string, handler: Function) => {
        listeners.set(event, handler)
      }),
      removeEventListener: vi.fn(),
    }
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue(mockMql))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("returns false initially (before effect runs with undefined)", () => {
    vi.stubGlobal("innerWidth", 1024)
    const { result } = renderHook(() => useIsMobile())
    // After effect, innerWidth 1024 >= 768 so not mobile
    expect(result.current).toBe(false)
  })

  it("returns true when window width is below breakpoint", () => {
    vi.stubGlobal("innerWidth", 500)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it("returns false when window width is at breakpoint", () => {
    vi.stubGlobal("innerWidth", 768)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it("responds to change events", () => {
    vi.stubGlobal("innerWidth", 1024)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)

    // Simulate resize to mobile
    vi.stubGlobal("innerWidth", 500)
    act(() => {
      const onChange = listeners.get("change")
      onChange?.()
    })
    expect(result.current).toBe(true)
  })

  it("cleans up the event listener on unmount", () => {
    vi.stubGlobal("innerWidth", 1024)
    const { unmount } = renderHook(() => useIsMobile())
    unmount()
    expect(mockMql.removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    )
  })

  it("creates matchMedia with correct query", () => {
    vi.stubGlobal("innerWidth", 1024)
    renderHook(() => useIsMobile())
    expect(window.matchMedia).toHaveBeenCalledWith("(max-width: 767px)")
  })
})
