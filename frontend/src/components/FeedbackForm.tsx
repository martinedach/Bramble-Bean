import { useState, type FormEvent } from 'react'

import { type FeedbackHighlight } from '../constants/feedback'
import { ApiError, parseFastApiFieldErrors, submitFeedback } from '../lib/api'
import { validateFeedbackForm, type FeedbackFieldErrors } from '../lib/validation'
import { HighlightPicker } from './HighlightPicker'
import { StarRating } from './StarRating'

const inputClass =
  'w-full rounded-pinterest-input border border-warm-silver/70 bg-canvas px-[14px] py-[10px] text-[15px] text-plum placeholder:text-warm-silver outline-none transition ' +
  'focus-visible:border-plum focus-visible:ring-2 focus-visible:ring-focus-blue focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ' +
  'disabled:cursor-not-allowed disabled:opacity-60'

const labelClass = 'mb-1 block text-[11px] font-semibold uppercase tracking-wide text-olive'

const errorClass = 'mt-1 text-[11px] font-medium text-error-red'

function RequiredAsterisk() {
  return (
    <span aria-hidden="true" className="ml-1 text-pinterest-red">
      *
    </span>
  )
}

export function FeedbackForm() {
  const [email, setEmail] = useState('')
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState<number | null>(null)
  const [highlight, setHighlight] = useState<FeedbackHighlight | ''>('')
  const [fieldErrors, setFieldErrors] = useState<FeedbackFieldErrors>({})
  const [serverMessage, setServerMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const resetForm = () => {
    setEmail('')
    setComment('')
    setRating(null)
    setHighlight('')
    setFieldErrors({})
    setServerMessage(null)
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setServerMessage(null)
    const values = { email, comment, rating, highlight }
    const clientErrors = validateFeedbackForm(values)
    if (clientErrors) {
      setFieldErrors(clientErrors)
      return
    }
    setFieldErrors({})
    setSubmitting(true)
    try {
      await submitFeedback({
        email: email.trim(),
        comment: comment.trim(),
        rating: rating!,
        highlight: highlight as string,
      })
      setSubmitted(true)
      resetForm()
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) {
        setFieldErrors(parseFastApiFieldErrors(err.body))
        setServerMessage('Please fix the fields below.')
      } else {
        setServerMessage('Something went wrong. Try again in a moment.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="rounded-pinterest-feature border border-warm-silver/40 bg-canvas p-6 text-center shadow-[0_24px_60px_-30px_rgba(33,25,34,0.25)]"
      >
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-warm-wash text-green-700">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-7">
            <path
              d="M5 12.5l4 4 10-10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="mt-4 text-[22px] font-bold tracking-[-0.5px]">Thank you for the visit</h2>
        <p className="mt-2 text-[14px] text-olive">
          Your feedback was saved. We will share it with the team.
        </p>
        <button
          type="button"
          className="mt-6 rounded-pinterest-input bg-sand-gray px-5 py-[10px] text-[13px] font-semibold text-ink hover:bg-warm-light"
          onClick={() => setSubmitted(false)}
        >
          Leave another review
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-pinterest-feature border border-warm-silver/40 bg-canvas p-5 shadow-[0_24px_60px_-30px_rgba(33,25,34,0.25)] sm:p-6"
    >
      {serverMessage ? (
        <div
          role="alert"
          className="mb-4 rounded-pinterest-card border border-error-red/30 bg-error-red/5 px-4 py-2 text-[12px] text-error-red"
        >
          {serverMessage}
        </div>
      ) : null}

      <div className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="feedback-email">
            Email
            <RequiredAsterisk />
          </label>
          <input
            id="feedback-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? 'feedback-email-error' : undefined}
            disabled={submitting}
          />
          {fieldErrors.email ? (
            <p id="feedback-email-error" className={errorClass}>
              {fieldErrors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="feedback-comment">
            Tell us about your visit
            <RequiredAsterisk />
          </label>
          <textarea
            id="feedback-comment"
            name="comment"
            rows={3}
            placeholder="The flat white was just right and the back room felt cosy on a rainy afternoon..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={`${inputClass} min-h-[96px] resize-y leading-[1.45]`}
            aria-invalid={Boolean(fieldErrors.comment)}
            aria-describedby={fieldErrors.comment ? 'feedback-comment-error' : undefined}
            disabled={submitting}
          />
          {fieldErrors.comment ? (
            <p id="feedback-comment-error" className={errorClass}>
              {fieldErrors.comment}
            </p>
          ) : null}
        </div>

        <div>
          <span className={labelClass}>
            Overall rating
            <RequiredAsterisk />
          </span>
          <StarRating
            value={rating}
            onChange={setRating}
            disabled={submitting}
            invalid={Boolean(fieldErrors.rating)}
            describedBy={fieldErrors.rating ? 'feedback-rating-error' : undefined}
          />
          {fieldErrors.rating ? (
            <p id="feedback-rating-error" className={errorClass}>
              {fieldErrors.rating}
            </p>
          ) : null}
        </div>

        <div>
          <span className={labelClass}>
            What did you enjoy most?
            <RequiredAsterisk />
          </span>
          <HighlightPicker
            value={highlight}
            onChange={setHighlight}
            disabled={submitting}
            invalid={Boolean(fieldErrors.highlight)}
            describedBy={fieldErrors.highlight ? 'feedback-highlight-error' : undefined}
          />
          {fieldErrors.highlight ? (
            <p id="feedback-highlight-error" className={errorClass}>
              {fieldErrors.highlight}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-6 flex flex-col items-stretch gap-2 border-t border-warm-silver/30 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] text-olive">
          Submissions stay anonymous to other customers.
        </p>
        <button
          type="submit"
          className={
            'inline-flex items-center justify-center gap-2 rounded-pinterest-input bg-pinterest-red px-5 py-[10px] text-[12px] font-semibold text-canvas transition ' +
            'hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-blue focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ' +
            'disabled:cursor-not-allowed disabled:opacity-70'
          }
          disabled={submitting}
        >
          {submitting ? (
            <>
              <span
                aria-hidden="true"
                className="size-3 animate-spin rounded-full border-2 border-canvas/40 border-t-canvas"
              />
              Sending
            </>
          ) : (
            <>
              Submit feedback
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-4">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  )
}
