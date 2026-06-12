import Link from 'next/link'

interface BlogCardProps {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  onTagClick?: (tag: string) => void
}

export default function BlogCard({ slug, title, date, excerpt, tags, onTagClick }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="group rounded-2xl bg-surface/50 backdrop-blur-sm border border-border/40 p-5 transition-[transform,box-shadow] duration-300 transform-gpu hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.12)]"
    >
      <time className="text-xs text-fg/70">{date}</time>
      <h3 className="mt-2 font-semibold text-fg/85">
        {title}
      </h3>
      <p className="mt-2 text-sm text-fg/55 leading-relaxed line-clamp-3">{excerpt}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTagClick?.(tag) }}
            className="rounded-full bg-fg/5 text-xs text-fg/70 px-2 py-0.5 hover:bg-surface/70 hover:text-accent transition-colors cursor-pointer"
          >
            {tag}
          </button>
        ))}
      </div>
    </Link>
  )
}
