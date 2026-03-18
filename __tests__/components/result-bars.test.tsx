import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ResultBars } from "@/components/result-bars"

describe("ResultBars", () => {
  it("renders correct counts with votes", () => {
    render(<ResultBars noCount={1} totalVotes={4} yesCount={3} />)
    expect(screen.getByText("Yes")).toBeInTheDocument()
    expect(screen.getByText("3")).toBeInTheDocument()
    expect(screen.getByText("No")).toBeInTheDocument()
    expect(screen.getByText("1")).toBeInTheDocument()
  })

  it("renders 0 when totalVotes is 0", () => {
    render(<ResultBars noCount={0} totalVotes={0} yesCount={0} />)
    const zeros = screen.getAllByText("0")
    expect(zeros).toHaveLength(2)
  })

  it("renders progress bars with correct widths", () => {
    const { container } = render(
      <ResultBars noCount={3} totalVotes={5} yesCount={2} />,
    )
    const greenBar = container.querySelector(".bg-green-500")
    const redBar = container.querySelector(".bg-red-500")
    expect(greenBar).toHaveStyle({ width: "40%" })
    expect(redBar).toHaveStyle({ width: "60%" })
  })
})
