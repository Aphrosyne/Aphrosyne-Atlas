export default function PostLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0c0c0d]/85 backdrop-blur-xl py-12">
      <article className="prose prose-zinc dark:prose-invert prose-headings:font-semibold prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-code:rounded prose-code:bg-code-bg prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-pre:bg-code-bg prose-pre:border prose-pre:border-border max-w-3xl mx-auto px-4">
        {children}
      </article>
    </div>
  )
}
