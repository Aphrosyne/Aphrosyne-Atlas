'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Project } from '@/config/projects'
import { CONTENT_CARD_FOCUS, CONTENT_CARD_PADDING, CONTENT_CARD_SURFACE } from './content-card'
import { PROJECT_STATUS } from './content-status'
import { useMotionPolicy } from '@/lib/use-motion-policy'

interface ProjectCardProps {
  title: string
  description: string
  tags: string[]
  status: Project['status']
  language: string
  href: string
  featured?: boolean
}

export default function ProjectCard({
  title,
  description,
  tags,
  status,
  language,
  href,
  featured = false,
}: ProjectCardProps) {
  const statusMeta = PROJECT_STATUS[status]
  const { shouldReduceMotion } = useMotionPolicy()

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { y: 12 }}
      animate={{ y: 0 }}
      whileHover={shouldReduceMotion ? undefined : { y: -3 }}
      className={featured ? 'sm:col-span-2' : undefined}
    >
      <article className={`${CONTENT_CARD_SURFACE} flex min-h-0 flex-col sm:min-h-64 ${CONTENT_CARD_PADDING}`}>
        <Link
          href={href}
          aria-label={`查看项目：${title}`}
          className={`absolute inset-0 z-0 rounded-2xl ${CONTENT_CARD_FOCUS}`}
        />

        <div className="pointer-events-none relative z-10 flex h-full flex-col">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className={`rounded-full border px-2.5 py-1 ${statusMeta.className}`}>{statusMeta.label}</span>
            <span className="rounded-full bg-fg/5 px-2.5 py-1 text-fg/60">{language}</span>
          </div>

          <h2 className={`mt-4 font-semibold leading-snug text-fg/85 transition-colors group-hover:text-accent ${featured ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'}`}>{title}</h2>
          <p className="mt-2 max-w-3xl line-clamp-3 text-sm leading-6 text-fg/55">{description}</p>

          <div className="mt-auto flex items-end justify-between gap-4 pt-5">
            <div className="flex min-h-5 flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="rounded-full bg-fg/5 px-2 py-0.5 text-xs text-fg/65">
                  {tag}
                </span>
              ))}
            </div>
            <span className="shrink-0 text-sm font-medium text-fg/60 transition-all group-hover:translate-x-1 group-hover:text-accent">
              查看项目 <span aria-hidden="true">→</span>
            </span>
          </div>
        </div>
      </article>
    </motion.div>
  )
}
