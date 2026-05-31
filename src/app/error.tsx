'use client'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-fg">Something went wrong</h1>
      <p className="mt-4 text-muted">{error.message || 'An unexpected error occurred.'}</p>
      <button
        onClick={reset}
        className="mt-8 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
      >
        Try again
      </button>
    </div>
  )
}
