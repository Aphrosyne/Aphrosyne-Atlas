'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import type { PostMetadata } from '@/types/post'
import BlogCard from './BlogCard'

const fade = { initial: { opacity: 0 }, animate: { opacity: 1 } }
const fadeT = (delay = 0) => ({ duration: 0.4, ease: 'easeOut' as const, delay })

export default function BlogList({ posts }: { posts: PostMetadata[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const showingArchive = searchParams.get('view') === 'archive'
  const archivedCount = posts.filter((post) => post.publication === 'archived').length
  const visiblePosts = posts.filter((post) => showingArchive
    ? post.publication === 'archived'
    : post.publication === 'published')

  const allTags = useMemo(() => [...new Set(visiblePosts.flatMap((p) => p.tags))].sort(), [visiblePosts])

  const filtered = visiblePosts.filter((post) => {
    const matchesQuery =
      !query ||
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase())
    const matchesTag = !activeTag || post.tags.includes(activeTag)
    return matchesQuery && matchesTag
  })

  return (
    <div>
      {archivedCount > 0 && (
        <div className="mb-5 inline-flex rounded-full border border-border/30 bg-surface/50 p-1 backdrop-blur-sm" aria-label="文章发布状态">
          <button
            type="button"
            onClick={() => { setActiveTag(null); router.replace('/blog', { scroll: false }) }}
            className={`min-h-11 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors ${!showingArchive ? 'bg-accent text-white' : 'text-fg/65 hover:bg-surface/70 hover:text-fg'}`}
          >
            当前文章
          </button>
          <button
            type="button"
            onClick={() => { setActiveTag(null); router.replace('/blog?view=archive', { scroll: false }) }}
            className={`min-h-11 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors ${showingArchive ? 'bg-accent text-white' : 'text-fg/65 hover:bg-surface/70 hover:text-fg'}`}
          >
            归档 <span className="opacity-70">{archivedCount}</span>
          </button>
        </div>
      )}
      {/* Search & filter */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <motion.input
          type="text"
          placeholder={showingArchive ? '搜索归档文章…' : '搜索文章…'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          {...fade}
          transition={fadeT()}
          className="w-full rounded-full bg-surface/50 backdrop-blur-sm border border-border/20 px-4 py-2 text-sm text-fg/70 placeholder:text-fg/40 focus:outline-none focus:ring-1 focus:ring-accent sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          <motion.button
            onClick={() => setActiveTag(null)}
            {...fade}
            transition={fadeT()}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              !activeTag
                ? 'bg-accent text-white'
                : 'bg-surface/50 backdrop-blur-sm text-fg/70 hover:bg-surface/70 hover:text-accent'
            }`}
          >
            All
          </motion.button>
          {allTags.map((tag) => (
            <motion.button
              key={tag}
              onClick={() => setActiveTag(tag)}
              {...fade}
              transition={fadeT()}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeTag === tag
                  ? 'bg-accent text-white'
                  : 'bg-surface/50 backdrop-blur-sm text-fg/70 hover:bg-surface/70 hover:text-accent'
              }`}
            >
              {tag}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="py-12 text-center text-fg/40">{showingArchive ? '没有符合条件的归档文章。' : '没有符合条件的文章。'}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <BlogCard key={post.slug} {...post} onTagClick={setActiveTag} />
          ))}
        </div>
      )}
    </div>
  )
}
