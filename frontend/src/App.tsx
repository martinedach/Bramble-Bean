function App() {
  return (
    <div className="min-h-dvh bg-canvas text-plum">
      <header className="border-b border-warm-silver/50 px-6 py-5">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-olive">
          Cafe review
        </p>
        <h1 className="mt-1 text-[28px] font-bold leading-none tracking-[-0.075em]">
          Share your visit
        </h1>
      </header>
      <main className="mx-auto max-w-lg px-6 py-10">
        <p className="text-base leading-[1.4] text-olive">
          The feedback form will live here. Styling uses Tailwind with a Pinterest-inspired
          token set (warm neutrals, plum text, red primary actions).
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-pinterest-input bg-pinterest-red px-[14px] py-[6px] text-[12px] font-normal text-ink"
          >
            Primary action
          </button>
          <button
            type="button"
            className="rounded-pinterest-input bg-sand-gray px-[14px] py-[6px] text-[12px] font-normal text-ink"
          >
            Secondary
          </button>
        </div>
      </main>
    </div>
  )
}

export default App
