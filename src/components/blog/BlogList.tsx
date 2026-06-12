'use client'

import { useState } from 'react'
import type { PostMetadata } from '@/types/post'
import BlogCard from './BlogCard'

export default function BlogList({ posts }: { posts: PostMetadata[] }) {
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const allTags = [...new Set(posts.flatMap((p) => p.tags))].sort()

  const filtered = posts.filter((post) => {
    const matchesQuery =
      !query ||
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase())
    const matchesTag = !activeTag || post.tags.includes(activeTag)
    return matchesQuery && matchesTag
  })

  return (
    <div>
      {/* Search & filter */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Search posts…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-full bg-white/50 backdrop-blur-sm border border-white/20 px-4 py-2 text-sm text-black/70 placeholder:text-black/40 focus:outline-none focus:ring-1 focus:ring-accent sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              !activeTag
                ? 'bg-accent text-white'
                : 'bg-white/50 backdrop-blur-sm text-black/70 hover:bg-white/70 hover:text-accent'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeTag === tag
                  ? 'bg-accent text-white'
                  : 'bg-white/50 backdrop-blur-sm text-black/70 hover:bg-white/70 hover:text-accent'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="py-12 text-center text-white/30">No posts found.</p>
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
