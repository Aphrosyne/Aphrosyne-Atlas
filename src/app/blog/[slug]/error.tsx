'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function BlogPostError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Blog post rendering failed', error)
  }, [error])

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-fg">文章暂时无法显示</h1>
      <p className="mt-4 text-muted">加载文章时发生了意外问题，请稍后重试或返回博客列表。</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-accent-fill px-5 py-2.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
        >
          重试
        </button>
        <Link
          href="/blog"
          className="rounded-lg border border-border/40 px-5 py-2.5 text-sm font-medium text-fg transition-colors hover:bg-surface"
        >
          返回博客
        </Link>
      </div>
    </div>
  )
}
