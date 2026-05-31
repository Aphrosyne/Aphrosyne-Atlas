import Link from 'next/link'

export default function BlogNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-fg">Post not found</h1>
      <p className="mt-4 text-muted">
        This blog post doesn&apos;t exist — maybe it&apos;s still a draft.
      </p>
      <Link
        href="/blog"
        className="mt-8 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
      >
        Back to blog
      </Link>
    </div>
  )
}
