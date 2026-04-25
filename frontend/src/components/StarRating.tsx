import { useState, type KeyboardEvent } from 'react'

import { RATING_OPTIONS } from '../constants/feedback'

type StarRatingProps = {
  value: number | null
  onChange: (value: number) => void
  disabled?: boolean
  invalid?: boolean
  describedBy?: string
}

const RATING_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Great',
  5: 'Excellent',
}

export function StarRating({
  value,
  onChange,
  disabled,
  invalid,
  describedBy,
}: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null)
  const active = hover ?? value ?? 0
  const focusValue = value ?? 1

  const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      onChange(Math.min(5, focusValue + 1))
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      onChange(Math.max(1, focusValue - 1))
    } else if (e.key >= '1' && e.key <= '5') {
      e.preventDefault()
      onChange(Number(e.key))
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        role="radiogroup"
        aria-label="Overall rating from 1 to 5 stars"
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKey}
        onMouseLeave={() => setHover(null)}
        className={
          'inline-flex w-fit items-center gap-1 rounded-pinterest-input bg-fog px-3 py-2 ' +
          'outline-none transition focus-visible:ring-2 focus-visible:ring-focus-blue focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ' +
          (disabled ? 'cursor-not-allowed opacity-60' : '')
        }
      >
        {RATING_OPTIONS.map((n) => {
          const isFilled = n <= active
          const isSelected = value === n
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${n} star${n === 1 ? '' : 's'} — ${RATING_LABELS[n]}`}
              tabIndex={-1}
              disabled={disabled}
              onMouseEnter={() => setHover(n)}
              onFocus={() => setHover(n)}
              onClick={() => onChange(n)}
              className="group relative grid size-9 place-items-center rounded-full transition hover:bg-warm-light/60 disabled:cursor-not-allowed"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className={
                  'size-7 transition ' +
                  (isFilled
                    ? 'fill-pinterest-red text-pinterest-red'
                    : 'fill-transparent text-warm-silver')
                }
              >
                <path
                  d="M12 2.6l2.95 5.98 6.6.96-4.78 4.66 1.13 6.57L12 17.77l-5.9 3.1 1.13-6.57L2.45 9.54l6.6-.96L12 2.6z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )
        })}
      </div>
      <p className="min-h-[1.25rem] text-[13px] text-olive">
        {active > 0 ? `${active} of 5 — ${RATING_LABELS[active]}` : 'Tap to rate your visit'}
      </p>
    </div>
  )
}
