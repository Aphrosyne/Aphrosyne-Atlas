export default function PostLayout({ children }: { children: React.ReactNode }) {
  return (
    <article className="prose prose-zinc mx-auto max-w-3xl px-4 py-12 dark:prose-invert prose-headings:font-semibold prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-code:rounded prose-code:bg-code-bg prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-pre:bg-code-bg prose-pre:border prose-pre:border-border">
      {children}
    </article>
  )
}
