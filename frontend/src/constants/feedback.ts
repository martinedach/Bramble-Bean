export const FEEDBACK_HIGHLIGHTS = [
  'Food',
  'Coffee',
  'Service',
  'Atmosphere',
] as const

export type FeedbackHighlight = (typeof FEEDBACK_HIGHLIGHTS)[number]

export const RATING_OPTIONS = [1, 2, 3, 4, 5] as const
