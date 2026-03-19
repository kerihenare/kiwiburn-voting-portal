import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import {
  CheckboxRow,
  DateGrid,
  FieldError,
  FieldGroup,
  FormActions,
  FormStack,
} from "@/lib/form-styles"

describe("form-styles", () => {
  it("renders FormStack as a form with space-y-6", () => {
    const { container } = render(<FormStack>content</FormStack>)
    const el = container.firstChild as HTMLElement
    expect(el.tagName).toBe("FORM")
    expect(el.className).toContain("space-y-6")
  })

  it("renders FieldGroup as a div with space-y-2", () => {
    const { container } = render(<FieldGroup>content</FieldGroup>)
    const el = container.firstChild as HTMLElement
    expect(el.tagName).toBe("DIV")
    expect(el.className).toContain("space-y-2")
  })

  it("renders FieldError as a p with destructive color", () => {
    const { container } = render(<FieldError>error</FieldError>)
    const el = container.firstChild as HTMLElement
    expect(el.tagName).toBe("P")
    expect(el.className).toContain("text-destructive")
    expect(el.className).toContain("text-sm")
  })

  it("renders FormActions as a flex div", () => {
    const { container } = render(<FormActions>actions</FormActions>)
    const el = container.firstChild as HTMLElement
    expect(el.tagName).toBe("DIV")
    expect(el.className).toContain("flex")
    expect(el.className).toContain("justify-end")
  })

  it("renders DateGrid as a grid div", () => {
    const { container } = render(<DateGrid>dates</DateGrid>)
    const el = container.firstChild as HTMLElement
    expect(el.tagName).toBe("DIV")
    expect(el.className).toContain("grid")
  })

  it("renders CheckboxRow as a flex div with items-center", () => {
    const { container } = render(<CheckboxRow>check</CheckboxRow>)
    const el = container.firstChild as HTMLElement
    expect(el.tagName).toBe("DIV")
    expect(el.className).toContain("flex")
    expect(el.className).toContain("items-center")
  })
})
