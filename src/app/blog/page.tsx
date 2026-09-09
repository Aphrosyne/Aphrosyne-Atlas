import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getAllPosts } from '@/lib/posts'
import BlogList from '@/components/blog/BlogList'
import PageTransition from '@/components/shared/PageTransition'

export const metadata: Metadata = {
  title: 'Blog',
  description: '一些想法、笔记和探索。',
}

export default async function BlogPage() {
  const posts = await getAllPosts({ includeArchived: true })

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <PageTransition>
        <h1 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">Blog</h1>
        <p className="mt-2 text-fg/65">一些想法、笔记和探索。</p>
      </PageTransition>
      <div className="mt-8">
        <Suspense fallback={<p className="rounded-2xl border border-border/50 bg-surface/50 px-5 py-12 text-center text-fg/45">正在加载文章…</p>}>
          <BlogList posts={posts} />
        </Suspense>
      </div>
    </div>
  )
}
