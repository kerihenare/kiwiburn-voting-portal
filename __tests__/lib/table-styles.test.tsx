import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { AlignRight, MutedText, NumericCell } from "@/lib/table-styles"

describe("table-styles", () => {
  it("renders MutedText as a span with muted color", () => {
    const { container } = render(<MutedText>text</MutedText>)
    const el = container.firstChild as HTMLElement
    expect(el.tagName).toBe("SPAN")
    expect(el.className).toContain("text-muted-foreground")
  })

  it("renders AlignRight as a div with text-right", () => {
    const { container } = render(<AlignRight>right</AlignRight>)
    const el = container.firstChild as HTMLElement
    expect(el.tagName).toBe("DIV")
    expect(el.className).toContain("text-right")
  })

  it("renders NumericCell as a div with tabular-nums and text-right", () => {
    const { container } = render(<NumericCell>42</NumericCell>)
    const el = container.firstChild as HTMLElement
    expect(el.tagName).toBe("DIV")
    expect(el.className).toContain("tabular-nums")
    expect(el.className).toContain("text-right")
  })
})
