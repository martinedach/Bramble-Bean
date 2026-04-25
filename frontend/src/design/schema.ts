/**
 * Pinterest-inspired design tokens (light canvas).
 * Source: awesome-design-md `design-md/pinterest/DESIGN.md` (public Pinterest study).
 * Use Tailwind theme classes where possible; use this module for TS-driven styles or tests.
 */

export const pinterestColors = {
  pinterestRed: '#e60023',
  green700: '#103c25',
  green700Hover: '#0b2819',
  plumBlack: '#211922',
  black: '#000000',
  oliveGray: '#62625b',
  warmSilver: '#91918c',
  white: '#ffffff',
  focusBlue: '#435ee5',
  performancePurple: '#6845ab',
  recommendationPurple: '#7e238b',
  linkBlue: '#2b48d4',
  facebookBlue: '#0866ff',
  pressedBlue: '#617bff',
  sandGray: '#e5e5e0',
  warmLight: '#e0e0d9',
  warmWash: 'hsla(60, 20%, 98%, 0.5)',
  fog: '#f6f6f3',
  borderDisabled: '#c8c8c1',
  hoverGray: '#bcbcb3',
  darkSurface: '#33332e',
  errorRed: '#9e0a0a',
} as const

export const pinterestRadiiPx = {
  cardSm: 12,
  button: 16,
  cardMd: 20,
  cardLg: 28,
  panel: 32,
  hero: 40,
} as const

/** 8px-based scale from DESIGN.md (subset used in UI). */
export const pinterestSpacingPx = {
  1: 4,
  2: 6,
  3: 8,
  4: 10,
  5: 11,
  6: 12,
  7: 16,
  8: 18,
  9: 20,
  10: 24,
  11: 32,
  12: 80,
  13: 100,
} as const

/** Pin Sans stack: proprietary face replaced with system UI stack per DESIGN.md. */
export const pinterestFontStack =
  '-apple-system, system-ui, "Segoe UI", Roboto, Oxygen-Sans, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, "Hiragino Kaku Gothic ProN", Meiryo, sans-serif'

export const pinterestTypography = {
  displayHeroPx: 70,
  sectionHeadingPx: 28,
  bodyPx: 16,
  captionBoldPx: 14,
  captionPx: 12,
  buttonPx: 12,
} as const

export const pinterestBreakpointsPx = {
  mobile: 576,
  mobileLg: 768,
  tablet: 890,
  desktopSm: 1312,
  desktop: 1440,
  desktopLg: 1680,
} as const

export const designSchema = {
  name: 'pinterest-inspired',
  colors: pinterestColors,
  radiiPx: pinterestRadiiPx,
  spacingPx: pinterestSpacingPx,
  fontStack: pinterestFontStack,
  typographyPx: pinterestTypography,
  breakpointsPx: pinterestBreakpointsPx,
} as const

export type DesignSchema = typeof designSchema
