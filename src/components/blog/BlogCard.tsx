'use client'

import { motion, useReducedMotion } from 'framer-motion'
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
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { y: 12 }}
      animate={{ y: 0 }}
      whileHover={shouldReduceMotion ? undefined : { y: -3 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <article className="group relative overflow-hidden rounded-2xl border border-border/40 bg-surface/50 backdrop-blur-md transition-[background-color,box-shadow] duration-300 hover:bg-surface/65 hover:shadow-[0_14px_30px_rgba(0,0,0,0.12)]">
        <Link
          href={`/blog/${slug}`}
          prefetch
          aria-label={`阅读文章：${title}`}
          className="absolute inset-0 z-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
        <div className="grid gap-4 p-5 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-6 sm:p-6">
          <div className="relative z-10 flex items-start gap-2 text-xs text-fg/60 pointer-events-none sm:flex-col sm:gap-1 sm:border-r sm:border-border/30 sm:pr-6">
            <time className="font-medium tabular-nums text-fg/75">{date}</time>
            <span className="hidden text-[0.65rem] tracking-[0.18em] text-fg/35 uppercase sm:block">Article</span>
            {publication === 'archived' && <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-amber-800 dark:text-amber-200">归档</span>}
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-semibold leading-snug text-fg/90 transition-colors group-hover:text-accent sm:text-xl">{title}</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-fg/60 line-clamp-2">{excerpt}</p>
            <div className="relative z-10 mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onTagClick?.(tag)}
                  className="cursor-pointer rounded-full bg-fg/5 px-2 py-0.5 text-xs text-fg/70 transition-colors hover:bg-surface/70 hover:text-accent"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </article>
    </motion.div>
  )
}
