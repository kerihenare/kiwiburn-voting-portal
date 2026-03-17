import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { glide } from "./index";
import type { GlidepathObject } from "./types/glidepath-types";

describe("glide", () => {
  describe("basic rendering", () => {
    it("renders the correct HTML element", () => {
      const StyledDiv = glide("div", { display: "flex" });
      render(<StyledDiv data-testid="styled" />);
      expect(screen.getByTestId("styled").tagName).toBe("DIV");
    });

    it('renders a span when given "span"', () => {
      const StyledSpan = glide("span", { display: "inline" });
      render(<StyledSpan data-testid="styled" />);
      expect(screen.getByTestId("styled").tagName).toBe("SPAN");
    });

    it("applies class names from style properties", () => {
      const StyledDiv = glide("div", { display: "flex" });
      render(<StyledDiv data-testid="styled" />);
      expect(screen.getByTestId("styled")).toHaveClass("flex");
    });
  });

  describe("class name composition", () => {
    it("combines multiple style properties", () => {
      const StyledDiv = glide("div", {
        display: "flex",
        padding: "p-4",
      });
      render(<StyledDiv data-testid="styled" />);
      const el = screen.getByTestId("styled");
      expect(el).toHaveClass("flex");
      expect(el).toHaveClass("p-4");
    });

    it("handles array values by joining them", () => {
      const StyledDiv = glide("div", {
        padding: ["p-4", "sm:p-8"],
      });
      render(<StyledDiv data-testid="styled" />);
      const el = screen.getByTestId("styled");
      expect(el).toHaveClass("p-4");
      expect(el).toHaveClass("sm:p-8");
    });
  });

  describe("ordering guarantees", () => {
    it('places "other" classes after regular property classes', () => {
      const StyledDiv = glide("div", {
        display: "flex",
        other: "custom-class",
      });
      render(<StyledDiv data-testid="styled" />);
      const className = screen.getByTestId("styled").className;
      expect(className.indexOf("flex")).toBeLessThan(
        className.indexOf("custom-class"),
      );
    });

    it('places "lineHeight" classes last', () => {
      const StyledDiv = glide("div", {
        display: "flex",
        lineHeight: "leading-tight",
      });
      render(<StyledDiv data-testid="styled" />);
      const className = screen.getByTestId("styled").className;
      expect(className.indexOf("flex")).toBeLessThan(
        className.indexOf("leading-tight"),
      );
    });

    it('places "lineHeight" after "other"', () => {
      const StyledDiv = glide("div", {
        display: "flex",
        lineHeight: "leading-tight",
        other: "custom-class",
      });
      render(<StyledDiv data-testid="styled" />);
      const className = screen.getByTestId("styled").className;
      expect(className.indexOf("custom-class")).toBeLessThan(
        className.indexOf("leading-tight"),
      );
    });
  });

  describe("className merging", () => {
    it("uses only styled classes when no className prop is passed", () => {
      const StyledDiv = glide("div", { display: "flex" });
      render(<StyledDiv data-testid="styled" />);
      expect(screen.getByTestId("styled").className).toBe("flex");
    });

    it("merges consumer className with styled classes", () => {
      const StyledDiv = glide("div", { display: "flex" });
      render(<StyledDiv className="mt-4" data-testid="styled" />);
      const el = screen.getByTestId("styled");
      expect(el).toHaveClass("flex");
      expect(el).toHaveClass("mt-4");
    });

    it("allows consumer className to override styled classes via tailwind-merge", () => {
      const StyledDiv = glide("div", { display: "flex" });
      render(<StyledDiv className="block" data-testid="styled" />);
      const el = screen.getByTestId("styled");
      expect(el).toHaveClass("block");
      expect(el).not.toHaveClass("flex");
    });
  });

  describe("props passthrough", () => {
    it("forwards id prop to the underlying element", () => {
      const StyledDiv = glide("div", { display: "flex" });
      render(<StyledDiv data-testid="styled" id="my-div" />);
      expect(screen.getByTestId("styled").id).toBe("my-div");
    });

    it("forwards data attributes", () => {
      const StyledDiv = glide("div", { display: "flex" });
      render(<StyledDiv data-custom="value" data-testid="styled" />);
      // biome-ignore lint/complexity/useLiteralKeys: Avoids TS error
      expect(screen.getByTestId("styled").dataset["custom"]).toBe("value");
    });
  });

  describe("function styles", () => {
    it("accepts a function and applies the returned styles", () => {
      const StyledDiv = glide("div", () => ({ display: "flex" }));
      render(<StyledDiv data-testid="styled" />);
      expect(screen.getByTestId("styled")).toHaveClass("flex");
    });

    it("receives component props in the style function", () => {
      const StyledDiv = glide("div", (props) => ({
        display: props["aria-expanded"] ? "flex" : "hidden",
      }));
      render(<StyledDiv aria-expanded={true} data-testid="styled" />);
      expect(screen.getByTestId("styled")).toHaveClass("flex");
      expect(screen.getByTestId("styled")).not.toHaveClass("hidden");
    });

    it("updates classes when props change", () => {
      const StyledDiv = glide("div", (props) => ({
        display: props["aria-expanded"] ? "flex" : "hidden",
      }));

      const { rerender } = render(
        <StyledDiv aria-expanded={true} data-testid="styled" />,
      );
      expect(screen.getByTestId("styled")).toHaveClass("flex");

      rerender(<StyledDiv aria-expanded={false} data-testid="styled" />);
      expect(screen.getByTestId("styled")).toHaveClass("hidden");
      expect(screen.getByTestId("styled")).not.toHaveClass("flex");
    });

    it("combines multiple style properties from the returned object", () => {
      const StyledDiv = glide("div", () => ({
        display: "flex",
        padding: "p-4",
      }));
      render(<StyledDiv data-testid="styled" />);
      const el = screen.getByTestId("styled");
      expect(el).toHaveClass("flex");
      expect(el).toHaveClass("p-4");
    });

    it("handles array values in the returned object", () => {
      const StyledDiv = glide("div", () => ({
        padding: ["p-4", "sm:p-8"],
      }));
      render(<StyledDiv data-testid="styled" />);
      const el = screen.getByTestId("styled");
      expect(el).toHaveClass("p-4");
      expect(el).toHaveClass("sm:p-8");
    });

    it('respects "other" and "lineHeight" ordering in the returned object', () => {
      const StyledDiv = glide("div", () => ({
        display: "flex",
        lineHeight: "leading-tight",
        other: "custom-class",
      }));
      render(<StyledDiv data-testid="styled" />);
      const className = screen.getByTestId("styled").className;
      expect(className.indexOf("flex")).toBeLessThan(
        className.indexOf("custom-class"),
      );
      expect(className.indexOf("custom-class")).toBeLessThan(
        className.indexOf("leading-tight"),
      );
    });

    it("merges consumer className with function-derived classes", () => {
      const StyledDiv = glide("div", () => ({ display: "flex" }));
      render(<StyledDiv className="mt-4" data-testid="styled" />);
      const el = screen.getByTestId("styled");
      expect(el).toHaveClass("flex");
      expect(el).toHaveClass("mt-4");
    });

    it("allows consumer className to override function-derived classes via tailwind-merge", () => {
      const StyledDiv = glide("div", () => ({ display: "flex" }));
      render(<StyledDiv className="block" data-testid="styled" />);
      const el = screen.getByTestId("styled");
      expect(el).toHaveClass("block");
      expect(el).not.toHaveClass("flex");
    });

    it("forwards props to the underlying element", () => {
      const StyledDiv = glide("div", () => ({ display: "flex" }));
      render(
        <StyledDiv data-custom="value" data-testid="styled" id="my-div" />,
      );
      expect(screen.getByTestId("styled").id).toBe("my-div");
      // biome-ignore lint/complexity/useLiteralKeys: Avoids TS error
      expect(screen.getByTestId("styled").dataset["custom"]).toBe("value");
    });
  });

  describe("edge cases", () => {
    it("handles an empty styles object", () => {
      const StyledDiv = glide("div", {} as GlidepathObject);
      render(<StyledDiv data-testid="styled" />);
      expect(screen.getByTestId("styled").className).toBe("");
    });

    it('handles styles with only "other"', () => {
      const StyledDiv = glide("div", { other: "custom-class" });
      render(<StyledDiv data-testid="styled" />);
      expect(screen.getByTestId("styled")).toHaveClass("custom-class");
    });

    it('handles styles with only "lineHeight"', () => {
      const StyledDiv = glide("div", { lineHeight: "leading-tight" });
      render(<StyledDiv data-testid="styled" />);
      expect(screen.getByTestId("styled")).toHaveClass("leading-tight");
    });
  });
});
