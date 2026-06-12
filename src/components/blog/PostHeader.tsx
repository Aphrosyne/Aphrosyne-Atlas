import type { PostMetadata } from '@/types/post'

export default function PostHeader({ title, date, tags, readingTime }: PostMetadata) {
  return (
    <header className="mb-10">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
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
            className="rounded-full bg-black/5 text-xs text-black/70 px-2.5 py-0.5"
          >
            {tag}
          </span>
        ))}
      </div>
    </header>
  )
}
