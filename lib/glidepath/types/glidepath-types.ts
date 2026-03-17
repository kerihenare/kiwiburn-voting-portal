import type { ComponentProps, JSX, JSXElementConstructor } from "react";

import type { TailwindValues } from "./tailwind-types";

/**
 * Modifiers for Tailwind classes
 * @see https://tailwindcss.com/docs/hover-focus-and-other-states
 * @note Enable as needed. Too many modifiers can impact performance.
 */
type Modifiers<T extends string> =
  // --- Pseudo-classes ---
  | `hover:${T}`
  | `focus:${T}`
  | `focus-within:${T}`
  | `focus-visible:${T}`
  | `active:${T}`
  /*
	| `visited:${T}`
	*/
  | `target:${T}`
  | `has-[${string}]:${T}`
  /*
	| `group-[${string}]:${T}`
	| `peer-[${string}]:${T}`
	| `in-[${string}]:${T}`
	| `not-[${string}]:${T}`
	| `inert:${T}`
	*/
  | `first:${T}`
  | `last:${T}`
  /*
	| `only:${T}`
	*/
  | `odd:${T}`
  | `even:${T}`
  /*
	| `first-of-type:${T}`
	| `last-of-type:${T}`
	| `only-of-type:${T}`
	| `nth-[${string}]:${T}`
	| `nth-last-[${string}]:${T}`
	| `nth-of-type-[${string}]:${T}`
	| `nth-last-of-type-[${string}]:${T}`
	| `empty:${T}`
	*/
  | `disabled:${T}`
  /*
	| `enabled:${T}`
	*/
  | `checked:${T}`
  /*
	| `indeterminate:${T}`
	| `default:${T}`
	| `optional:${T}`
	*/
  | `required:${T}`
  | `valid:${T}`
  | `invalid:${T}`
  /*
	| `user-valid:${T}`
	| `user-invalid:${T}`
	| `in-range:${T}`
	| `out-of-range:${T}`
	| `placeholder-shown:${T}`
	| `details-content:${T}`
	| `autofill:${T}`
	*/
  | `read-only:${T}`
  /*
	// --- Pseudo-elements ---
	| `before:${T}`
	| `after:${T}`
	| `first-letter:${T}`
	| `first-line:${T}`
	| `marker:${T}`
	| `selection:${T}`
	| `file:${T}`
	| `backdrop:${T}`
	*/
  | `placeholder:${T}`
  /*
	// --- Child selectors ---
	| `*:${T}`
	| `**:${T}`
	*/
  // --- Responsive breakpoints ---
  | `sm:${T}`
  | `md:${T}`
  | `lg:${T}`
  | `xl:${T}`
  | `2xl:${T}`; /*
	| `min-[${string}]:${T}`
	| `max-sm:${T}`
	| `max-md:${T}`
	| `max-lg:${T}`
	| `max-xl:${T}`
	| `max-2xl:${T}`
	| `max-[${string}]:${T}`
	--- Container queries ---
	| `@3xs:${T}`
	| `@2xs:${T}`
	| `@xs:${T}`
	| `@sm:${T}`
	| `@md:${T}`
	| `@lg:${T}`
	| `@xl:${T}`
	| `@2xl:${T}`
	| `@3xl:${T}`
	| `@4xl:${T}`
	| `@5xl:${T}`
	| `@6xl:${T}`
	| `@7xl:${T}`
	| `@min-[${string}]:${T}`
	| `@max-3xs:${T}`
	| `@max-2xs:${T}`
	| `@max-xs:${T}`
	| `@max-sm:${T}`
	| `@max-md:${T}`
	| `@max-lg:${T}`
	| `@max-xl:${T}`
	| `@max-2xl:${T}`
	| `@max-3xl:${T}`
	| `@max-4xl:${T}`
	| `@max-5xl:${T}`
	| `@max-6xl:${T}`
	| `@max-7xl:${T}`
	| `@max-[${string}]:${T}`
	--- Media and feature queries ---
	| `dark:${T}`
	| `motion-safe:${T}`
	| `motion-reduce:${T}`
	| `contrast-more:${T}`
	| `contrast-less:${T}`
	| `forced-colors:${T}`
	| `inverted-colors:${T}`
	| `pointer-fine:${T}`
	| `pointer-coarse:${T}`
	| `pointer-none:${T}`
	| `any-pointer-fine:${T}`
	| `any-pointer-coarse:${T}`
	| `any-pointer-none:${T}`
	| `portrait:${T}`
	| `landscape:${T}`
	| `noscript:${T}`
	| `print:${T}`
	| `supports-[${string}]:${T}`
	| `starting:${T}`
	--- Attribute selectors ---
	| `aria-busy:${T}`
	| `aria-checked:${T}`
	| `aria-disabled:${T}`
	| `aria-expanded:${T}`
	| `aria-hidden:${T}`
	| `aria-pressed:${T}`
	| `aria-readonly:${T}`
	| `aria-required:${T}`
	| `aria-selected:${T}`
	| `aria-[${string}]:${T}`
	| `data-[${string}]:${T}`
	| `rtl:${T}`
	| `ltr:${T}`
	| `open:${T}`
	*/

/**
 * Expanded Tailwind value (with responsive modifiers)
 *
 * @see https://tailwindcss.com/docs/responsive-design
 * @see https://tailwindcss.com/docs/hover-focus-and-other-states
 */
export type TW<T extends string> = T | Modifiers<T> | (T | Modifiers<T>)[];

/**
 * Glidepath object
 */
export interface GlidepathObject {
  // -------------------------------------------------------------------------
  // Layout
  // -------------------------------------------------------------------------

  /** @see https://tailwindcss.com/docs/aspect-ratio */
  aspectRatio?: TW<TailwindValues["aspectRatio"]>;

  /** @see https://tailwindcss.com/docs/columns */
  columns?: TW<TailwindValues["columns"]>;

  /** @see https://tailwindcss.com/docs/break-after */
  breakAfter?: TW<TailwindValues["breakAfter"]>;

  /** @see https://tailwindcss.com/docs/break-before */
  breakBefore?: TW<TailwindValues["breakBefore"]>;

  /** @see https://tailwindcss.com/docs/break-inside */
  breakInside?: TW<TailwindValues["breakInside"]>;

  /** @see https://tailwindcss.com/docs/box-decoration-break */
  boxDecorationBreak?: TW<TailwindValues["boxDecorationBreak"]>;

  /** @see https://tailwindcss.com/docs/box-sizing */
  boxSizing?: TW<TailwindValues["boxSizing"]>;

  /** @see https://tailwindcss.com/docs/display */
  display?: TW<TailwindValues["display"]>;

  /** @see https://tailwindcss.com/docs/float */
  float?: TW<TailwindValues["float"]>;

  /** @see https://tailwindcss.com/docs/clear */
  clear?: TW<TailwindValues["clear"]>;

  /** @see https://tailwindcss.com/docs/isolation */
  isolation?: TW<TailwindValues["isolation"]>;

  /** @see https://tailwindcss.com/docs/object-fit */
  objectFit?: TW<TailwindValues["objectFit"]>;

  /** @see https://tailwindcss.com/docs/object-position */
  objectPosition?: TW<TailwindValues["objectPosition"]>;

  /** @see https://tailwindcss.com/docs/overflow */
  overflow?: TW<TailwindValues["overflow"]>;

  /** @see https://tailwindcss.com/docs/overflow */
  overflowX?: TW<TailwindValues["overflowX"]>;

  /** @see https://tailwindcss.com/docs/overflow */
  overflowY?: TW<TailwindValues["overflowY"]>;

  /** @see https://tailwindcss.com/docs/overscroll-behavior */
  overscrollBehavior?: TW<TailwindValues["overscrollBehavior"]>;

  /** @see https://tailwindcss.com/docs/overscroll-behavior */
  overscrollBehaviorX?: TW<TailwindValues["overscrollBehaviorX"]>;

  /** @see https://tailwindcss.com/docs/overscroll-behavior */
  overscrollBehaviorY?: TW<TailwindValues["overscrollBehaviorY"]>;

  /** @see https://tailwindcss.com/docs/position */
  position?: TW<TailwindValues["position"]>;

  /** @see https://tailwindcss.com/docs/top-right-bottom-left */
  inset?: TW<TailwindValues["inset"]>;

  /** @see https://tailwindcss.com/docs/top-right-bottom-left */
  insetX?: TW<TailwindValues["insetX"]>;

  /** @see https://tailwindcss.com/docs/top-right-bottom-left */
  insetY?: TW<TailwindValues["insetY"]>;

  /** @see https://tailwindcss.com/docs/top-right-bottom-left */
  top?: TW<TailwindValues["top"]>;

  /** @see https://tailwindcss.com/docs/top-right-bottom-left */
  right?: TW<TailwindValues["right"]>;

  /** @see https://tailwindcss.com/docs/top-right-bottom-left */
  bottom?: TW<TailwindValues["bottom"]>;

  /** @see https://tailwindcss.com/docs/top-right-bottom-left */
  left?: TW<TailwindValues["left"]>;

  /** @see https://tailwindcss.com/docs/top-right-bottom-left */
  start?: TW<TailwindValues["start"]>;

  /** @see https://tailwindcss.com/docs/top-right-bottom-left */
  end?: TW<TailwindValues["end"]>;

  /** @see https://tailwindcss.com/docs/visibility */
  visibility?: TW<TailwindValues["visibility"]>;

  /** @see https://tailwindcss.com/docs/z-index */
  zIndex?: TW<TailwindValues["zIndex"]>;

  // -------------------------------------------------------------------------
  // Flexbox & Grid
  // -------------------------------------------------------------------------

  /** @see https://tailwindcss.com/docs/flex-basis */
  flexBasis?: TW<TailwindValues["flexBasis"]>;

  /** @see https://tailwindcss.com/docs/flex-direction */
  flexDirection?: TW<TailwindValues["flexDirection"]>;

  /** @see https://tailwindcss.com/docs/flex-wrap */
  flexWrap?: TW<TailwindValues["flexWrap"]>;

  /** @see https://tailwindcss.com/docs/flex */
  flex?: TW<TailwindValues["flex"]>;

  /** @see https://tailwindcss.com/docs/flex-grow */
  flexGrow?: TW<TailwindValues["flexGrow"]>;

  /** @see https://tailwindcss.com/docs/flex-shrink */
  flexShrink?: TW<TailwindValues["flexShrink"]>;

  /** @see https://tailwindcss.com/docs/order */
  order?: TW<TailwindValues["order"]>;

  /** @see https://tailwindcss.com/docs/grid-template-columns */
  gridTemplateColumns?: TW<TailwindValues["gridTemplateColumns"]>;

  /** @see https://tailwindcss.com/docs/grid-column */
  gridColumnSpan?: TW<TailwindValues["gridColumnSpan"]>;

  /** @see https://tailwindcss.com/docs/grid-column */
  gridColumnStart?: TW<TailwindValues["gridColumnStart"]>;

  /** @see https://tailwindcss.com/docs/grid-column */
  gridColumnEnd?: TW<TailwindValues["gridColumnEnd"]>;

  /** @see https://tailwindcss.com/docs/grid-column */
  gridColumnAuto?: TW<TailwindValues["gridColumnAuto"]>;

  /** @see https://tailwindcss.com/docs/grid-template-rows */
  gridTemplateRows?: TW<TailwindValues["gridTemplateRows"]>;

  /** @see https://tailwindcss.com/docs/grid-row */
  gridRowSpan?: TW<TailwindValues["gridRowSpan"]>;

  /** @see https://tailwindcss.com/docs/grid-row */
  gridRowStart?: TW<TailwindValues["gridRowStart"]>;

  /** @see https://tailwindcss.com/docs/grid-row */
  gridRowEnd?: TW<TailwindValues["gridRowEnd"]>;

  /** @see https://tailwindcss.com/docs/grid-row */
  gridRowAuto?: TW<TailwindValues["gridRowAuto"]>;

  /** @see https://tailwindcss.com/docs/grid-auto-flow */
  gridAutoFlow?: TW<TailwindValues["gridAutoFlow"]>;

  /** @see https://tailwindcss.com/docs/grid-auto-columns */
  gridAutoColumns?: TW<TailwindValues["gridAutoColumns"]>;

  /** @see https://tailwindcss.com/docs/grid-auto-rows */
  gridAutoRows?: TW<TailwindValues["gridAutoRows"]>;

  /** @see https://tailwindcss.com/docs/gap */
  gap?: TW<TailwindValues["gap"]>;

  /** @see https://tailwindcss.com/docs/gap */
  gapX?: TW<TailwindValues["gapX"]>;

  /** @see https://tailwindcss.com/docs/gap */
  gapY?: TW<TailwindValues["gapY"]>;

  /** @see https://tailwindcss.com/docs/justify-content */
  justifyContent?: TW<TailwindValues["justifyContent"]>;

  /** @see https://tailwindcss.com/docs/justify-items */
  justifyItems?: TW<TailwindValues["justifyItems"]>;

  /** @see https://tailwindcss.com/docs/justify-self */
  justifySelf?: TW<TailwindValues["justifySelf"]>;

  /** @see https://tailwindcss.com/docs/align-content */
  alignContent?: TW<TailwindValues["alignContent"]>;

  /** @see https://tailwindcss.com/docs/align-items */
  alignItems?: TW<TailwindValues["alignItems"]>;

  /** @see https://tailwindcss.com/docs/align-self */
  alignSelf?: TW<TailwindValues["alignSelf"]>;

  /** @see https://tailwindcss.com/docs/place-content */
  placeContent?: TW<TailwindValues["placeContent"]>;

  /** @see https://tailwindcss.com/docs/place-items */
  placeItems?: TW<TailwindValues["placeItems"]>;

  /** @see https://tailwindcss.com/docs/place-self */
  placeSelf?: TW<TailwindValues["placeSelf"]>;

  // -------------------------------------------------------------------------
  // Spacing
  // -------------------------------------------------------------------------

  /** @see https://tailwindcss.com/docs/padding */
  padding?: TW<TailwindValues["padding"]>;

  /** @see https://tailwindcss.com/docs/padding */
  paddingX?: TW<TailwindValues["paddingX"]>;

  /** @see https://tailwindcss.com/docs/padding */
  paddingY?: TW<TailwindValues["paddingY"]>;

  /** @see https://tailwindcss.com/docs/padding */
  paddingTop?: TW<TailwindValues["paddingTop"]>;

  /** @see https://tailwindcss.com/docs/padding */
  paddingRight?: TW<TailwindValues["paddingRight"]>;

  /** @see https://tailwindcss.com/docs/padding */
  paddingBottom?: TW<TailwindValues["paddingBottom"]>;

  /** @see https://tailwindcss.com/docs/padding */
  paddingLeft?: TW<TailwindValues["paddingLeft"]>;

  /** @see https://tailwindcss.com/docs/padding */
  paddingStart?: TW<TailwindValues["paddingStart"]>;

  /** @see https://tailwindcss.com/docs/padding */
  paddingEnd?: TW<TailwindValues["paddingEnd"]>;

  /** @see https://tailwindcss.com/docs/margin */
  margin?: TW<TailwindValues["margin"]>;

  /** @see https://tailwindcss.com/docs/margin */
  marginX?: TW<TailwindValues["marginX"]>;

  /** @see https://tailwindcss.com/docs/margin */
  marginY?: TW<TailwindValues["marginY"]>;

  /** @see https://tailwindcss.com/docs/margin */
  marginTop?: TW<TailwindValues["marginTop"]>;

  /** @see https://tailwindcss.com/docs/margin */
  marginRight?: TW<TailwindValues["marginRight"]>;

  /** @see https://tailwindcss.com/docs/margin */
  marginBottom?: TW<TailwindValues["marginBottom"]>;

  /** @see https://tailwindcss.com/docs/margin */
  marginLeft?: TW<TailwindValues["marginLeft"]>;

  /** @see https://tailwindcss.com/docs/margin */
  marginStart?: TW<TailwindValues["marginStart"]>;

  /** @see https://tailwindcss.com/docs/margin */
  marginEnd?: TW<TailwindValues["marginEnd"]>;

  /** @see https://tailwindcss.com/docs/space */
  spaceX?: TW<TailwindValues["spaceX"]>;

  /** @see https://tailwindcss.com/docs/space */
  spaceY?: TW<TailwindValues["spaceY"]>;

  // -------------------------------------------------------------------------
  // Sizing
  // -------------------------------------------------------------------------

  /** @see https://tailwindcss.com/docs/width */
  width?: TW<TailwindValues["width"]>;

  /** @see https://tailwindcss.com/docs/min-width */
  minWidth?: TW<TailwindValues["minWidth"]>;

  /** @see https://tailwindcss.com/docs/max-width */
  maxWidth?: TW<TailwindValues["maxWidth"]>;

  /** @see https://tailwindcss.com/docs/height */
  height?: TW<TailwindValues["height"]>;

  /** @see https://tailwindcss.com/docs/min-height */
  minHeight?: TW<TailwindValues["minHeight"]>;

  /** @see https://tailwindcss.com/docs/max-height */
  maxHeight?: TW<TailwindValues["maxHeight"]>;

  /** @see https://tailwindcss.com/docs/size */
  size?: TW<TailwindValues["size"]>;

  // -------------------------------------------------------------------------
  // Typography
  // -------------------------------------------------------------------------

  /** @see https://tailwindcss.com/docs/font-family */
  fontFamily?: TW<TailwindValues["fontFamily"]>;

  /**
   * - text-xs => 12px
   * - text-sm => 14px
   * - text-base => 16px
   * - text-lg => 18px
   * - text-xl => 20px
   * - text-2xl => 24px
   * - text-3xl => 30px
   * - text-4xl => 36px
   * - text-5xl => 48px
   * - text-6xl => 60px
   * - text-7xl => 72px
   * - text-8xl => 96px
   * - text-9xl => 128px
   *
   * @see https://tailwindcss.com/docs/font-size
   */
  fontSize?: TW<TailwindValues["fontSize"]>;

  /** @see https://tailwindcss.com/docs/font-smoothing */
  fontSmoothing?: TW<TailwindValues["fontSmoothing"]>;

  /** @see https://tailwindcss.com/docs/font-style */
  fontStyle?: TW<TailwindValues["fontStyle"]>;

  /**
   * - font-thin => 100
   * - font-extralight => 200
   * - font-light => 300
   * - font-normal => 400
   * - font-medium => 500
   * - font-semibold => 600
   * - font-bold => 700
   * - font-extrabold => 800
   * - font-black => 900
   *
   * @see https://tailwindcss.com/docs/font-weight
   */
  fontWeight?: TW<TailwindValues["fontWeight"]>;

  /** @see https://tailwindcss.com/docs/font-variant-numeric */
  fontVariantNumeric?: TW<TailwindValues["fontVariantNumeric"]>;

  /** @see https://tailwindcss.com/docs/letter-spacing */
  letterSpacing?: TW<TailwindValues["letterSpacing"]>;

  /** @see https://tailwindcss.com/docs/line-clamp */
  lineClamp?: TW<TailwindValues["lineClamp"]>;

  /** @see https://tailwindcss.com/docs/line-height */
  lineHeight?: TW<TailwindValues["lineHeight"]>;

  /** @see https://tailwindcss.com/docs/list-style-image */
  listStyleImage?: TW<TailwindValues["listStyleImage"]>;

  /** @see https://tailwindcss.com/docs/list-style-position */
  listStylePosition?: TW<TailwindValues["listStylePosition"]>;

  /** @see https://tailwindcss.com/docs/list-style-type */
  listStyleType?: TW<TailwindValues["listStyleType"]>;

  /** @see https://tailwindcss.com/docs/text-align */
  textAlign?: TW<TailwindValues["textAlign"]>;

  /** @see https://tailwindcss.com/docs/text-color */
  color?: TW<TailwindValues["color"]>;

  /** @see https://tailwindcss.com/docs/text-decoration */
  textDecoration?: TW<TailwindValues["textDecoration"]>;

  /** @see https://tailwindcss.com/docs/text-decoration-color */
  textDecorationColor?: TW<TailwindValues["textDecorationColor"]>;

  /** @see https://tailwindcss.com/docs/text-decoration-style */
  textDecorationStyle?: TW<TailwindValues["textDecorationStyle"]>;

  /** @see https://tailwindcss.com/docs/text-decoration-thickness */
  textDecorationThickness?: TW<TailwindValues["textDecorationThickness"]>;

  /** @see https://tailwindcss.com/docs/text-underline-offset */
  textUnderlineOffset?: TW<TailwindValues["textUnderlineOffset"]>;

  /** @see https://tailwindcss.com/docs/text-transform */
  textTransform?: TW<TailwindValues["textTransform"]>;

  /** @see https://tailwindcss.com/docs/text-overflow */
  textOverflow?: TW<TailwindValues["textOverflow"]>;

  /** @see https://tailwindcss.com/docs/text-wrap */
  textWrap?: TW<TailwindValues["textWrap"]>;

  /** @see https://tailwindcss.com/docs/text-indent */
  textIndent?: TW<TailwindValues["textIndent"]>;

  /** @see https://tailwindcss.com/docs/vertical-align */
  verticalAlign?: TW<TailwindValues["verticalAlign"]>;

  /** @see https://tailwindcss.com/docs/whitespace */
  whitespace?: TW<TailwindValues["whitespace"]>;

  /** @see https://tailwindcss.com/docs/word-break */
  wordBreak?: TW<TailwindValues["wordBreak"]>;

  /** @see https://tailwindcss.com/docs/overflow-wrap */
  overflowWrap?: TW<TailwindValues["overflowWrap"]>;

  /** @see https://tailwindcss.com/docs/hyphens */
  hyphens?: TW<TailwindValues["hyphens"]>;

  /** @see https://tailwindcss.com/docs/content */
  content?: TW<TailwindValues["content"]>;

  // -------------------------------------------------------------------------
  // Backgrounds
  // -------------------------------------------------------------------------

  /** @see https://tailwindcss.com/docs/background-attachment */
  backgroundAttachment?: TW<TailwindValues["backgroundAttachment"]>;

  /** @see https://tailwindcss.com/docs/background-clip */
  backgroundClip?: TW<TailwindValues["backgroundClip"]>;

  /** @see https://tailwindcss.com/docs/background-color */
  backgroundColor?: TW<TailwindValues["backgroundColor"]>;

  /** @see https://tailwindcss.com/docs/background-origin */
  backgroundOrigin?: TW<TailwindValues["backgroundOrigin"]>;

  /** @see https://tailwindcss.com/docs/background-position */
  backgroundPosition?: TW<TailwindValues["backgroundPosition"]>;

  /** @see https://tailwindcss.com/docs/background-repeat */
  backgroundRepeat?: TW<TailwindValues["backgroundRepeat"]>;

  /** @see https://tailwindcss.com/docs/background-size */
  backgroundSize?: TW<TailwindValues["backgroundSize"]>;

  /** @see https://tailwindcss.com/docs/background-image */
  backgroundImage?: TW<TailwindValues["backgroundImage"]>;

  /** @see https://tailwindcss.com/docs/gradient-color-stops */
  gradientFrom?: TW<TailwindValues["gradientFrom"]>;

  /** @see https://tailwindcss.com/docs/gradient-color-stops */
  gradientVia?: TW<TailwindValues["gradientVia"]>;

  /** @see https://tailwindcss.com/docs/gradient-color-stops */
  gradientTo?: TW<TailwindValues["gradientTo"]>;

  /** @see https://tailwindcss.com/docs/gradient-color-stops */
  gradientFromPosition?: TW<TailwindValues["gradientFromPosition"]>;

  /** @see https://tailwindcss.com/docs/gradient-color-stops */
  gradientViaPosition?: TW<TailwindValues["gradientViaPosition"]>;

  /** @see https://tailwindcss.com/docs/gradient-color-stops */
  gradientToPosition?: TW<TailwindValues["gradientToPosition"]>;

  // -------------------------------------------------------------------------
  // Borders
  // -------------------------------------------------------------------------

  /**
   * - rounded-xs => 2px
   * - rounded-sm => 4px
   * - rounded-md => 6px
   * - rounded-lg => 8px
   * - rounded-xl => 12px
   * - rounded-2xl => 16px
   * - rounded-3xl => 24px
   * - rounded-4xl => 32px
   * - rounded-none => 0
   * - rounded-full => 100%
   *
   * @see https://tailwindcss.com/docs/border-radius
   */
  borderRadius?: TW<TailwindValues["borderRadius"]>;

  /** @see https://tailwindcss.com/docs/border-radius */
  borderRadiusStart?: TW<TailwindValues["borderRadiusStart"]>;

  /** @see https://tailwindcss.com/docs/border-radius */
  borderRadiusEnd?: TW<TailwindValues["borderRadiusEnd"]>;

  /** @see https://tailwindcss.com/docs/border-radius */
  borderRadiusTop?: TW<TailwindValues["borderRadiusTop"]>;

  /** @see https://tailwindcss.com/docs/border-radius */
  borderRadiusRight?: TW<TailwindValues["borderRadiusRight"]>;

  /** @see https://tailwindcss.com/docs/border-radius */
  borderRadiusBottom?: TW<TailwindValues["borderRadiusBottom"]>;

  /** @see https://tailwindcss.com/docs/border-radius */
  borderRadiusLeft?: TW<TailwindValues["borderRadiusLeft"]>;

  /** @see https://tailwindcss.com/docs/border-radius */
  borderRadiusTopLeft?: TW<TailwindValues["borderRadiusTopLeft"]>;

  /** @see https://tailwindcss.com/docs/border-radius */
  borderRadiusTopRight?: TW<TailwindValues["borderRadiusTopRight"]>;

  /** @see https://tailwindcss.com/docs/border-radius */
  borderRadiusBottomRight?: TW<TailwindValues["borderRadiusBottomRight"]>;

  /** @see https://tailwindcss.com/docs/border-radius */
  borderRadiusBottomLeft?: TW<TailwindValues["borderRadiusBottomLeft"]>;

  /** @see https://tailwindcss.com/docs/border-radius */
  borderRadiusStartStart?: TW<TailwindValues["borderRadiusStartStart"]>;

  /** @see https://tailwindcss.com/docs/border-radius */
  borderRadiusStartEnd?: TW<TailwindValues["borderRadiusStartEnd"]>;

  /** @see https://tailwindcss.com/docs/border-radius */
  borderRadiusEndStart?: TW<TailwindValues["borderRadiusEndStart"]>;

  /** @see https://tailwindcss.com/docs/border-radius */
  borderRadiusEndEnd?: TW<TailwindValues["borderRadiusEndEnd"]>;

  /** @see https://tailwindcss.com/docs/border-width */
  borderWidth?: TW<TailwindValues["borderWidth"]>;

  /** @see https://tailwindcss.com/docs/border-width */
  borderWidthX?: TW<TailwindValues["borderWidthX"]>;

  /** @see https://tailwindcss.com/docs/border-width */
  borderWidthY?: TW<TailwindValues["borderWidthY"]>;

  /** @see https://tailwindcss.com/docs/border-width */
  borderWidthTop?: TW<TailwindValues["borderWidthTop"]>;

  /** @see https://tailwindcss.com/docs/border-width */
  borderWidthRight?: TW<TailwindValues["borderWidthRight"]>;

  /** @see https://tailwindcss.com/docs/border-width */
  borderWidthBottom?: TW<TailwindValues["borderWidthBottom"]>;

  /** @see https://tailwindcss.com/docs/border-width */
  borderWidthLeft?: TW<TailwindValues["borderWidthLeft"]>;

  /** @see https://tailwindcss.com/docs/border-width */
  borderWidthStart?: TW<TailwindValues["borderWidthStart"]>;

  /** @see https://tailwindcss.com/docs/border-width */
  borderWidthEnd?: TW<TailwindValues["borderWidthEnd"]>;

  /** @see https://tailwindcss.com/docs/border-color */
  borderColor?: TW<TailwindValues["borderColor"]>;

  /** @see https://tailwindcss.com/docs/border-style */
  borderStyle?: TW<TailwindValues["borderStyle"]>;

  /** @see https://tailwindcss.com/docs/divide-width */
  divideX?: TW<TailwindValues["divideX"]>;

  /** @see https://tailwindcss.com/docs/divide-width */
  divideY?: TW<TailwindValues["divideY"]>;

  /** @see https://tailwindcss.com/docs/divide-color */
  divideColor?: TW<TailwindValues["divideColor"]>;

  /** @see https://tailwindcss.com/docs/divide-style */
  divideStyle?: TW<TailwindValues["divideStyle"]>;

  /** @see https://tailwindcss.com/docs/outline-width */
  outlineWidth?: TW<TailwindValues["outlineWidth"]>;

  /** @see https://tailwindcss.com/docs/outline-color */
  outlineColor?: TW<TailwindValues["outlineColor"]>;

  /** @see https://tailwindcss.com/docs/outline-style */
  outlineStyle?: TW<TailwindValues["outlineStyle"]>;

  /** @see https://tailwindcss.com/docs/outline-offset */
  outlineOffset?: TW<TailwindValues["outlineOffset"]>;

  /** @see https://tailwindcss.com/docs/ring-width */
  ringWidth?: TW<TailwindValues["ringWidth"]>;

  /** @see https://tailwindcss.com/docs/ring-color */
  ringColor?: TW<TailwindValues["ringColor"]>;

  /** @see https://tailwindcss.com/docs/ring-offset-width */
  ringOffsetWidth?: TW<TailwindValues["ringOffsetWidth"]>;

  /** @see https://tailwindcss.com/docs/ring-offset-color */
  ringOffsetColor?: TW<TailwindValues["ringOffsetColor"]>;

  // -------------------------------------------------------------------------
  // Effects
  // -------------------------------------------------------------------------

  /** @see https://tailwindcss.com/docs/box-shadow */
  boxShadow?: TW<TailwindValues["boxShadow"]>;

  /** @see https://tailwindcss.com/docs/box-shadow-color */
  boxShadowColor?: TW<TailwindValues["boxShadowColor"]>;

  /** @see https://tailwindcss.com/docs/opacity */
  opacity?: TW<TailwindValues["opacity"]>;

  /** @see https://tailwindcss.com/docs/mix-blend-mode */
  mixBlendMode?: TW<TailwindValues["mixBlendMode"]>;

  /** @see https://tailwindcss.com/docs/background-blend-mode */
  backgroundBlendMode?: TW<TailwindValues["backgroundBlendMode"]>;

  // -------------------------------------------------------------------------
  // Filters
  // -------------------------------------------------------------------------

  /** @see https://tailwindcss.com/docs/blur */
  blur?: TW<TailwindValues["blur"]>;

  /** @see https://tailwindcss.com/docs/brightness */
  brightness?: TW<TailwindValues["brightness"]>;

  /** @see https://tailwindcss.com/docs/contrast */
  contrast?: TW<TailwindValues["contrast"]>;

  /** @see https://tailwindcss.com/docs/drop-shadow */
  dropShadow?: TW<TailwindValues["dropShadow"]>;

  /** @see https://tailwindcss.com/docs/grayscale */
  grayscale?: TW<TailwindValues["grayscale"]>;

  /** @see https://tailwindcss.com/docs/hue-rotate */
  hueRotate?: TW<TailwindValues["hueRotate"]>;

  /** @see https://tailwindcss.com/docs/invert */
  invert?: TW<TailwindValues["invert"]>;

  /** @see https://tailwindcss.com/docs/saturate */
  saturate?: TW<TailwindValues["saturate"]>;

  /** @see https://tailwindcss.com/docs/sepia */
  sepia?: TW<TailwindValues["sepia"]>;

  /** @see https://tailwindcss.com/docs/backdrop-blur */
  backdropBlur?: TW<TailwindValues["backdropBlur"]>;

  /** @see https://tailwindcss.com/docs/backdrop-brightness */
  backdropBrightness?: TW<TailwindValues["backdropBrightness"]>;

  /** @see https://tailwindcss.com/docs/backdrop-contrast */
  backdropContrast?: TW<TailwindValues["backdropContrast"]>;

  /** @see https://tailwindcss.com/docs/backdrop-grayscale */
  backdropGrayscale?: TW<TailwindValues["backdropGrayscale"]>;

  /** @see https://tailwindcss.com/docs/backdrop-hue-rotate */
  backdropHueRotate?: TW<TailwindValues["backdropHueRotate"]>;

  /** @see https://tailwindcss.com/docs/backdrop-invert */
  backdropInvert?: TW<TailwindValues["backdropInvert"]>;

  /** @see https://tailwindcss.com/docs/backdrop-opacity */
  backdropOpacity?: TW<TailwindValues["backdropOpacity"]>;

  /** @see https://tailwindcss.com/docs/backdrop-saturate */
  backdropSaturate?: TW<TailwindValues["backdropSaturate"]>;

  /** @see https://tailwindcss.com/docs/backdrop-sepia */
  backdropSepia?: TW<TailwindValues["backdropSepia"]>;

  // -------------------------------------------------------------------------
  // Tables
  // -------------------------------------------------------------------------

  /** @see https://tailwindcss.com/docs/border-collapse */
  borderCollapse?: TW<TailwindValues["borderCollapse"]>;

  /** @see https://tailwindcss.com/docs/border-spacing */
  borderSpacing?: TW<TailwindValues["borderSpacing"]>;

  /** @see https://tailwindcss.com/docs/border-spacing */
  borderSpacingX?: TW<TailwindValues["borderSpacingX"]>;

  /** @see https://tailwindcss.com/docs/border-spacing */
  borderSpacingY?: TW<TailwindValues["borderSpacingY"]>;

  /** @see https://tailwindcss.com/docs/table-layout */
  tableLayout?: TW<TailwindValues["tableLayout"]>;

  /** @see https://tailwindcss.com/docs/caption-side */
  captionSide?: TW<TailwindValues["captionSide"]>;

  // -------------------------------------------------------------------------
  // Transitions & Animation
  // -------------------------------------------------------------------------

  /** @see https://tailwindcss.com/docs/transition-property */
  transitionProperty?: TW<TailwindValues["transitionProperty"]>;

  /** @see https://tailwindcss.com/docs/transition-behavior */
  transitionBehavior?: TW<TailwindValues["transitionBehavior"]>;

  /** @see https://tailwindcss.com/docs/transition-duration */
  transitionDuration?: TW<TailwindValues["transitionDuration"]>;

  /** @see https://tailwindcss.com/docs/transition-timing-function */
  transitionTimingFunction?: TW<TailwindValues["transitionTimingFunction"]>;

  /** @see https://tailwindcss.com/docs/transition-delay */
  transitionDelay?: TW<TailwindValues["transitionDelay"]>;

  /** @see https://tailwindcss.com/docs/animation */
  animation?: TW<TailwindValues["animation"]>;

  // -------------------------------------------------------------------------
  // Transforms
  // -------------------------------------------------------------------------

  /** @see https://tailwindcss.com/docs/backface-visibility */
  backfaceVisibility?: TW<TailwindValues["backfaceVisibility"]>;

  /** @see https://tailwindcss.com/docs/perspective */
  perspective?: TW<TailwindValues["perspective"]>;

  /** @see https://tailwindcss.com/docs/perspective-origin */
  perspectiveOrigin?: TW<TailwindValues["perspectiveOrigin"]>;

  /** @see https://tailwindcss.com/docs/rotate */
  rotate?: TW<TailwindValues["rotate"]>;

  /** @see https://tailwindcss.com/docs/scale */
  scale?: TW<TailwindValues["scale"]>;

  /** @see https://tailwindcss.com/docs/skew */
  skew?: TW<TailwindValues["skew"]>;

  /** @see https://tailwindcss.com/docs/transform */
  transform?: TW<TailwindValues["transform"]>;

  /** @see https://tailwindcss.com/docs/transform-origin */
  transformOrigin?: TW<TailwindValues["transformOrigin"]>;

  /** @see https://tailwindcss.com/docs/transform-style */
  transformStyle?: TW<TailwindValues["transformStyle"]>;

  /** @see https://tailwindcss.com/docs/translate */
  translate?: TW<TailwindValues["translate"]>;

  // -------------------------------------------------------------------------
  // Interactivity
  // -------------------------------------------------------------------------

  /** @see https://tailwindcss.com/docs/accent-color */
  accentColor?: TW<TailwindValues["accentColor"]>;

  /** @see https://tailwindcss.com/docs/appearance */
  appearance?: TW<TailwindValues["appearance"]>;

  /** @see https://tailwindcss.com/docs/cursor */
  cursor?: TW<TailwindValues["cursor"]>;

  /** @see https://tailwindcss.com/docs/caret-color */
  caretColor?: TW<TailwindValues["caretColor"]>;

  /** @see https://tailwindcss.com/docs/pointer-events */
  pointerEvents?: TW<TailwindValues["pointerEvents"]>;

  /** @see https://tailwindcss.com/docs/resize */
  resize?: TW<TailwindValues["resize"]>;

  /** @see https://tailwindcss.com/docs/scroll-behavior */
  scrollBehavior?: TW<TailwindValues["scrollBehavior"]>;

  /** @see https://tailwindcss.com/docs/scroll-margin */
  scrollMargin?: TW<TailwindValues["scrollMargin"]>;

  /** @see https://tailwindcss.com/docs/scroll-margin */
  scrollMarginX?: TW<TailwindValues["scrollMarginX"]>;

  /** @see https://tailwindcss.com/docs/scroll-margin */
  scrollMarginY?: TW<TailwindValues["scrollMarginY"]>;

  /** @see https://tailwindcss.com/docs/scroll-margin */
  scrollMarginTop?: TW<TailwindValues["scrollMarginTop"]>;

  /** @see https://tailwindcss.com/docs/scroll-margin */
  scrollMarginRight?: TW<TailwindValues["scrollMarginRight"]>;

  /** @see https://tailwindcss.com/docs/scroll-margin */
  scrollMarginBottom?: TW<TailwindValues["scrollMarginBottom"]>;

  /** @see https://tailwindcss.com/docs/scroll-margin */
  scrollMarginLeft?: TW<TailwindValues["scrollMarginLeft"]>;

  /** @see https://tailwindcss.com/docs/scroll-margin */
  scrollMarginStart?: TW<TailwindValues["scrollMarginStart"]>;

  /** @see https://tailwindcss.com/docs/scroll-margin */
  scrollMarginEnd?: TW<TailwindValues["scrollMarginEnd"]>;

  /** @see https://tailwindcss.com/docs/scroll-padding */
  scrollPadding?: TW<TailwindValues["scrollPadding"]>;

  /** @see https://tailwindcss.com/docs/scroll-padding */
  scrollPaddingX?: TW<TailwindValues["scrollPaddingX"]>;

  /** @see https://tailwindcss.com/docs/scroll-padding */
  scrollPaddingY?: TW<TailwindValues["scrollPaddingY"]>;

  /** @see https://tailwindcss.com/docs/scroll-padding */
  scrollPaddingTop?: TW<TailwindValues["scrollPaddingTop"]>;

  /** @see https://tailwindcss.com/docs/scroll-padding */
  scrollPaddingRight?: TW<TailwindValues["scrollPaddingRight"]>;

  /** @see https://tailwindcss.com/docs/scroll-padding */
  scrollPaddingBottom?: TW<TailwindValues["scrollPaddingBottom"]>;

  /** @see https://tailwindcss.com/docs/scroll-padding */
  scrollPaddingLeft?: TW<TailwindValues["scrollPaddingLeft"]>;

  /** @see https://tailwindcss.com/docs/scroll-padding */
  scrollPaddingStart?: TW<TailwindValues["scrollPaddingStart"]>;

  /** @see https://tailwindcss.com/docs/scroll-padding */
  scrollPaddingEnd?: TW<TailwindValues["scrollPaddingEnd"]>;

  /** @see https://tailwindcss.com/docs/scroll-snap-align */
  scrollSnapAlign?: TW<TailwindValues["scrollSnapAlign"]>;

  /** @see https://tailwindcss.com/docs/scroll-snap-stop */
  scrollSnapStop?: TW<TailwindValues["scrollSnapStop"]>;

  /** @see https://tailwindcss.com/docs/scroll-snap-type */
  scrollSnapType?: TW<TailwindValues["scrollSnapType"]>;

  /** @see https://tailwindcss.com/docs/touch-action */
  touchAction?: TW<TailwindValues["touchAction"]>;

  /** @see https://tailwindcss.com/docs/user-select */
  userSelect?: TW<TailwindValues["userSelect"]>;

  /** @see https://tailwindcss.com/docs/will-change */
  willChange?: TW<TailwindValues["willChange"]>;

  // -------------------------------------------------------------------------
  // SVG
  // -------------------------------------------------------------------------

  /** @see https://tailwindcss.com/docs/fill */
  fill?: TW<TailwindValues["fill"]>;

  /** @see https://tailwindcss.com/docs/stroke */
  stroke?: TW<TailwindValues["stroke"]>;

  /** @see https://tailwindcss.com/docs/stroke-width */
  strokeWidth?: TW<TailwindValues["strokeWidth"]>;

  // -------------------------------------------------------------------------
  // Accessibility
  // -------------------------------------------------------------------------

  /** @see https://tailwindcss.com/docs/screen-readers */
  screenReaders?: TW<TailwindValues["screenReaders"]>;

  /** @see https://tailwindcss.com/docs/forced-color-adjust */
  forcedColorAdjust?: TW<TailwindValues["forcedColorAdjust"]>;

  /** Misc class names not already covered by a typed property */
  other?: TW<string>;
}

/**
 * GlidePath function
 *
 * @param props - The component props
 * @returns The Glidepath object
 */
export type GlidePathFunction<
  // biome-ignore lint/suspicious/noExplicitAny: Unknowable props
  T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>,
> = (props: ComponentProps<T>) => GlidepathObject;
