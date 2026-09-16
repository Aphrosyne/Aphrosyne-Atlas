'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import type { PostMetadata } from '@/types/post'
import ContentToolbar from '@/components/shared/ContentToolbar'
import SortControls, { type SortDirection } from '@/components/shared/SortControls'
import BlogCard from './BlogCard'

const fade = { initial: { opacity: 0 }, animate: { opacity: 1 } }
const fadeT = (delay = 0) => ({ duration: 0.4, ease: 'easeOut' as const, delay })
const BLOG_SORT_OPTIONS = [
  { value: 'date', label: '发布日期' },
  { value: 'title', label: '标题' },
] as const
type BlogSort = (typeof BLOG_SORT_OPTIONS)[number]['value']

export default function BlogList({ posts }: { posts: PostMetadata[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [activeTag, setActiveTag] = useState<string | null>(searchParams.get('tag'))
  const [sortBy, setSortBy] = useState<BlogSort>(searchParams.get('sort') === 'title' ? 'title' : 'date')
  const [sortDirection, setSortDirection] = useState<SortDirection>(searchParams.get('dir') === 'asc' ? 'asc' : 'desc')
  const replace = (next: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(next).forEach(([key, value]) => value ? params.set(key, value) : params.delete(key))
    router.replace(`/blog${params.size ? `?${params}` : ''}`, { scroll: false })
  }
  const showingArchive = searchParams.get('view') === 'archive'
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setQuery(searchParams.get('q') ?? '')
      setActiveTag(searchParams.get('tag'))
      setSortBy(searchParams.get('sort') === 'title' ? 'title' : 'date')
      setSortDirection(searchParams.get('dir') === 'asc' ? 'asc' : 'desc')
    })
    return () => cancelAnimationFrame(frame)
  }, [searchParams])
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
  const sortedPosts = [...filtered].sort((left, right) => {
    const comparison = sortBy === 'date'
      ? left.date.localeCompare(right.date)
      : left.title.localeCompare(right.title, 'zh-CN')
    return sortDirection === 'asc' ? comparison : -comparison
  })

  return (
    <div>
      {archivedCount > 0 && (
        <div className="mb-5 inline-flex h-13 rounded-2xl border border-border/30 bg-surface/50 p-1 backdrop-blur-sm" aria-label="文章发布状态">
          <button
            type="button"
            onClick={() => { setActiveTag(null); replace({ view: null, tag: null }) }}
            className={`min-h-11 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors ${!showingArchive ? 'bg-accent-fill text-on-accent' : 'text-fg/65 hover:bg-surface/70 hover:text-fg'}`}
          >
            当前文章
          </button>
          <button
            type="button"
            onClick={() => { setActiveTag(null); replace({ view: 'archive', tag: null }) }}
            className={`min-h-11 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors ${showingArchive ? 'bg-accent-fill text-on-accent' : 'text-fg/65 hover:bg-surface/70 hover:text-fg'}`}
          >
            归档 <span className="opacity-70">{archivedCount}</span>
          </button>
        </div>
      )}
      {/* Search & filter */}
      <div className="mb-8 space-y-4">
        <ContentToolbar className="sm:justify-between">
          <motion.input
            type="text"
            aria-label={showingArchive ? '搜索归档文章' : '搜索文章'}
            placeholder={showingArchive ? '搜索归档文章…' : '搜索文章…'}
            value={query}
            onChange={(e) => { setQuery(e.target.value); replace({ q: e.target.value || null }) }}
            {...fade}
            transition={fadeT()}
            className="h-13 w-full rounded-2xl border border-border/30 bg-surface/50 px-4 text-sm text-fg/70 placeholder:text-fg/40 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-accent sm:max-w-xs"
          />
          <SortControls
            options={BLOG_SORT_OPTIONS}
            value={sortBy}
            direction={sortDirection}
            onValueChange={(value) => { setSortBy(value); replace({ sort: value }) }}
            onDirectionChange={(value) => { setSortDirection(value); replace({ dir: value }) }}
            label="文章排序方式"
            className="self-start sm:self-auto"
          />
        </ContentToolbar>
        <div className="flex flex-wrap gap-2">
          <motion.button
            onClick={() => { setActiveTag(null); replace({ tag: null }) }}
            {...fade}
            transition={fadeT()}
            className={`inline-flex min-h-11 items-center rounded-full px-3 text-xs font-medium transition-colors sm:min-h-8 ${
              !activeTag
                ? 'bg-accent-fill text-on-accent'
                : 'bg-surface/50 backdrop-blur-sm text-fg/70 hover:bg-surface/70 hover:text-accent'
            }`}
          >
            All
          </motion.button>
          {allTags.map((tag) => (
            <motion.button
              key={tag}
              onClick={() => { setActiveTag(tag); replace({ tag }) }}
              {...fade}
              transition={fadeT()}
              className={`inline-flex min-h-11 items-center rounded-full px-3 text-xs font-medium transition-colors sm:min-h-8 ${
                activeTag === tag
                  ? 'bg-accent-fill text-on-accent'
                  : 'bg-surface/50 backdrop-blur-sm text-fg/70 hover:bg-surface/70 hover:text-accent'
              }`}
            >
              {tag}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Article feed */}
      {filtered.length === 0 ? (
        <p className="py-12 text-center text-fg/40">{showingArchive ? '没有符合条件的归档文章。' : '没有符合条件的文章。'}</p>
      ) : (
        <div className="space-y-4">
          {sortedPosts.map((post, index) => (
            <BlogCard key={post.slug} {...post} index={index} onTagClick={setActiveTag} />
          ))}
        </div>
      )}
    </div>
  )
}
