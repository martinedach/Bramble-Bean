import { useState, type FormEvent } from 'react'

import {
  FEEDBACK_HIGHLIGHTS,
  RATING_OPTIONS,
  type FeedbackHighlight,
} from '../constants/feedback'
import { ApiError, parseFastApiFieldErrors, submitFeedback } from '../lib/api'
import { validateFeedbackForm, type FeedbackFieldErrors } from '../lib/validation'

const inputClass =
  'w-full rounded-pinterest-input border border-warm-silver bg-canvas px-[15px] py-[11px] text-base text-plum shadow-none outline-none transition ' +
  'focus-visible:ring-2 focus-visible:ring-focus-blue focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ' +
  'disabled:cursor-not-allowed disabled:opacity-60'

const labelClass = 'mb-1 block text-[12px] font-semibold text-olive'

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
    const values = {
      email,
      comment,
      rating,
      highlight,
    }
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
        className="rounded-pinterest-card border border-warm-silver/60 bg-warm-wash p-6 text-center"
        role="status"
      >
        <p className="text-base font-semibold text-green-700">Thanks — your feedback was saved.</p>
        <button
          type="button"
          className="mt-4 rounded-pinterest-input bg-sand-gray px-[14px] py-[6px] text-[12px] font-normal text-ink"
          onClick={() => setSubmitted(false)}
        >
          Leave another review
        </button>
      </div>
    )
  }

  return (
    <form className="space-y-6" onSubmit={onSubmit} noValidate>
      {serverMessage ? (
        <p className="text-sm text-error-red" role="alert">
          {serverMessage}
        </p>
      ) : null}

      <div>
        <label className={labelClass} htmlFor="feedback-email">
          Email
        </label>
        <input
          id="feedback-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? 'feedback-email-error' : undefined}
          disabled={submitting}
        />
        {fieldErrors.email ? (
          <p id="feedback-email-error" className="mt-1 text-[12px] text-error-red">
            {fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="feedback-comment">
          Your feedback
        </label>
        <textarea
          id="feedback-comment"
          name="comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className={`${inputClass} min-h-[120px] resize-y`}
          aria-invalid={Boolean(fieldErrors.comment)}
          aria-describedby={fieldErrors.comment ? 'feedback-comment-error' : undefined}
          disabled={submitting}
        />
        {fieldErrors.comment ? (
          <p id="feedback-comment-error" className="mt-1 text-[12px] text-error-red">
            {fieldErrors.comment}
          </p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="feedback-rating">
          Overall rating
        </label>
        <select
          id="feedback-rating"
          name="rating"
          value={rating === null ? '' : String(rating)}
          onChange={(e) => {
            const v = e.target.value
            setRating(v === '' ? null : Number(v))
          }}
          className={inputClass}
          aria-invalid={Boolean(fieldErrors.rating)}
          aria-describedby={fieldErrors.rating ? 'feedback-rating-error' : undefined}
          disabled={submitting}
        >
          <option value="">Select 1–5</option>
          {RATING_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        {fieldErrors.rating ? (
          <p id="feedback-rating-error" className="mt-1 text-[12px] text-error-red">
            {fieldErrors.rating}
          </p>
        ) : null}
      </div>

      <fieldset className="space-y-2 border-0 p-0">
        <legend className={`${labelClass} mb-2`}>What did you enjoy most?</legend>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {FEEDBACK_HIGHLIGHTS.map((option) => (
            <label
              key={option}
              className="inline-flex cursor-pointer items-center gap-2 rounded-pinterest-input border border-warm-silver/70 bg-fog px-3 py-2 text-[14px] text-plum has-[:checked]:border-plum has-[:checked]:bg-warm-wash"
            >
              <input
                type="radio"
                name="highlight"
                value={option}
                checked={highlight === option}
                onChange={() => setHighlight(option)}
                disabled={submitting}
                className="size-4 accent-pinterest-red"
              />
              {option}
            </label>
          ))}
        </div>
        {fieldErrors.highlight ? (
          <p className="text-[12px] text-error-red" role="alert">
            {fieldErrors.highlight}
          </p>
        ) : null}
      </fieldset>

      <button
        type="submit"
        className="rounded-pinterest-input bg-pinterest-red px-[14px] py-[10px] text-[12px] font-semibold text-ink disabled:opacity-60"
        disabled={submitting}
      >
        {submitting ? 'Sending…' : 'Submit feedback'}
      </button>
    </form>
  )
}
