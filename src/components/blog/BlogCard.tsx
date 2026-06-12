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
      className="group rounded-2xl bg-white/50 backdrop-blur-sm border border-white/40 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.12)]"
    >
      <time className="text-xs text-black/70">{date}</time>
      <h3 className="mt-2 font-semibold text-black/70">
        {title}
      </h3>
      <p className="mt-2 text-sm text-black/45 leading-relaxed line-clamp-3">{excerpt}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTagClick?.(tag) }}
            className="rounded-full bg-black/5 text-xs text-black/70 px-2 py-0.5 hover:bg-white/70 hover:text-accent transition-colors cursor-pointer"
          >
            {tag}
          </button>
        ))}
      </div>
    </Link>
  )
}
