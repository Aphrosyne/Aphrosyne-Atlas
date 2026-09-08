'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import type { KnowledgeMetadata, KnowledgeStatus, KnowledgeType } from '@/types/knowledge'

const TYPE_LABELS: Record<KnowledgeType, string> = {
  guide: '教程',
  fix: '问题修复',
  experiment: '实验记录',
  reference: '参考资料',
}

const STATUS_LABELS: Record<KnowledgeStatus, string> = {
  verified: '已验证',
  'needs-review': '待复查',
  outdated: '已过时',
}

const STATUS_CLASSES: Record<KnowledgeStatus, string> = {
  verified: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  'needs-review': 'border-amber-400/30 bg-amber-400/10 text-amber-200',
  outdated: 'border-rose-400/30 bg-rose-400/10 text-rose-200',
}

const MotionLink = motion.create(Link)

export default function KnowledgeList({ entries }: { entries: KnowledgeMetadata[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const shouldReduceMotion = useReducedMotion()
  const selectedType = searchParams.get('type')
  const showingArchive = searchParams.get('view') === 'archive'
  const activeType = (Object.keys(TYPE_LABELS) as string[]).includes(selectedType ?? '')
    ? selectedType as KnowledgeType
    : 'all'

  const publishedEntries = entries.filter((entry) => entry.publication === 'published')
  const archivedEntries = entries.filter((entry) => entry.publication === 'archived')
  const visibleEntries = showingArchive ? archivedEntries : publishedEntries
  const filtered = activeType === 'all' ? visibleEntries : visibleEntries.filter((entry) => entry.type === activeType)

  return (
    <div className="grid gap-6 lg:grid-cols-[13rem_minmax(0,1fr)]">
      <aside className="rounded-2xl border border-border/50 bg-surface/50 p-4 backdrop-blur-sm lg:sticky lg:top-24 lg:h-fit">
        <p className="mb-3 text-xs font-medium tracking-widest text-fg/45 uppercase">分类</p>
        <div className="flex gap-2 overflow-x-auto lg:flex-col">
          <button
            type="button"
            onClick={() => router.replace('/knowledge', { scroll: false })}
            className={`shrink-0 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
              !showingArchive && activeType === 'all' ? 'bg-accent text-white' : 'text-fg/65 hover:bg-surface hover:text-fg'
            }`}
          >
            全部条目 <span className="float-right opacity-60">{publishedEntries.length}</span>
          </button>
          {(Object.keys(TYPE_LABELS) as KnowledgeType[]).map((type) => {
            const count = publishedEntries.filter((entry) => entry.type === type).length
            return (
              <button
                key={type}
                type="button"
                onClick={() => router.replace(`/knowledge?type=${type}`, { scroll: false })}
                className={`shrink-0 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                  !showingArchive && activeType === type ? 'bg-accent text-white' : 'text-fg/65 hover:bg-surface hover:text-fg'
                }`}
              >
                {TYPE_LABELS[type]} <span className="float-right opacity-60">{count}</span>
              </button>
            )
          })}
          {archivedEntries.length > 0 && (
            <button
              type="button"
              onClick={() => router.replace('/knowledge?view=archive', { scroll: false })}
              className={`min-h-11 shrink-0 cursor-pointer rounded-xl border-t border-border/30 px-3 py-2 text-left text-sm transition-colors lg:mt-2 lg:rounded-t-none ${showingArchive ? 'bg-accent text-white' : 'text-fg/65 hover:bg-surface hover:text-fg'}`}
            >
              归档条目 <span className="float-right opacity-60">{archivedEntries.length}</span>
            </button>
          )}
        </div>
      </aside>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border/60 px-5 py-12 text-center text-fg/45">{showingArchive ? '还没有归档条目。' : '这个分类还没有条目。'}</p>
        ) : (
          filtered.map((entry, index) => (
            <MotionLink
              key={entry.slug}
              href={`/knowledge/${entry.slug}`}
              initial={shouldReduceMotion ? false : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3, ease: 'easeOut', delay: Math.min(index * 0.04, 0.16) }}
              className="group block rounded-2xl border border-border/50 bg-surface/50 p-5 backdrop-blur-sm transition-colors hover:bg-surface/75"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-accent/15 px-2.5 py-1 text-accent">{TYPE_LABELS[entry.type]}</span>
                <span className={`rounded-full border px-2.5 py-1 ${STATUS_CLASSES[entry.status]}`}>{STATUS_LABELS[entry.status]}</span>
                {entry.publication === 'archived' && <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-amber-800 dark:text-amber-200">归档</span>}
                {entry.gameVersion && <span className="text-fg/45">{entry.gameVersion}</span>}
              </div>
              <h2 className="mt-3 text-xl font-semibold text-fg/90 transition-colors group-hover:text-accent">{entry.title}</h2>
              <p className="mt-2 leading-7 text-fg/60">{entry.excerpt}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {entry.tags.map((tag) => <span key={tag} className="text-xs text-fg/45">#{tag}</span>)}
              </div>
            </MotionLink>
          ))
        )}
      </div>
    </div>
  )
}
