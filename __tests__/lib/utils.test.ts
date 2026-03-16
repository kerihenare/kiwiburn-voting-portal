import { describe, expect, it } from "vitest"
import { cn } from "@/lib/utils"

describe("cn", () => {
  it("returns empty string with no arguments", () => {
    expect(cn()).toBe("")
  })

  it("returns a single class unchanged", () => {
    expect(cn("text-red-500")).toBe("text-red-500")
  })

  it("merges multiple classes", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2")
  })

  it("handles conditional classes via clsx", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible")
    expect(cn("base", true && "hidden", "visible")).toBe("base hidden visible")
  })

  it("handles undefined and null values", () => {
    expect(cn("base", undefined, null, "end")).toBe("base end")
  })

  it("resolves tailwind merge conflicts by keeping the last conflicting class", () => {
    expect(cn("px-2", "px-4")).toBe("px-4")
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500")
    expect(cn("bg-white", "bg-black")).toBe("bg-black")
  })

  it("handles object syntax from clsx", () => {
    expect(cn({ "font-bold": true, "text-sm": false })).toBe("font-bold")
  })

  it("handles array syntax from clsx", () => {
    expect(cn(["px-2", "py-2"])).toBe("px-2 py-2")
  })
})
