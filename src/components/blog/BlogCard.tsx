'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { PublicationState } from '@/types/publication'

interface BlogCardProps {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  publication: PublicationState
  onTagClick?: (tag: string) => void
}

export default function BlogCard({ slug, title, date, excerpt, tags, publication, onTagClick }: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="group relative rounded-2xl overflow-hidden bg-surface/50 backdrop-blur-md border border-border/40 p-5 transition-shadow duration-300 hover:shadow-[0_14px_30px_rgba(0,0,0,0.12)]"
    >
      <Link
        href={`/blog/${slug}`}
        prefetch
        aria-label={`阅读文章：${title}`}
        className="absolute inset-0 z-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      />
      <div className="relative z-10 pointer-events-none">
        <div className="flex flex-wrap items-center gap-2 text-xs text-fg/70">
          <time>{date}</time>
          {publication === 'archived' && <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-amber-800 dark:text-amber-200">归档</span>}
        </div>
        <h3 className="mt-2 font-semibold text-fg/85">{title}</h3>
        <p className="mt-2 text-sm text-fg/55 leading-relaxed line-clamp-3">{excerpt}</p>
      </div>
      <div className="relative z-10 mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagClick?.(tag)}
            className="rounded-full bg-fg/5 text-xs text-fg/70 px-2 py-0.5 hover:bg-surface/70 hover:text-accent transition-colors cursor-pointer"
          >
            {tag}
          </button>
        ))}
      </div>
    </motion.article>
  )
}
