import Link from 'next/link'

interface BlogCardProps {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
}

export default function BlogCard({ slug, title, date, excerpt, tags }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="group rounded-2xl bg-white/8 backdrop-blur-sm border-t border-t-white/15 border-b border-b-white/5 shadow-[0_10px_25px_rgba(0,0,0,0.08)] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(75,169,178,0.08)]"
    >
      <time className="text-xs text-white/80">{date}</time>
      <h3 className="mt-2 font-semibold text-white group-hover:text-accent transition-colors">
        {title}
      </h3>
      <p className="mt-2 text-sm text-white/50 leading-relaxed line-clamp-3">{excerpt}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-white/12 px-2 py-0.5 text-xs text-white/50 hover:text-white hover:bg-white/20 transition-colors"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}
