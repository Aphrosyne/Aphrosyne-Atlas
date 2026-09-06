'use client'

import { motion } from 'framer-motion'
import { publicPath } from '@/lib/public-path'

interface BlogCardProps {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  index: number
  onTagClick?: (tag: string) => void
}

export default function BlogCard({ slug, title, date, excerpt, tags, index, onTagClick }: BlogCardProps) {
  return (
    <motion.a
      href={publicPath(`/blog/${slug}/`)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="group rounded-2xl overflow-hidden bg-surface/50 backdrop-blur-md border border-border/40 p-5 transition-shadow duration-300 hover:shadow-[0_14px_30px_rgba(0,0,0,0.12)] cursor-pointer"
    >
      <time className="text-xs text-fg/70">{date}</time>
      <h3 className="mt-2 font-semibold text-fg/85">
        {title}
      </h3>
      <p className="mt-2 text-sm text-fg/55 leading-relaxed line-clamp-3">{excerpt}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTagClick?.(tag) }}
            className="rounded-full bg-fg/5 text-xs text-fg/70 px-2 py-0.5 hover:bg-surface/70 hover:text-accent transition-colors cursor-pointer"
          >
            {tag}
          </button>
        ))}
      </div>
    </motion.a>
  )
}
