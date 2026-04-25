import { useEffect, useMemo, useState } from 'react'

import { ApiError, type FeedbackResponseBody, fetchFeedback } from '../lib/api'

function formatCreatedAt(value: string): string {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d)
}

function ratingLabel(n: number): string {
  return `${n}/5`
}

function renderStars(rating: number) {
  return '★'.repeat(Math.max(0, Math.min(5, rating))) + '☆'.repeat(5 - rating)
}

export function AdminReviewsPanel() {
  const pageSize = 20
  const [items, setItems] = useState<FeedbackResponseBody[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshTick, setRefreshTick] = useState(0)
  const [offset, setOffset] = useState(0)
  const [hasNextPage, setHasNextPage] = useState(false)

  useEffect(() => {
    let active = true
    fetchFeedback({ limit: pageSize, offset })
      .then((rows) => {
        if (!active) return
        setItems(rows)
        setHasNextPage(rows.length === pageSize)
      })
      .catch((err: unknown) => {
        if (!active) return
        if (err instanceof ApiError) {
          setError(`Could not load reviews (${err.status}).`)
        } else {
          setError('Could not load reviews right now.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [offset, refreshTick])

  const total = items.length
  const averageRating = useMemo(() => {
    if (items.length === 0) return null
    const sum = items.reduce((acc, row) => acc + row.rating, 0)
    return (sum / items.length).toFixed(2)
  }, [items])
  const highlightCounts = useMemo(() => {
    const out = new Map<string, number>()
    for (const item of items) {
      out.set(item.highlight, (out.get(item.highlight) ?? 0) + 1)
    }
    return [...out.entries()].sort((a, b) => b[1] - a[1])
  }, [items])
  const topHighlight = highlightCounts[0]?.[0] ?? 'No data'

  return (
    <section className="rounded-pinterest-feature border border-warm-silver/40 bg-canvas p-5 shadow-[0_24px_60px_-30px_rgba(33,25,34,0.25)] sm:p-6">
      <div className="mb-5 rounded-pinterest-card border border-warm-silver/30 bg-gradient-to-br from-canvas via-fog to-warm-wash p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-olive">
              Admin dashboard
            </p>
            <h2 className="mt-1 text-[22px] font-semibold tracking-[-0.5px] text-plum">
              Customer reviews
            </h2>
            <p className="mt-1 text-[12px] text-olive">
              Latest submissions with quick quality signals for the team.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setError(null)
              setLoading(true)
              setOffset(0)
              setRefreshTick((x) => x + 1)
            }}
            className="rounded-pinterest-input border border-warm-silver/60 bg-canvas px-4 py-2 text-[12px] font-semibold text-plum hover:bg-warm-wash"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-pinterest-card border border-warm-silver/40 bg-fog px-4 py-3">
          <p className="text-[11px] uppercase tracking-wide text-olive">Loaded reviews</p>
          <p className="mt-1 text-[22px] font-semibold text-plum">{total}</p>
        </div>
        <div className="rounded-pinterest-card border border-warm-silver/40 bg-fog px-4 py-3">
          <p className="text-[11px] uppercase tracking-wide text-olive">Average rating</p>
          <p className="mt-1 text-[22px] font-semibold text-plum">
            {averageRating ?? 'No data'}
          </p>
        </div>
        <div className="rounded-pinterest-card border border-warm-silver/40 bg-fog px-4 py-3">
          <p className="text-[11px] uppercase tracking-wide text-olive">Top highlight</p>
          <p className="mt-1 text-[16px] font-semibold text-plum">{topHighlight}</p>
        </div>
      </div>

      {highlightCounts.length > 0 ? (
        <div className="mb-5 flex flex-wrap gap-2">
          {highlightCounts.map(([name, count]) => (
            <span
              key={name}
              className="inline-flex items-center gap-2 rounded-full border border-warm-silver/50 bg-warm-wash px-3 py-1 text-[11px] text-olive"
            >
              <span className="font-semibold text-plum">{name}</span>
              <span>{count}</span>
            </span>
          ))}
        </div>
      ) : null}

      <div className="mb-4 flex items-center justify-between border-b border-warm-silver/30 pb-3">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-olive">
            Submission feed
          </p>
        </div>
        <p className="text-[12px] text-olive">Newest first</p>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[12px] text-olive">
          Showing {items.length === 0 ? 0 : offset + 1}-
          {offset + items.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setError(null)
              setLoading(true)
              setOffset((current) => Math.max(0, current - pageSize))
            }}
            disabled={loading || offset === 0}
            className="rounded-pinterest-input border border-warm-silver/60 bg-canvas px-3 py-1.5 text-[12px] font-semibold text-plum hover:bg-warm-wash disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => {
              setError(null)
              setLoading(true)
              setOffset((current) => current + pageSize)
            }}
            disabled={loading || !hasNextPage}
            className="rounded-pinterest-input border border-warm-silver/60 bg-canvas px-3 py-1.5 text-[12px] font-semibold text-plum hover:bg-warm-wash disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {error ? (
        <p className="mb-4 rounded-pinterest-card border border-error-red/30 bg-error-red/5 px-4 py-2 text-[12px] text-error-red">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-[13px] text-olive">Loading submissions...</p>
      ) : items.length === 0 ? (
        <p className="text-[13px] text-olive">No reviews yet.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-pinterest-card border border-warm-silver/40 bg-canvas px-4 py-3 transition hover:border-warm-silver/70 hover:bg-fog/30"
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p className="text-[13px] font-semibold text-plum">{item.email}</p>
                <p className="text-[11px] text-olive">{formatCreatedAt(item.created_at)}</p>
              </div>
              <p className="mb-3 text-[13px] leading-[1.55] text-plum">{item.comment}</p>
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span className="rounded-full bg-plum px-2.5 py-1 font-semibold text-canvas">
                  {renderStars(item.rating)} {ratingLabel(item.rating)}
                </span>
                <span className="rounded-full bg-warm-wash px-2.5 py-1 text-olive">
                  Highlight: {item.highlight}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
