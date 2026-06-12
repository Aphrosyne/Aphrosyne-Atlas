import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'
import BlogList from '@/components/blog/BlogList'
import PageTransition from '@/components/shared/PageTransition'

export const metadata: Metadata = {
  title: 'Blog',
  description: '一些想法、笔记和探索。',
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <PageTransition>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-fg">Blog</h1>
        <p className="mt-2 text-fg/50">一些想法、笔记和探索。</p>
      </PageTransition>
      <div className="mt-8">
        <BlogList posts={posts} />
      </div>
    </div>
  )
}
