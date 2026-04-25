# Future developments

This document captures high-value next steps after the current assessment scope.

## 1) Add authentication and authorization for the admin panel

### Why this is needed

The admin view currently exposes customer submissions without access control. That is acceptable for a lightweight demo, but not for a production product. In real usage, the admin panel should be protected because it contains customer-provided content and operational insights.

### Risks without auth

- Any user with the URL can open the admin panel.
- No user identity means no accountability for admin actions.
- No way to restrict data visibility by role or staff permissions.

### Suggested implementation approach

1. **Session-based authentication (recommended first pass)**
   - Add login endpoint (email/password for staff users).
   - Issue secure HTTP-only session cookie.
   - Protect admin API routes with auth middleware/dependency.
2. **Role-based authorization**
   - Add user roles (for example: `admin`, `manager`, `viewer`).
   - Restrict admin routes to authorized roles only.
3. **Frontend route protection**
   - Hide/disable admin view toggle for unauthenticated users.
   - Redirect to login screen if session is missing or expired.
4. **Security hardening**
   - Password hashing (Argon2 or bcrypt).
   - CSRF protections for cookie-based auth.
   - Session expiration/rotation and logout endpoint.
   - Basic rate limiting on login endpoint.

### Data model additions (example)

- `users` table: `id`, `email`, `password_hash`, `role`, `created_at`.
- Optional `audit_log` table for key admin actions.

## 2) Add LLM-based sentiment analysis for submitted reviews

### Goal

Automatically classify each review so cafe staff can quickly understand customer sentiment trends and common themes.

### What to analyze

- **Sentiment label**: positive / neutral / negative.
- **Sentiment score**: numeric confidence or polarity score.
- **Topic tags**: food, coffee, service, atmosphere, pricing, wait-time, etc.
- **Short summary**: one concise line for dashboard readability.

### Suggested architecture

1. **Persist raw review first**
   - Keep feedback submission latency low.
   - Never block `POST /api/feedback` on LLM latency.
2. **Background analysis job**
   - Queue each new submission for processing (worker pattern).
   - Store analysis output in DB fields or a separate table.
3. **Expose analysis in admin API**
   - Extend `GET /api/feedback` response with sentiment fields.
   - Add filtering/sorting (for example: show negative first).

### Schema extension options

- Add columns to `feedback_submissions`:
  - `sentiment_label` (text)
  - `sentiment_score` (float)
  - `sentiment_summary` (text)
  - `sentiment_updated_at` (timestamp)
- Or add `feedback_analysis` table for model/versioned outputs.

### Reliability and safety considerations

- Track model name/version used for each analysis.
- Add retry and dead-letter handling for failed jobs.
- Keep prompts deterministic and short for consistency.
- Avoid storing sensitive personal data in prompts beyond what is necessary.
- Add fallback behavior when model/API is unavailable.

### Cost and performance controls

- Batch processing where possible.
- Re-analyze only when review text changes.
- Cache model responses if duplicate text appears.
- Use lighter/cheaper model for default flow; escalate only when needed.

### Evaluation plan

- Build a small labeled validation set from real reviews.
- Track precision/recall for negative sentiment detection.
- Periodically review false positives/negatives with staff feedback.

## Delivery sequencing recommendation

1. Ship admin authentication first (protect access).
2. Introduce baseline sentiment labeling in background jobs.
3. Add dashboard filters, trend views, and model quality monitoring.
