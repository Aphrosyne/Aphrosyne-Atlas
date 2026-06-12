import type { PostMetadata } from '@/types/post'

export default function PostHeader({ title, date, tags, readingTime }: PostMetadata) {
  return (
    <header className="mb-10">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-base text-muted">
        <time>{date}</time>
        {readingTime && (
          <>
            <span className="text-border">·</span>
            <span>{readingTime}</span>
          </>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-surface/50 backdrop-blur-sm text-sm text-fg/70 px-3 py-1"
          >
            {tag}
          </span>
        ))}
      </div>
    </header>
  )
}
