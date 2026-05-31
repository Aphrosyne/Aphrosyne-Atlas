import Link from 'next/link'
import AnimatedSection from '../shared/AnimatedSection'

interface PostPreview {
  slug: string
  title: string
  date: string
  excerpt: string
}

// Static preview data until the blog system is live
const previews: PostPreview[] = [
  {
    slug: 'getting-started',
    title: 'Getting Started',
    date: '2026-06-01',
    excerpt: 'First post on the new site. Setting up, breaking down, and building up.',
  },
]

export default function RecentPosts({ posts }: { posts?: PostPreview[] }) {
  const items = posts ?? previews

  if (items.length === 0) return null

  return (
    <AnimatedSection className="mx-auto max-w-5xl px-4 py-20" delay={0.1}>
      <h2 className="text-2xl font-semibold tracking-tight">Latest Posts</h2>
      <p className="mt-2 text-muted">Thoughts, notes, and explorations.</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group rounded-xl border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
          >
            <time className="text-xs text-muted">{post.date}</time>
            <h3 className="mt-2 font-semibold text-fg group-hover:text-accent transition-colors">
              {post.title}
            </h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </AnimatedSection>
  )
}
