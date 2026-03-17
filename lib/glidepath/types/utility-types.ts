/**
 * Blend mode values shared between mix-blend and bg-blend
 */
export type BlendMode =
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "darken"
  | "lighten"
  | "color-dodge"
  | "color-burn"
  | "hard-light"
  | "soft-light"
  | "difference"
  | "exclusion"
  | "hue"
  | "saturation"
  | "color"
  | "luminosity"
  | "plus-lighter"

/**
 * Border radius named sizes
 */
export type BorderRadiusSize =
  | "none"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "full"
  | (string & {})

/**
 * Tailwind color with optional opacity modifier, e.g. red-500, red-500/50, [#ff0000]
 */
export type Color =
  | "inherit"
  | "current"
  | "transparent"
  | "black"
  | "white"
  | "primary-brand-light"
  | "primary-brand-lowlight"
  | "primary-brand-ultralight"
  | "primary-brand-dark"
  | "primary-brand-dark-overlay"
  | "primary-brand-yellow"
  | "primary-brand-yellow-hover"
  | "primary-brand-error"
  | "primary-brand-blue"
  | "primary-brand-coral"
  | "primary-brand-green"
  | "primary-brand-orange"
  | "primary-brand-peach"
  | "primary-brand-pink"
  | "primary-brand-purple"
  | (string & {})

/**
 * Color with optional opacity modifier
 */
export type ColorWithOpacity = Color | `${Color}/${string}`

/**
 * Named max-width sizes
 */
export type MaxWidthName =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "full"
  | "min"
  | "max"
  | "fit"
  | "prose"
  | "screen-sm"
  | "screen-md"
  | "screen-lg"
  | "screen-xl"
  | "screen-2xl"
  | (string & {})

/**
 * Common sizing scale values (used by width, height, size, etc.)
 */
export type SizeValue =
  | "px"
  | "full"
  | "auto"
  | "min"
  | "max"
  | "fit"
  | "screen"
  | "svw"
  | "svh"
  | "lvw"
  | "lvh"
  | "dvw"
  | "dvh"
  | (string & {})

/**
 * Common spacing scale values (used by padding, margin, gap, inset, translate, etc.)
 */
export type SpacingValue = "px" | "full" | "auto" | (string & {})
