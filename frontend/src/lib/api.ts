import type { FeedbackFieldErrors, FeedbackFieldKey } from './validation'

export type FeedbackPayload = {
  email: string
  comment: string
  rating: number
  highlight: string
}

export type FeedbackResponseBody = {
  id: number
  email: string
  comment: string
  rating: number
  highlight: string
  created_at: string
}

export class ApiError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(status: number, body: unknown) {
    super(`Request failed (${status})`)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

function apiBase(): string {
  const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? ''
  return base
}

export async function submitFeedback(
  payload: FeedbackPayload,
): Promise<FeedbackResponseBody> {
  const base = apiBase()
  const res = await fetch(`${base}/api/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const text = await res.text()
  let data: unknown
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = { raw: text }
  }

  if (!res.ok) {
    throw new ApiError(res.status, data)
  }

  return data as FeedbackResponseBody
}

type FastApiIssue = {
  loc?: unknown
  msg?: string
}

export function parseFastApiFieldErrors(body: unknown): FeedbackFieldErrors {
  const out: FeedbackFieldErrors = {}
  if (!body || typeof body !== 'object') return out
  const detail = (body as { detail?: unknown }).detail
  if (!Array.isArray(detail)) return out

  for (const item of detail) {
    if (!item || typeof item !== 'object') continue
    const issue = item as FastApiIssue
    const loc = issue.loc
    const msg = typeof issue.msg === 'string' ? issue.msg : 'Invalid value'
    if (!Array.isArray(loc)) continue
    const last = loc[loc.length - 1]
    if (
      last === 'email' ||
      last === 'comment' ||
      last === 'rating' ||
      last === 'highlight'
    ) {
      const key = last as FeedbackFieldKey
      out[key] = msg
    }
  }
  return out
}
