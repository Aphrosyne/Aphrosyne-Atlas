export default function BlogLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="h-10 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-xl border border-border bg-surface"
          />
        ))}
      </div>
    </div>
  )
}
