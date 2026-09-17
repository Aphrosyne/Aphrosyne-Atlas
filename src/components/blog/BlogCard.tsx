'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { PublicationState } from '@/types/publication'
import { CONTENT_CARD_FOCUS, CONTENT_CARD_PADDING, CONTENT_CARD_SURFACE, PINNED_CONTENT_CARD_SURFACE } from '@/components/shared/content-card'
import { ARCHIVED_STATUS_CLASS, PINNED_STATUS_CLASS } from '@/components/shared/content-status'
import { useMotionPolicy } from '@/lib/use-motion-policy'

interface BlogCardProps {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  publication: PublicationState
  pinned: boolean
  index: number
  onTagClick?: (tag: string) => void
}

export default function BlogCard({ slug, title, date, excerpt, tags, publication, pinned, index, onTagClick }: BlogCardProps) {
  const { shouldReduceMotion } = useMotionPolicy()

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { x: 20 }}
      animate={{ x: 0 }}
      whileHover={shouldReduceMotion || pinned ? undefined : { y: -3 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3, ease: 'easeOut', delay: Math.min(index * 0.04, 0.16) }}
    >
      <article className={`${CONTENT_CARD_SURFACE} ${pinned ? PINNED_CONTENT_CARD_SURFACE : ''}`}>
        <Link
          href={`/blog/${slug}`}
          prefetch={false}
          aria-label={`阅读文章：${title}`}
          className={`absolute inset-0 z-0 rounded-2xl ${CONTENT_CARD_FOCUS}`}
        />
        <div className={`grid gap-4 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-6 ${CONTENT_CARD_PADDING}`}>
          <div className="relative z-10 flex items-start gap-2 text-xs text-fg/60 pointer-events-none sm:flex-col sm:gap-1 sm:border-r sm:border-border/30 sm:pr-6">
            <time className="font-medium tabular-nums text-fg/75">{date}</time>
            <span className="hidden text-[0.65rem] tracking-[0.18em] text-fg/35 uppercase sm:block">Article</span>
            {publication === 'archived' && <span className={`rounded-full border px-2 py-0.5 ${ARCHIVED_STATUS_CLASS.archived}`}>归档</span>}
            {pinned && <span className={`rounded-full border px-2 py-0.5 ${PINNED_STATUS_CLASS}`}>置顶</span>}
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-semibold leading-snug text-fg/90 transition-colors group-hover:text-accent sm:text-xl">{title}</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-fg/60 line-clamp-2">{excerpt}</p>
            <div className="relative z-10 mt-4 flex min-h-5 flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onTagClick?.(tag)}
                  className="cursor-pointer rounded-full bg-fg/5 px-2 py-0.5 text-xs text-fg/70 transition-colors hover:bg-surface/70 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
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
