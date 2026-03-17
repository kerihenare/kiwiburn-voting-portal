import type {
  BlendMode,
  BorderRadiusSize,
  ColorWithOpacity,
  MaxWidthName,
  SizeValue,
  SpacingValue,
} from "./utility-types"

/**
 * Tailwind values
 *
 * @see https://tailwindcss.com/docs/styling-with-utility-classes
 */
export interface TailwindValues {
  // -------------------------------------------------------------------------
  // Layout
  // -------------------------------------------------------------------------

  /** @see https://tailwindcss.com/docs/aspect-ratio */
  aspectRatio:
    | "aspect-square"
    | "aspect-video"
    | "aspect-auto"
    | (`aspect-${string}` & {})

  /** @see https://tailwindcss.com/docs/columns */
  columns:
    | "columns-3xs"
    | "columns-2xs"
    | "columns-xs"
    | "columns-sm"
    | "columns-md"
    | "columns-lg"
    | "columns-xl"
    | "columns-2xl"
    | "columns-3xl"
    | "columns-4xl"
    | "columns-5xl"
    | "columns-6xl"
    | "columns-7xl"
    | "columns-auto"
    | (`columns-${string}` & {})

  /** @see https://tailwindcss.com/docs/break-after */
  breakAfter:
    | "break-after-auto"
    | "break-after-avoid"
    | "break-after-all"
    | "break-after-avoid-page"
    | "break-after-page"
    | "break-after-left"
    | "break-after-right"
    | "break-after-column"

  /** @see https://tailwindcss.com/docs/break-before */
  breakBefore:
    | "break-before-auto"
    | "break-before-avoid"
    | "break-before-all"
    | "break-before-avoid-page"
    | "break-before-page"
    | "break-before-left"
    | "break-before-right"
    | "break-before-column"

  /** @see https://tailwindcss.com/docs/break-inside */
  breakInside:
    | "break-inside-auto"
    | "break-inside-avoid"
    | "break-inside-avoid-page"
    | "break-inside-column"

  /** @see https://tailwindcss.com/docs/box-decoration-break */
  boxDecorationBreak: "box-decoration-clone" | "box-decoration-slice"

  /** @see https://tailwindcss.com/docs/box-sizing */
  boxSizing: "box-border" | "box-content"

  /** @see https://tailwindcss.com/docs/display */
  display:
    | "inline"
    | "block"
    | "inline-block"
    | "flow-root"
    | "flex"
    | "inline-flex"
    | "grid"
    | "inline-grid"
    | "contents"
    | "table"
    | "inline-table"
    | "table-caption"
    | "table-cell"
    | "table-column"
    | "table-column-group"
    | "table-footer-group"
    | "table-header-group"
    | "table-row-group"
    | "table-row"
    | "list-item"
    | "hidden"
    | "sr-only"

  /** @see https://tailwindcss.com/docs/float */
  float:
    | "float-right"
    | "float-left"
    | "float-none"
    | "float-start"
    | "float-end"

  /** @see https://tailwindcss.com/docs/clear */
  clear:
    | "clear-left"
    | "clear-right"
    | "clear-both"
    | "clear-none"
    | "clear-start"
    | "clear-end"

  /** @see https://tailwindcss.com/docs/isolation */
  isolation: "isolate" | "isolation-auto"

  /** @see https://tailwindcss.com/docs/object-fit */
  objectFit:
    | "object-contain"
    | "object-cover"
    | "object-fill"
    | "object-none"
    | "object-scale-down"

  /** @see https://tailwindcss.com/docs/object-position */
  objectPosition:
    | "object-bottom"
    | "object-center"
    | "object-left"
    | "object-left-bottom"
    | "object-left-top"
    | "object-right"
    | "object-right-bottom"
    | "object-right-top"
    | "object-top"
    | (`object-${string}` & {})

  /** @see https://tailwindcss.com/docs/overflow */
  overflow:
    | "overflow-auto"
    | "overflow-hidden"
    | "overflow-clip"
    | "overflow-visible"
    | "overflow-scroll"

  /** @see https://tailwindcss.com/docs/overflow */
  overflowX:
    | "overflow-x-auto"
    | "overflow-x-hidden"
    | "overflow-x-clip"
    | "overflow-x-visible"
    | "overflow-x-scroll"

  /** @see https://tailwindcss.com/docs/overflow */
  overflowY:
    | "overflow-y-auto"
    | "overflow-y-hidden"
    | "overflow-y-clip"
    | "overflow-y-visible"
    | "overflow-y-scroll"

  /** @see https://tailwindcss.com/docs/overscroll-behavior */
  overscrollBehavior:
    | "overscroll-auto"
    | "overscroll-contain"
    | "overscroll-none"

  /** @see https://tailwindcss.com/docs/overscroll-behavior */
  overscrollBehaviorX:
    | "overscroll-x-auto"
    | "overscroll-x-contain"
    | "overscroll-x-none"

  /** @see https://tailwindcss.com/docs/overscroll-behavior */
  overscrollBehaviorY:
    | "overscroll-y-auto"
    | "overscroll-y-contain"
    | "overscroll-y-none"

  /** @see https://tailwindcss.com/docs/position */
  position: "static" | "fixed" | "absolute" | "relative" | "sticky"

  /** @see https://tailwindcss.com/docs/top-right-bottom-left */
  inset: `inset-${SpacingValue}` | `-inset-${SpacingValue}`

  /** @see https://tailwindcss.com/docs/top-right-bottom-left */
  insetX: `inset-x-${SpacingValue}` | `-inset-x-${SpacingValue}`

  /** @see https://tailwindcss.com/docs/top-right-bottom-left */
  insetY: `inset-y-${SpacingValue}` | `-inset-y-${SpacingValue}`

  /** @see https://tailwindcss.com/docs/top-right-bottom-left */
  top: `top-${SpacingValue}` | `-top-${SpacingValue}`

  /** @see https://tailwindcss.com/docs/top-right-bottom-left */
  right: `right-${SpacingValue}` | `-right-${SpacingValue}`

  /** @see https://tailwindcss.com/docs/top-right-bottom-left */
  bottom: `bottom-${SpacingValue}` | `-bottom-${SpacingValue}`

  /** @see https://tailwindcss.com/docs/top-right-bottom-left */
  left: `left-${SpacingValue}` | `-left-${SpacingValue}`

  /** @see https://tailwindcss.com/docs/top-right-bottom-left */
  start: `start-${SpacingValue}` | `-start-${SpacingValue}`

  /** @see https://tailwindcss.com/docs/top-right-bottom-left */
  end: `end-${SpacingValue}` | `-end-${SpacingValue}`

  /** @see https://tailwindcss.com/docs/visibility */
  visibility: "visible" | "invisible" | "collapse"

  /** @see https://tailwindcss.com/docs/z-index */
  zIndex: "z-auto" | (`z-${string}` & {}) | `-z-${string}`

  // -------------------------------------------------------------------------
  // Flexbox & Grid
  // -------------------------------------------------------------------------

  /** @see https://tailwindcss.com/docs/flex-basis */
  flexBasis: `basis-${SpacingValue}`

  /** @see https://tailwindcss.com/docs/flex-direction */
  flexDirection:
    | "flex-row"
    | "flex-row-reverse"
    | "flex-col"
    | "flex-col-reverse"

  /** @see https://tailwindcss.com/docs/flex-wrap */
  flexWrap: "flex-wrap" | "flex-wrap-reverse" | "flex-nowrap"

  /** @see https://tailwindcss.com/docs/flex */
  flex:
    | "flex-1"
    | "flex-auto"
    | "flex-initial"
    | "flex-none"
    | (`flex-${string}` & {})

  /** @see https://tailwindcss.com/docs/flex-grow */
  flexGrow: "grow" | `grow-${string}`

  /** @see https://tailwindcss.com/docs/flex-shrink */
  flexShrink: "shrink" | `shrink-${string}`

  /** @see https://tailwindcss.com/docs/order */
  order:
    | "order-first"
    | "order-last"
    | "order-none"
    | (`order-${string}` & {})
    | `-order-${string}`

  /** @see https://tailwindcss.com/docs/grid-template-columns */
  gridTemplateColumns:
    | "grid-cols-none"
    | "grid-cols-subgrid"
    | (`grid-cols-${string}` & {})

  /** @see https://tailwindcss.com/docs/grid-column */
  gridColumnSpan: (`col-span-${string}` & {}) | "col-span-full"

  /** @see https://tailwindcss.com/docs/grid-column */
  gridColumnStart: "col-start-auto" | (`col-start-${string}` & {})

  /** @see https://tailwindcss.com/docs/grid-column */
  gridColumnEnd: "col-end-auto" | (`col-end-${string}` & {})

  /** @see https://tailwindcss.com/docs/grid-column */
  gridColumnAuto: "col-auto"

  /** @see https://tailwindcss.com/docs/grid-template-rows */
  gridTemplateRows:
    | "grid-rows-none"
    | "grid-rows-subgrid"
    | (`grid-rows-${string}` & {})

  /** @see https://tailwindcss.com/docs/grid-row */
  gridRowSpan: (`row-span-${string}` & {}) | "row-span-full"

  /** @see https://tailwindcss.com/docs/grid-row */
  gridRowStart: "row-start-auto" | (`row-start-${string}` & {})

  /** @see https://tailwindcss.com/docs/grid-row */
  gridRowEnd: "row-end-auto" | (`row-end-${string}` & {})

  /** @see https://tailwindcss.com/docs/grid-row */
  gridRowAuto: "row-auto"

  /** @see https://tailwindcss.com/docs/grid-auto-flow */
  gridAutoFlow:
    | "grid-flow-row"
    | "grid-flow-col"
    | "grid-flow-dense"
    | "grid-flow-row-dense"
    | "grid-flow-col-dense"

  /** @see https://tailwindcss.com/docs/grid-auto-columns */
  gridAutoColumns:
    | "auto-cols-auto"
    | "auto-cols-min"
    | "auto-cols-max"
    | "auto-cols-fr"
    | (`auto-cols-${string}` & {})

  /** @see https://tailwindcss.com/docs/grid-auto-rows */
  gridAutoRows:
    | "auto-rows-auto"
    | "auto-rows-min"
    | "auto-rows-max"
    | "auto-rows-fr"
    | (`auto-rows-${string}` & {})

  /** @see https://tailwindcss.com/docs/gap */
  gap: `gap-${string}`

  /** @see https://tailwindcss.com/docs/gap */
  gapX: `gap-x-${string}`

  /** @see https://tailwindcss.com/docs/gap */
  gapY: `gap-y-${string}`

  /** @see https://tailwindcss.com/docs/justify-content */
  justifyContent:
    | "justify-normal"
    | "justify-start"
    | "justify-end"
    | "justify-center"
    | "justify-between"
    | "justify-around"
    | "justify-evenly"
    | "justify-stretch"

  /** @see https://tailwindcss.com/docs/justify-items */
  justifyItems:
    | "justify-items-start"
    | "justify-items-end"
    | "justify-items-center"
    | "justify-items-stretch"
    | "justify-items-normal"

  /** @see https://tailwindcss.com/docs/justify-self */
  justifySelf:
    | "justify-self-auto"
    | "justify-self-start"
    | "justify-self-end"
    | "justify-self-center"
    | "justify-self-stretch"

  /** @see https://tailwindcss.com/docs/align-content */
  alignContent:
    | "content-normal"
    | "content-center"
    | "content-start"
    | "content-end"
    | "content-between"
    | "content-around"
    | "content-evenly"
    | "content-baseline"
    | "content-stretch"

  /** @see https://tailwindcss.com/docs/align-items */
  alignItems:
    | "items-start"
    | "items-end"
    | "items-center"
    | "items-baseline"
    | "items-stretch"

  /** @see https://tailwindcss.com/docs/align-self */
  alignSelf:
    | "self-auto"
    | "self-start"
    | "self-end"
    | "self-center"
    | "self-stretch"
    | "self-baseline"

  /** @see https://tailwindcss.com/docs/place-content */
  placeContent:
    | "place-content-center"
    | "place-content-start"
    | "place-content-end"
    | "place-content-between"
    | "place-content-around"
    | "place-content-evenly"
    | "place-content-baseline"
    | "place-content-stretch"

  /** @see https://tailwindcss.com/docs/place-items */
  placeItems:
    | "place-items-start"
    | "place-items-end"
    | "place-items-center"
    | "place-items-baseline"
    | "place-items-stretch"

  /** @see https://tailwindcss.com/docs/place-self */
  placeSelf:
    | "place-self-auto"
    | "place-self-start"
    | "place-self-end"
    | "place-self-center"
    | "place-self-stretch"

  // -------------------------------------------------------------------------
  // Spacing
  // -------------------------------------------------------------------------

  /** @see https://tailwindcss.com/docs/padding */
  padding: `p-${SpacingValue}`

  /** @see https://tailwindcss.com/docs/padding */
  paddingX: `px-${SpacingValue}`

  /** @see https://tailwindcss.com/docs/padding */
  paddingY: `py-${SpacingValue}`

  /** @see https://tailwindcss.com/docs/padding */
  paddingTop: `pt-${SpacingValue}`

  /** @see https://tailwindcss.com/docs/padding */
  paddingRight: `pr-${SpacingValue}`

  /** @see https://tailwindcss.com/docs/padding */
  paddingBottom: `pb-${SpacingValue}`

  /** @see https://tailwindcss.com/docs/padding */
  paddingLeft: `pl-${SpacingValue}`

  /** @see https://tailwindcss.com/docs/padding */
  paddingStart: `ps-${SpacingValue}`

  /** @see https://tailwindcss.com/docs/padding */
  paddingEnd: `pe-${SpacingValue}`

  /** @see https://tailwindcss.com/docs/margin */
  margin: `m-${SpacingValue}` | `-m-${SpacingValue}`

  /** @see https://tailwindcss.com/docs/margin */
  marginX: `mx-${SpacingValue}` | `-mx-${SpacingValue}`

  /** @see https://tailwindcss.com/docs/margin */
  marginY: `my-${SpacingValue}` | `-my-${SpacingValue}`

  /** @see https://tailwindcss.com/docs/margin */
  marginTop: `mt-${SpacingValue}` | `-mt-${SpacingValue}`

  /** @see https://tailwindcss.com/docs/margin */
  marginRight: `mr-${SpacingValue}` | `-mr-${SpacingValue}`

  /** @see https://tailwindcss.com/docs/margin */
  marginBottom: `mb-${SpacingValue}` | `-mb-${SpacingValue}`

  /** @see https://tailwindcss.com/docs/margin */
  marginLeft: `ml-${SpacingValue}` | `-ml-${SpacingValue}`

  /** @see https://tailwindcss.com/docs/margin */
  marginStart: `ms-${SpacingValue}` | `-ms-${SpacingValue}`

  /** @see https://tailwindcss.com/docs/margin */
  marginEnd: `me-${SpacingValue}` | `-me-${SpacingValue}`

  /** @see https://tailwindcss.com/docs/space */
  spaceX: (`space-x-${string}` & {}) | `-space-x-${string}` | "space-x-reverse"

  /** @see https://tailwindcss.com/docs/space */
  spaceY: (`space-y-${string}` & {}) | `-space-y-${string}` | "space-y-reverse"

  // -------------------------------------------------------------------------
  // Sizing
  // -------------------------------------------------------------------------

  /** @see https://tailwindcss.com/docs/width */
  width: `w-${SizeValue}`

  /** @see https://tailwindcss.com/docs/min-width */
  minWidth: `min-w-${SizeValue}`

  /** @see https://tailwindcss.com/docs/max-width */
  maxWidth: `max-w-${MaxWidthName}`

  /** @see https://tailwindcss.com/docs/height */
  height: `h-${SizeValue}`

  /** @see https://tailwindcss.com/docs/min-height */
  minHeight: `min-h-${SizeValue}`

  /** @see https://tailwindcss.com/docs/max-height */
  maxHeight: `max-h-${SizeValue}` | "max-h-none"

  /** @see https://tailwindcss.com/docs/size */
  size: `size-${SizeValue}`

  // -------------------------------------------------------------------------
  // Typography
  // -------------------------------------------------------------------------

  /** @see https://tailwindcss.com/docs/font-family */
  fontFamily:
    | "font-copernicus"
    | "font-inter"
    | "font-mono"
    | "font-sans"
    | "font-serif"
    | (`font-${string}` & {})

  /** @see https://tailwindcss.com/docs/font-size */
  fontSize:
    | "text-xs"
    | "text-sm"
    | "text-base"
    | "text-lg"
    | "text-xl"
    | "text-2xl"
    | "text-3xl"
    | "text-4xl"
    | "text-5xl"
    | "text-6xl"
    | "text-7xl"
    | "text-8xl"
    | "text-9xl"
    | (`text-${string}` & {})

  /** @see https://tailwindcss.com/docs/font-smoothing */
  fontSmoothing: "antialiased" | "subpixel-antialiased"

  /** @see https://tailwindcss.com/docs/font-style */
  fontStyle: "italic" | "not-italic"

  /** @see https://tailwindcss.com/docs/font-weight */
  fontWeight:
    | "font-thin"
    | "font-extralight"
    | "font-light"
    | "font-normal"
    | "font-medium"
    | "font-semibold"
    | "font-bold"
    | "font-extrabold"
    | "font-black"
    | (`font-${string}` & {})

  /** @see https://tailwindcss.com/docs/font-variant-numeric */
  fontVariantNumeric:
    | "normal-nums"
    | "ordinal"
    | "slashed-zero"
    | "lining-nums"
    | "oldstyle-nums"
    | "proportional-nums"
    | "tabular-nums"
    | "diagonal-fractions"
    | "stacked-fractions"

  /** @see https://tailwindcss.com/docs/letter-spacing */
  letterSpacing:
    | "tracking-tighter"
    | "tracking-tight"
    | "tracking-normal"
    | "tracking-wide"
    | "tracking-wider"
    | "tracking-widest"
    | (`tracking-${string}` & {})
    | (`-tracking-${string}` & {})

  /** @see https://tailwindcss.com/docs/line-clamp */
  lineClamp: "line-clamp-none" | (`line-clamp-${string}` & {})

  /** @see https://tailwindcss.com/docs/line-height */
  lineHeight:
    | "leading-none"
    | "leading-tight"
    | "leading-snug"
    | "leading-normal"
    | "leading-relaxed"
    | "leading-loose"
    | (`leading-${string}` & {})

  /** @see https://tailwindcss.com/docs/list-style-image */
  listStyleImage: "list-image-none" | (`list-image-${string}` & {})

  /** @see https://tailwindcss.com/docs/list-style-position */
  listStylePosition: "list-inside" | "list-outside"

  /** @see https://tailwindcss.com/docs/list-style-type */
  listStyleType:
    | "list-none"
    | "list-disc"
    | "list-decimal"
    | (`list-${string}` & {})

  /** @see https://tailwindcss.com/docs/text-align */
  textAlign:
    | "text-left"
    | "text-center"
    | "text-right"
    | "text-justify"
    | "text-start"
    | "text-end"

  /** @see https://tailwindcss.com/docs/text-color */
  color: `text-${ColorWithOpacity}`

  /** @see https://tailwindcss.com/docs/text-decoration */
  textDecoration: "underline" | "overline" | "line-through" | "no-underline"

  /** @see https://tailwindcss.com/docs/text-decoration-color */
  textDecorationColor: `decoration-${ColorWithOpacity}`

  /** @see https://tailwindcss.com/docs/text-decoration-style */
  textDecorationStyle:
    | "decoration-solid"
    | "decoration-double"
    | "decoration-dotted"
    | "decoration-dashed"
    | "decoration-wavy"

  /** @see https://tailwindcss.com/docs/text-decoration-thickness */
  textDecorationThickness:
    | "decoration-auto"
    | "decoration-from-font"
    | "decoration-0"
    | "decoration-1"
    | "decoration-2"
    | "decoration-4"
    | "decoration-8"
    | (`decoration-${string}` & {})

  /** @see https://tailwindcss.com/docs/text-underline-offset */
  textUnderlineOffset:
    | "underline-offset-auto"
    | "underline-offset-0"
    | "underline-offset-1"
    | "underline-offset-2"
    | "underline-offset-4"
    | "underline-offset-8"
    | (`underline-offset-${string}` & {})

  /** @see https://tailwindcss.com/docs/text-transform */
  textTransform: "uppercase" | "lowercase" | "capitalize" | "normal-case"

  /** @see https://tailwindcss.com/docs/text-overflow */
  textOverflow: "truncate" | "text-ellipsis" | "text-clip"

  /** @see https://tailwindcss.com/docs/text-wrap */
  textWrap: "text-wrap" | "text-nowrap" | "text-balance" | "text-pretty"

  /** @see https://tailwindcss.com/docs/text-indent */
  textIndent: `indent-${string}` | `indent-${string}`

  /** @see https://tailwindcss.com/docs/vertical-align */
  verticalAlign:
    | "align-baseline"
    | "align-top"
    | "align-middle"
    | "align-bottom"
    | "align-text-top"
    | "align-text-bottom"
    | "align-sub"
    | "align-super"
    | (`align-${string}` & {})

  /** @see https://tailwindcss.com/docs/whitespace */
  whitespace:
    | "whitespace-normal"
    | "whitespace-nowrap"
    | "whitespace-pre"
    | "whitespace-pre-line"
    | "whitespace-pre-wrap"
    | "whitespace-break-spaces"

  /** @see https://tailwindcss.com/docs/word-break */
  wordBreak: "break-normal" | "break-all" | "break-keep"

  /** @see https://tailwindcss.com/docs/overflow-wrap */
  overflowWrap: "wrap-break-word" | "wrap-anywhere" | "wrap-normal"

  /** @see https://tailwindcss.com/docs/hyphens */
  hyphens: "hyphens-none" | "hyphens-manual" | "hyphens-auto"

  /** @see https://tailwindcss.com/docs/content */
  content: "content-none" | (`content-${string}` & {})

  // -------------------------------------------------------------------------
  // Backgrounds
  // -------------------------------------------------------------------------

  /** @see https://tailwindcss.com/docs/background-attachment */
  backgroundAttachment: "bg-fixed" | "bg-local" | "bg-scroll"

  /** @see https://tailwindcss.com/docs/background-clip */
  backgroundClip:
    | "bg-clip-border"
    | "bg-clip-padding"
    | "bg-clip-content"
    | "bg-clip-text"

  /** @see https://tailwindcss.com/docs/background-color */
  backgroundColor: `bg-${ColorWithOpacity}`

  /** @see https://tailwindcss.com/docs/background-origin */
  backgroundOrigin:
    | "bg-origin-border"
    | "bg-origin-padding"
    | "bg-origin-content"

  /** @see https://tailwindcss.com/docs/background-position */
  backgroundPosition:
    | "bg-bottom"
    | "bg-center"
    | "bg-left"
    | "bg-left-bottom"
    | "bg-left-top"
    | "bg-right"
    | "bg-right-bottom"
    | "bg-right-top"
    | "bg-top"
    | (`bg-${string}` & {})

  /** @see https://tailwindcss.com/docs/background-repeat */
  backgroundRepeat:
    | "bg-repeat"
    | "bg-no-repeat"
    | "bg-repeat-x"
    | "bg-repeat-y"
    | "bg-repeat-round"
    | "bg-repeat-space"

  /** @see https://tailwindcss.com/docs/background-size */
  backgroundSize: "bg-auto" | "bg-cover" | "bg-contain" | (`bg-${string}` & {})

  /** @see https://tailwindcss.com/docs/background-image */
  backgroundImage:
    | (`bg-[${string}]` & {})
    | (`bg-(image:${string})` & {})
    | "bg-none"
    | "bg-linear-to-t"
    | "bg-linear-to-tr"
    | "bg-linear-to-r"
    | "bg-linear-to-br"
    | "bg-linear-to-b"
    | "bg-linear-to-bl"
    | "bg-linear-to-l"
    | "bg-linear-to-tl"
    | (`bg-linear-${string}` & {})

  /** @see https://tailwindcss.com/docs/gradient-color-stops */
  gradientFrom: `from-${ColorWithOpacity}`

  /** @see https://tailwindcss.com/docs/gradient-color-stops */
  gradientVia: `via-${ColorWithOpacity}`

  /** @see https://tailwindcss.com/docs/gradient-color-stops */
  gradientTo: `to-${ColorWithOpacity}`

  /** @see https://tailwindcss.com/docs/gradient-color-stops */
  gradientFromPosition: `from-${string}`

  /** @see https://tailwindcss.com/docs/gradient-color-stops */
  gradientViaPosition: `via-${string}`

  /** @see https://tailwindcss.com/docs/gradient-color-stops */
  gradientToPosition: `to-${string}`

  // -------------------------------------------------------------------------
  // Borders
  // -------------------------------------------------------------------------

  /** @see https://tailwindcss.com/docs/border-radius */
  borderRadius: "rounded" | "rounded-none" | `rounded-${BorderRadiusSize}`

  /** @see https://tailwindcss.com/docs/border-radius */
  borderRadiusStart: "rounded-s" | `rounded-s-${BorderRadiusSize}`

  /** @see https://tailwindcss.com/docs/border-radius */
  borderRadiusEnd: "rounded-e" | `rounded-e-${BorderRadiusSize}`

  /** @see https://tailwindcss.com/docs/border-radius */
  borderRadiusTop: "rounded-t" | `rounded-t-${BorderRadiusSize}`

  /** @see https://tailwindcss.com/docs/border-radius */
  borderRadiusRight: "rounded-r" | `rounded-r-${BorderRadiusSize}`

  /** @see https://tailwindcss.com/docs/border-radius */
  borderRadiusBottom: "rounded-b" | `rounded-b-${BorderRadiusSize}`

  /** @see https://tailwindcss.com/docs/border-radius */
  borderRadiusLeft: "rounded-l" | `rounded-l-${BorderRadiusSize}`

  /** @see https://tailwindcss.com/docs/border-radius */
  borderRadiusTopLeft: "rounded-tl" | `rounded-tl-${BorderRadiusSize}`

  /** @see https://tailwindcss.com/docs/border-radius */
  borderRadiusTopRight: "rounded-tr" | `rounded-tr-${BorderRadiusSize}`

  /** @see https://tailwindcss.com/docs/border-radius */
  borderRadiusBottomRight: "rounded-br" | `rounded-br-${BorderRadiusSize}`

  /** @see https://tailwindcss.com/docs/border-radius */
  borderRadiusBottomLeft: "rounded-bl" | `rounded-bl-${BorderRadiusSize}`

  /** @see https://tailwindcss.com/docs/border-radius */
  borderRadiusStartStart: "rounded-ss" | `rounded-ss-${BorderRadiusSize}`

  /** @see https://tailwindcss.com/docs/border-radius */
  borderRadiusStartEnd: "rounded-se" | `rounded-se-${BorderRadiusSize}`

  /** @see https://tailwindcss.com/docs/border-radius */
  borderRadiusEndStart: "rounded-es" | `rounded-es-${BorderRadiusSize}`

  /** @see https://tailwindcss.com/docs/border-radius */
  borderRadiusEndEnd: "rounded-ee" | `rounded-ee-${BorderRadiusSize}`

  /** @see https://tailwindcss.com/docs/border-width */
  borderWidth: "border" | `border-${string}`

  /** @see https://tailwindcss.com/docs/border-width */
  borderWidthX: "border-x" | `border-x-${string}`

  /** @see https://tailwindcss.com/docs/border-width */
  borderWidthY: "border-y" | `border-y-${string}`

  /** @see https://tailwindcss.com/docs/border-width */
  borderWidthTop: "border-t" | `border-t-${string}`

  /** @see https://tailwindcss.com/docs/border-width */
  borderWidthRight: "border-r" | `border-r-${string}`

  /** @see https://tailwindcss.com/docs/border-width */
  borderWidthBottom: "border-b" | "border-b-0" | `border-b-${string}`

  /** @see https://tailwindcss.com/docs/border-width */
  borderWidthLeft: "border-l" | `border-l-${string}`

  /** @see https://tailwindcss.com/docs/border-width */
  borderWidthStart: "border-s" | `border-s-${string}`

  /** @see https://tailwindcss.com/docs/border-width */
  borderWidthEnd: "border-e" | `border-e-${string}`

  /** @see https://tailwindcss.com/docs/border-color */
  borderColor: `border-${ColorWithOpacity}`

  /** @see https://tailwindcss.com/docs/border-style */
  borderStyle:
    | "border-solid"
    | "border-dashed"
    | "border-dotted"
    | "border-double"
    | "border-hidden"
    | "border-none"

  /** @see https://tailwindcss.com/docs/divide-width */
  divideX:
    | "divide-x"
    | "divide-x-0"
    | "divide-x-2"
    | "divide-x-4"
    | "divide-x-8"
    | (`divide-x-${string}` & {})
    | "divide-x-reverse"

  /** @see https://tailwindcss.com/docs/divide-width */
  divideY:
    | "divide-y"
    | "divide-y-0"
    | "divide-y-2"
    | "divide-y-4"
    | "divide-y-8"
    | (`divide-y-${string}` & {})
    | "divide-y-reverse"

  /** @see https://tailwindcss.com/docs/divide-color */
  divideColor: `divide-${ColorWithOpacity}`

  /** @see https://tailwindcss.com/docs/divide-style */
  divideStyle:
    | "divide-solid"
    | "divide-dashed"
    | "divide-dotted"
    | "divide-double"
    | "divide-none"

  /** @see https://tailwindcss.com/docs/outline-width */
  outlineWidth:
    | "outline-0"
    | "outline-1"
    | "outline-2"
    | "outline-4"
    | "outline-8"
    | (`outline-${string}` & {})

  /** @see https://tailwindcss.com/docs/outline-color */
  outlineColor: `outline-${ColorWithOpacity}`

  /** @see https://tailwindcss.com/docs/outline-style */
  outlineStyle:
    | "outline"
    | "outline-none"
    | "outline-dashed"
    | "outline-dotted"
    | "outline-double"

  /** @see https://tailwindcss.com/docs/outline-offset */
  outlineOffset: `outline-offset-${string}` | `-outline-offset-${string}`

  /** @see https://tailwindcss.com/docs/ring-width */
  ringWidth:
    | "ring"
    | "ring-inset"
    | "ring-0"
    | "ring-1"
    | "ring-2"
    | "ring-4"
    | "ring-8"
    | (`ring-${string}` & {})

  /** @see https://tailwindcss.com/docs/ring-color */
  ringColor: `ring-${ColorWithOpacity}`

  /** @see https://tailwindcss.com/docs/ring-offset-width */
  ringOffsetWidth:
    | "ring-offset-0"
    | "ring-offset-1"
    | "ring-offset-2"
    | "ring-offset-4"
    | "ring-offset-8"
    | (`ring-offset-${string}` & {})

  /** @see https://tailwindcss.com/docs/ring-offset-color */
  ringOffsetColor: `ring-offset-${ColorWithOpacity}`

  // -------------------------------------------------------------------------
  // Effects
  // -------------------------------------------------------------------------

  /** @see https://tailwindcss.com/docs/box-shadow */
  boxShadow:
    | "shadow"
    | "shadow-sm"
    | "shadow-md"
    | "shadow-lg"
    | "shadow-xl"
    | "shadow-2xl"
    | "shadow-inner"
    | "shadow-none"
    | (`shadow-${string}` & {})

  /** @see https://tailwindcss.com/docs/box-shadow-color */
  boxShadowColor: `shadow-${ColorWithOpacity}`

  /** @see https://tailwindcss.com/docs/opacity */
  opacity: `opacity-${string}`

  /** @see https://tailwindcss.com/docs/mix-blend-mode */
  mixBlendMode: `mix-blend-${BlendMode}`

  /** @see https://tailwindcss.com/docs/background-blend-mode */
  backgroundBlendMode: `bg-blend-${BlendMode}`

  // -------------------------------------------------------------------------
  // Filters
  // -------------------------------------------------------------------------

  /** @see https://tailwindcss.com/docs/blur */
  blur:
    | "blur"
    | "blur-none"
    | "blur-sm"
    | "blur-md"
    | "blur-lg"
    | "blur-xl"
    | "blur-2xl"
    | "blur-3xl"
    | (`blur-${string}` & {})

  /** @see https://tailwindcss.com/docs/brightness */
  brightness: `brightness-${string}`

  /** @see https://tailwindcss.com/docs/contrast */
  contrast: `contrast-${string}`

  /** @see https://tailwindcss.com/docs/drop-shadow */
  dropShadow:
    | "drop-shadow"
    | "drop-shadow-sm"
    | "drop-shadow-md"
    | "drop-shadow-lg"
    | "drop-shadow-xl"
    | "drop-shadow-2xl"
    | "drop-shadow-none"
    | (`drop-shadow-${string}` & {})

  /** @see https://tailwindcss.com/docs/grayscale */
  grayscale: "grayscale" | `grayscale-${string}`

  /** @see https://tailwindcss.com/docs/hue-rotate */
  hueRotate: `hue-rotate-${string}` | `hue-rotate-${string}`

  /** @see https://tailwindcss.com/docs/invert */
  invert: "invert" | `invert-${string}`

  /** @see https://tailwindcss.com/docs/saturate */
  saturate: `saturate-${string}`

  /** @see https://tailwindcss.com/docs/sepia */
  sepia: "sepia" | `sepia-${string}`

  /** @see https://tailwindcss.com/docs/backdrop-blur */
  backdropBlur:
    | "backdrop-blur"
    | "backdrop-blur-none"
    | "backdrop-blur-sm"
    | "backdrop-blur-md"
    | "backdrop-blur-lg"
    | "backdrop-blur-xl"
    | "backdrop-blur-2xl"
    | "backdrop-blur-3xl"
    | (`backdrop-blur-${string}` & {})

  /** @see https://tailwindcss.com/docs/backdrop-brightness */
  backdropBrightness: `backdrop-brightness-${string}`

  /** @see https://tailwindcss.com/docs/backdrop-contrast */
  backdropContrast: `backdrop-contrast-${string}`

  /** @see https://tailwindcss.com/docs/backdrop-grayscale */
  backdropGrayscale: "backdrop-grayscale" | `backdrop-grayscale-${string}`

  /** @see https://tailwindcss.com/docs/backdrop-hue-rotate */
  backdropHueRotate:
    | `backdrop-hue-rotate-${string}`
    | `-backdrop-hue-rotate-${string}`

  /** @see https://tailwindcss.com/docs/backdrop-invert */
  backdropInvert: "backdrop-invert" | `backdrop-invert-${string}`

  /** @see https://tailwindcss.com/docs/backdrop-opacity */
  backdropOpacity: `backdrop-opacity-${string}`

  /** @see https://tailwindcss.com/docs/backdrop-saturate */
  backdropSaturate: `backdrop-saturate-${string}`

  /** @see https://tailwindcss.com/docs/backdrop-sepia */
  backdropSepia: "backdrop-sepia" | `backdrop-sepia-${string}`

  // -------------------------------------------------------------------------
  // Tables
  // -------------------------------------------------------------------------

  /** @see https://tailwindcss.com/docs/border-collapse */
  borderCollapse: "border-collapse" | "border-separate"

  /** @see https://tailwindcss.com/docs/border-spacing */
  borderSpacing: `border-spacing-${string}`

  /** @see https://tailwindcss.com/docs/border-spacing */
  borderSpacingX: `border-spacing-x-${string}`

  /** @see https://tailwindcss.com/docs/border-spacing */
  borderSpacingY: `border-spacing-y-${string}`

  /** @see https://tailwindcss.com/docs/table-layout */
  tableLayout: "table-auto" | "table-fixed"

  /** @see https://tailwindcss.com/docs/caption-side */
  captionSide: "caption-top" | "caption-bottom"

  // -------------------------------------------------------------------------
  // Transitions & Animation
  // -------------------------------------------------------------------------

  /** @see https://tailwindcss.com/docs/transition-property */
  transitionProperty:
    | "transition"
    | "transition-none"
    | "transition-all"
    | "transition-colors"
    | "transition-opacity"
    | "transition-shadow"
    | "transition-transform"
    | (`transition-${string}` & {})

  /** @see https://tailwindcss.com/docs/transition-behavior */
  transitionBehavior: "transition-normal" | "transition-discrete"

  /** @see https://tailwindcss.com/docs/transition-duration */
  transitionDuration: `duration-${string}`

  /** @see https://tailwindcss.com/docs/transition-timing-function */
  transitionTimingFunction:
    | "ease-linear"
    | "ease-in"
    | "ease-out"
    | "ease-in-out"
    | (`ease-${string}` & {})

  /** @see https://tailwindcss.com/docs/transition-delay */
  transitionDelay: `delay-${string}`

  /** @see https://tailwindcss.com/docs/animation */
  animation:
    | "animate-none"
    | "animate-spin"
    | "animate-ping"
    | "animate-pulse"
    | "animate-bounce"
    | (`animate-${string}` & {})

  // -------------------------------------------------------------------------
  // Transforms
  // -------------------------------------------------------------------------

  /** @see https://tailwindcss.com/docs/backface-visibility */
  backfaceVisibility: "backface-visible" | "backface-hidden"

  /** @see https://tailwindcss.com/docs/perspective */
  perspective:
    | "perspective-dramatic"
    | "perspective-near"
    | "perspective-normal"
    | "perspective-midrange"
    | "perspective-distant"
    | "perspective-none"
    | (`perspective-${string}` & {})

  /** @see https://tailwindcss.com/docs/perspective-origin */
  perspectiveOrigin:
    | "origin-center"
    | "origin-top"
    | "origin-top-right"
    | "origin-right"
    | "origin-bottom-right"
    | "origin-bottom"
    | "origin-bottom-left"
    | "origin-left"
    | "origin-top-left"
    | (`origin-${string}` & {})

  /** @see https://tailwindcss.com/docs/rotate */
  rotate: `rotate-${string}` | `-rotate-${string}`

  /** @see https://tailwindcss.com/docs/scale */
  scale:
    | "scale-none"
    | "scale-3d"
    | (`scale-${string}` & {})
    | `-scale-${string}`
    | `scale-${"x" | "y" | "z"}-${string}`
    | `-scale-${"x" | "y" | "z"}-${string}`

  /** @see https://tailwindcss.com/docs/skew */
  skew:
    | (`skew-${string}` & {})
    | (`-skew-${string}` & {})
    | `skew-x-${string}`
    | `-skew-x-${string}`
    | `skew-y-${string}`
    | `-skew-y-${string}`

  /** @see https://tailwindcss.com/docs/transform */
  transform:
    | "transform-none"
    | "transform-gpu"
    | "transform-cpu"
    | (`transform-${string}` & {})

  /** @see https://tailwindcss.com/docs/transform-origin */
  transformOrigin:
    | "origin-center"
    | "origin-top"
    | "origin-top-right"
    | "origin-right"
    | "origin-bottom-right"
    | "origin-bottom"
    | "origin-bottom-left"
    | "origin-left"
    | "origin-top-left"
    | (`origin-${string}` & {})

  /** @see https://tailwindcss.com/docs/transform-style */
  transformStyle: "transform-3d" | "transform-flat"

  /** @see https://tailwindcss.com/docs/translate */
  translate:
    | `translate-${"x" | "y" | "z"}-${"full" | "px" | SpacingValue}`
    | `-translate-${"x" | "y" | "z"}-${"full" | "px" | SpacingValue}`

  // -------------------------------------------------------------------------
  // Interactivity
  // -------------------------------------------------------------------------

  /** @see https://tailwindcss.com/docs/accent-color */
  accentColor: `accent-${ColorWithOpacity}` | "accent-auto"

  /** @see https://tailwindcss.com/docs/appearance */
  appearance: "appearance-none" | "appearance-auto"

  /** @see https://tailwindcss.com/docs/cursor */
  cursor:
    | "cursor-auto"
    | "cursor-default"
    | "cursor-pointer"
    | "cursor-wait"
    | "cursor-text"
    | "cursor-move"
    | "cursor-help"
    | "cursor-not-allowed"
    | "cursor-none"
    | "cursor-context-menu"
    | "cursor-progress"
    | "cursor-cell"
    | "cursor-crosshair"
    | "cursor-vertical-text"
    | "cursor-alias"
    | "cursor-copy"
    | "cursor-no-drop"
    | "cursor-grab"
    | "cursor-grabbing"
    | "cursor-all-scroll"
    | "cursor-col-resize"
    | "cursor-row-resize"
    | "cursor-n-resize"
    | "cursor-e-resize"
    | "cursor-s-resize"
    | "cursor-w-resize"
    | "cursor-ne-resize"
    | "cursor-nw-resize"
    | "cursor-se-resize"
    | "cursor-sw-resize"
    | "cursor-ew-resize"
    | "cursor-ns-resize"
    | "cursor-nesw-resize"
    | "cursor-nwse-resize"
    | "cursor-zoom-in"
    | "cursor-zoom-out"
    | (`cursor-${string}` & {})

  /** @see https://tailwindcss.com/docs/caret-color */
  caretColor: `caret-${ColorWithOpacity}`

  /** @see https://tailwindcss.com/docs/pointer-events */
  pointerEvents: "pointer-events-none" | "pointer-events-auto"

  /** @see https://tailwindcss.com/docs/resize */
  resize: "resize" | "resize-none" | "resize-y" | "resize-x"

  /** @see https://tailwindcss.com/docs/scroll-behavior */
  scrollBehavior: "scroll-auto" | "scroll-smooth"

  /** @see https://tailwindcss.com/docs/scroll-margin */
  scrollMargin: `scroll-m-${string}` | `-scroll-m-${string}`

  /** @see https://tailwindcss.com/docs/scroll-margin */
  scrollMarginX: `scroll-mx-${string}` | `-scroll-mx-${string}`

  /** @see https://tailwindcss.com/docs/scroll-margin */
  scrollMarginY: `scroll-my-${string}` | `-scroll-my-${string}`

  /** @see https://tailwindcss.com/docs/scroll-margin */
  scrollMarginTop: `scroll-mt-${string}` | `-scroll-mt-${string}`

  /** @see https://tailwindcss.com/docs/scroll-margin */
  scrollMarginRight: `scroll-mr-${string}` | `-scroll-mr-${string}`

  /** @see https://tailwindcss.com/docs/scroll-margin */
  scrollMarginBottom: `scroll-mb-${string}` | `-scroll-mb-${string}`

  /** @see https://tailwindcss.com/docs/scroll-margin */
  scrollMarginLeft: `scroll-ml-${string}` | `-scroll-ml-${string}`

  /** @see https://tailwindcss.com/docs/scroll-margin */
  scrollMarginStart: `scroll-ms-${string}` | `-scroll-ms-${string}`

  /** @see https://tailwindcss.com/docs/scroll-margin */
  scrollMarginEnd: `scroll-me-${string}` | `-scroll-me-${string}`

  /** @see https://tailwindcss.com/docs/scroll-padding */
  scrollPadding: `scroll-p-${string}`

  /** @see https://tailwindcss.com/docs/scroll-padding */
  scrollPaddingX: `scroll-px-${string}`

  /** @see https://tailwindcss.com/docs/scroll-padding */
  scrollPaddingY: `scroll-py-${string}`

  /** @see https://tailwindcss.com/docs/scroll-padding */
  scrollPaddingTop: `scroll-pt-${string}`

  /** @see https://tailwindcss.com/docs/scroll-padding */
  scrollPaddingRight: `scroll-pr-${string}`

  /** @see https://tailwindcss.com/docs/scroll-padding */
  scrollPaddingBottom: `scroll-pb-${string}`

  /** @see https://tailwindcss.com/docs/scroll-padding */
  scrollPaddingLeft: `scroll-pl-${string}`

  /** @see https://tailwindcss.com/docs/scroll-padding */
  scrollPaddingStart: `scroll-ps-${string}`

  /** @see https://tailwindcss.com/docs/scroll-padding */
  scrollPaddingEnd: `scroll-pe-${string}`

  /** @see https://tailwindcss.com/docs/scroll-snap-align */
  scrollSnapAlign: "snap-start" | "snap-end" | "snap-center" | "snap-align-none"

  /** @see https://tailwindcss.com/docs/scroll-snap-stop */
  scrollSnapStop: "snap-normal" | "snap-always"

  /** @see https://tailwindcss.com/docs/scroll-snap-type */
  scrollSnapType:
    | "snap-none"
    | "snap-x"
    | "snap-y"
    | "snap-both"
    | "snap-mandatory"
    | "snap-proximity"

  /** @see https://tailwindcss.com/docs/touch-action */
  touchAction:
    | "touch-auto"
    | "touch-none"
    | "touch-pan-x"
    | "touch-pan-left"
    | "touch-pan-right"
    | "touch-pan-y"
    | "touch-pan-up"
    | "touch-pan-down"
    | "touch-pinch-zoom"
    | "touch-manipulation"

  /** @see https://tailwindcss.com/docs/user-select */
  userSelect: "select-none" | "select-text" | "select-all" | "select-auto"

  /** @see https://tailwindcss.com/docs/will-change */
  willChange:
    | "will-change-auto"
    | "will-change-scroll"
    | "will-change-contents"
    | "will-change-transform"
    | (`will-change-${string}` & {})

  // -------------------------------------------------------------------------
  // SVG
  // -------------------------------------------------------------------------

  /** @see https://tailwindcss.com/docs/fill */
  fill: `fill-${ColorWithOpacity}` | "fill-none"

  /** @see https://tailwindcss.com/docs/stroke */
  stroke: `stroke-${ColorWithOpacity}` | "stroke-none"

  /** @see https://tailwindcss.com/docs/stroke-width */
  strokeWidth: `stroke-${string}`

  // -------------------------------------------------------------------------
  // Accessibility
  // -------------------------------------------------------------------------

  /** @see https://tailwindcss.com/docs/screen-readers */
  screenReaders: "sr-only" | "not-sr-only"

  /** @see https://tailwindcss.com/docs/forced-color-adjust */
  forcedColorAdjust: "forced-color-adjust-auto" | "forced-color-adjust-none"
}
