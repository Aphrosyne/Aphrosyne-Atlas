'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import type { Project } from '@/config/projects'

interface ProjectCardProps {
  title: string
  description: string
  tags: string[]
  status: Project['status']
  language: string
  href: string
  featured?: boolean
}

const STATUS = {
  public: {
    label: '公开',
    className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  },
  archived: {
    label: '公开归档',
    className: 'border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200',
  },
} as const

export default function ProjectCard({
  title,
  description,
  tags,
  status,
  language,
  href,
  featured = false,
}: ProjectCardProps) {
  const statusMeta = STATUS[status]
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { y: 12 }}
      animate={{ y: 0 }}
      whileHover={shouldReduceMotion ? undefined : { y: -3 }}
      className={featured ? 'sm:col-span-2' : undefined}
    >
      <article className="group relative flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border/40 bg-surface/50 p-5 backdrop-blur-md transition-[background-color,box-shadow] duration-300 hover:bg-surface/65 hover:shadow-[0_14px_30px_rgba(0,0,0,0.12)] sm:min-h-64 sm:p-6">
        <Link
          href={href}
          aria-label={`查看项目：${title}`}
          className="absolute inset-0 z-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
        />

        <div className="pointer-events-none relative z-10 flex h-full flex-col">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className={`rounded-full border px-2.5 py-1 ${statusMeta.className}`}>{statusMeta.label}</span>
            <span className="rounded-full bg-fg/5 px-2.5 py-1 text-fg/60">{language}</span>
          </div>

          <h2 className={`mt-4 font-semibold text-fg/85 transition-colors group-hover:text-accent ${featured ? 'text-xl sm:text-2xl' : 'text-lg'}`}>{title}</h2>
          <p className="mt-2 max-w-3xl line-clamp-3 text-sm leading-relaxed text-fg/55">{description}</p>

          <div className="mt-auto flex items-end justify-between gap-4 pt-5">
            <div className="flex flex-wrap gap-2">
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
