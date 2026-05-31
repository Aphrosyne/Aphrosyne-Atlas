import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'
import BlogList from '@/components/blog/BlogList'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts, notes, and deep dives on embedded systems, software, and more.',
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Blog</h1>
      <p className="mt-2 text-muted">
        Thoughts, notes, and deep dives.
      </p>
      <div className="mt-8">
        <BlogList posts={posts} />
      </div>
    </div>
  )
}
