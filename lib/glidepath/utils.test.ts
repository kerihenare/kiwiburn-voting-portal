import { describe, expect, it } from "vitest"
import { flattenClassNames } from "./utils"

describe("flattenClassNames", () => {
  it("returns a string input unchanged", () => {
    expect(flattenClassNames("flex")).toBe("flex")
  })

  it("joins an array of class names with spaces", () => {
    expect(flattenClassNames(["flex", "mt-4"])).toBe("flex mt-4")
  })

  it("preserves breakpoint prefixes in arrays", () => {
    expect(flattenClassNames(["sm:flex", "md:grid"])).toBe("sm:flex md:grid")
  })

  it("handles an array with more than two elements", () => {
    expect(flattenClassNames(["p-4", "mx-auto", "text-lg"])).toBe(
      "p-4 mx-auto text-lg",
    )
  })
})
