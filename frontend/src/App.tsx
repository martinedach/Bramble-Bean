import { useState } from 'react'

import { AdminReviewsPanel } from './components/AdminReviewsPanel'
import { FeedbackForm } from './components/FeedbackForm'

function App() {
  const [view, setView] = useState<'customer' | 'admin'>('customer')

  return (
    <div className="relative min-h-dvh overflow-hidden bg-fog text-plum">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-24 size-[420px] rounded-full bg-pinterest-red/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-24 size-[460px] rounded-full bg-warm-light/60 blur-3xl"
      />

      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="grid size-10 place-items-center rounded-full bg-plum text-canvas"
          >
            <svg viewBox="0 0 24 24" fill="none" className="size-5">
              <path
                d="M6 5h10a4 4 0 010 8h-3M6 5v12a3 3 0 003 3h6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 13c2.2 0 4-1.8 4-4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <div className="leading-tight">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-olive">
              Cafe review
            </p>
            <p className="text-[15px] font-semibold text-plum">Bramble &amp; Bean</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-warm-silver/60 bg-canvas p-1">
          <button
            type="button"
            onClick={() => setView('customer')}
            className={
              'rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide transition ' +
              (view === 'customer'
                ? 'bg-plum text-canvas'
                : 'text-olive hover:bg-warm-wash')
            }
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setView('admin')}
            className={
              'rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide transition ' +
              (view === 'admin' ? 'bg-plum text-canvas' : 'text-olive hover:bg-warm-wash')
            }
          >
            Admin
          </button>
        </div>
      </header>

      {view === 'customer' ? (
        <main className="relative z-10 mx-auto grid w-full max-w-5xl gap-8 px-6 pb-8 pt-2 lg:min-h-[calc(100dvh-5.5rem)] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.1fr)] lg:items-center lg:gap-10 lg:pb-6">
          <section>
            <span className="inline-flex items-center gap-2 rounded-full border border-warm-silver/60 bg-canvas px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-olive">
              <span className="size-1.5 rounded-full bg-pinterest-red" />
              We are listening
            </span>
            <h1 className="mt-4 text-[38px] font-semibold leading-[1.05] tracking-[-1px] text-plum sm:text-[48px]">
              How was the visit?
            </h1>
            <p className="mt-3 max-w-md text-[14px] leading-[1.55] text-olive">
              Your honest take helps us choose the next bean, perfect the lunch menu, and keep
              the back room as cosy as it should be.
            </p>

            <ul className="mt-6 space-y-3">
              <li className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-1 grid size-7 place-items-center rounded-full bg-warm-wash text-pinterest-red"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                    <path d="M12 2.6l2.95 5.98 6.6.96-4.78 4.66 1.13 6.57L12 17.77l-5.9 3.1 1.13-6.57L2.45 9.54l6.6-.96L12 2.6z" />
                  </svg>
                </span>
                <div>
                  <p className="text-[14px] font-semibold text-plum">Rate your visit</p>
                  <p className="text-[12px] leading-[1.45] text-olive">
                    One to five stars across food, coffee, service, and atmosphere.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-1 grid size-7 place-items-center rounded-full bg-warm-wash text-plum"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="size-4">
                    <path
                      d="M4 7h16M4 12h10M4 17h16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <div>
                  <p className="text-[14px] font-semibold text-plum">Tell the story</p>
                  <p className="text-[12px] leading-[1.45] text-olive">
                    A sentence or a short paragraph — whatever felt worth sharing.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-1 grid size-7 place-items-center rounded-full bg-warm-wash text-plum"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="size-4">
                    <path
                      d="M5 12l5 5L20 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div>
                  <p className="text-[14px] font-semibold text-plum">Takes about a minute</p>
                  <p className="text-[12px] leading-[1.45] text-olive">
                    Four short fields, then you are done.
                  </p>
                </div>
              </li>
            </ul>
          </section>

          <section>
            <FeedbackForm />
            <p className="mt-4 text-[12px] text-warm-silver">
              We use your email only to follow up if needed. No marketing, ever.
            </p>
          </section>
        </main>
      ) : (
        <main className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-10 pt-2 lg:min-h-[calc(100dvh-5.5rem)]">
          <AdminReviewsPanel />
        </main>
      )}
    </div>
  )
}

export default App
