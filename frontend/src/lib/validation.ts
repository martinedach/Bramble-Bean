import type { FeedbackHighlight } from '../constants/feedback'
import { FEEDBACK_HIGHLIGHTS } from '../constants/feedback'

/** Same pattern as the backend `schemas.py` email check (assessment brief). */
export const EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export type FeedbackFieldKey = 'email' | 'comment' | 'rating' | 'highlight'

export type FeedbackFieldErrors = Partial<Record<FeedbackFieldKey, string>>

export type FeedbackFormValues = {
  email: string
  comment: string
  rating: number | null
  highlight: FeedbackHighlight | ''
}

export function validateFeedbackForm(
  values: FeedbackFormValues,
): FeedbackFieldErrors | null {
  const errors: FeedbackFieldErrors = {}
  const email = values.email.trim()
  if (!email) {
    errors.email = 'Email is required.'
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Enter a valid email address.'
  }

  const comment = values.comment.trim()
  if (!comment) {
    errors.comment = 'Please share a short comment.'
  }

  if (values.rating === null) {
    errors.rating = 'Choose a rating from 1 to 5.'
  } else if (values.rating < 1 || values.rating > 5) {
    errors.rating = 'Rating must be between 1 and 5.'
  }

  if (!values.highlight) {
    errors.highlight = 'Pick what you enjoyed most.'
  } else if (!FEEDBACK_HIGHLIGHTS.includes(values.highlight)) {
    errors.highlight = 'Choose one of the four options.'
  }

  return Object.keys(errors).length > 0 ? errors : null
}
