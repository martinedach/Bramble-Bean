import { FeedbackForm } from './components/FeedbackForm'

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
        <p className="mt-3 max-w-xl text-base leading-[1.4] text-olive">
          Tell us about your experience. All fields are required.
        </p>
      </header>
      <main className="mx-auto max-w-lg px-6 py-10">
        <FeedbackForm />
      </main>
    </div>
  )
}

export default App
