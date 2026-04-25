import { type ReactNode } from 'react'

import { FEEDBACK_HIGHLIGHTS, type FeedbackHighlight } from '../constants/feedback'

type HighlightPickerProps = {
  value: FeedbackHighlight | ''
  onChange: (value: FeedbackHighlight) => void
  disabled?: boolean
  invalid?: boolean
  describedBy?: string
}

const ICONS: Record<FeedbackHighlight, ReactNode> = {
  Food: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-5">
      <path
        d="M5 4v8a3 3 0 003 3v5M8 4v5M11 4v5M5 9h6M16 4c2.5 0 4 1.7 4 5s-1.5 5-4 5v6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Coffee: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-5">
      <path
        d="M4 9h12v6a4 4 0 01-4 4H8a4 4 0 01-4-4V9zM16 11h2a3 3 0 010 6h-2M8 4c0 1 1 1 1 2s-1 1-1 2M12 4c0 1 1 1 1 2s-1 1-1 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Service: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-5">
      <path
        d="M12 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM4.5 20a7.5 7.5 0 0115 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Atmosphere: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-5">
      <path
        d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4M12 7a5 5 0 100 10 5 5 0 000-10z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
}

export function HighlightPicker({
  value,
  onChange,
  disabled,
  invalid,
  describedBy,
}: HighlightPickerProps) {
  return (
    <div
      role="radiogroup"
      aria-label="What did you enjoy most"
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      className="grid grid-cols-2 gap-2 sm:grid-cols-4"
    >
      {FEEDBACK_HIGHLIGHTS.map((option) => {
        const selected = value === option
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(option)}
            className={
              'group flex flex-col items-center justify-center gap-2 rounded-pinterest-feature border px-3 py-4 text-[13px] font-semibold transition ' +
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-blue focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ' +
              'disabled:cursor-not-allowed disabled:opacity-60 ' +
              (selected
                ? 'border-plum bg-plum text-canvas shadow-[0_8px_24px_-12px_rgba(33,25,34,0.4)]'
                : 'border-warm-silver/60 bg-fog text-plum hover:border-plum/40 hover:bg-warm-wash')
            }
          >
            <span
              className={
                'grid size-9 place-items-center rounded-full transition ' +
                (selected
                  ? 'bg-pinterest-red text-canvas'
                  : 'bg-warm-light text-plum group-hover:bg-canvas')
              }
            >
              {ICONS[option]}
            </span>
            {option}
          </button>
        )
      })}
    </div>
  )
}
