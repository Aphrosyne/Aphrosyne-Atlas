'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import type { KnowledgeMetadata, KnowledgeType } from '@/types/knowledge'
import ContentToolbar from '@/components/shared/ContentToolbar'
import { CONTENT_CARD_FOCUS, CONTENT_CARD_PADDING, CONTENT_CARD_SURFACE, PINNED_CONTENT_CARD_SURFACE } from '@/components/shared/content-card'
import SortControls, { type SortDirection } from '@/components/shared/SortControls'
import { ARCHIVED_STATUS_CLASS, KNOWLEDGE_STATUS_CLASSES, KNOWLEDGE_STATUS_LABELS, PINNED_STATUS_CLASS } from '@/components/shared/content-status'
import { useMotionPolicy } from '@/lib/use-motion-policy'
import { comparePinned } from '@/lib/pinned-order'

const TYPE_LABELS: Record<KnowledgeType, string> = {
  guide: '教程',
  fix: '问题修复',
  experiment: '实验记录',
  reference: '参考资料',
}

const MotionLink = motion.create(Link)
const KNOWLEDGE_SORT_OPTIONS = [
  { value: 'title', label: '标题' },
  { value: 'lastEdited', label: '最后更新' },
] as const
type KnowledgeSort = (typeof KNOWLEDGE_SORT_OPTIONS)[number]['value']

export default function KnowledgeList({ entries }: { entries: KnowledgeMetadata[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { shouldReduceMotion } = useMotionPolicy()
  const selectedType = searchParams.get('type')
  const [sortBy, setSortBy] = useState<KnowledgeSort>('title')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const replace = (next: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(next).forEach(([key, value]) => value ? params.set(key, value) : params.delete(key))
    router.replace(`/knowledge${params.size ? `?${params}` : ''}`, { scroll: false })
  }
  const showingArchive = searchParams.get('view') === 'archive'
  const activeType = (Object.keys(TYPE_LABELS) as string[]).includes(selectedType ?? '')
    ? selectedType as KnowledgeType
    : 'all'

  const publishedEntries = entries.filter((entry) => entry.publication === 'published')
  const archivedEntries = entries.filter((entry) => entry.publication === 'archived')
  const visibleEntries = showingArchive ? archivedEntries : publishedEntries
  const filtered = activeType === 'all' ? visibleEntries : visibleEntries.filter((entry) => entry.type === activeType)
  const sortedEntries = useMemo(() => [...filtered].sort((left, right) => {
    const pinOrder = comparePinned(left, right)
    if (pinOrder) return pinOrder
    if (sortBy === 'title') {
      const comparison = left.title.localeCompare(right.title, 'zh-CN')
      return sortDirection === 'asc' ? comparison : -comparison
    }

    const leftValue = left[sortBy]
    const rightValue = right[sortBy]
    if (!leftValue && !rightValue) return left.title.localeCompare(right.title, 'zh-CN')
    if (!leftValue) return 1
    if (!rightValue) return -1
    const comparison = leftValue.localeCompare(rightValue)
    return sortDirection === 'asc' ? comparison : -comparison
  }), [filtered, sortBy, sortDirection])

  return (
    <div className="grid gap-6 lg:grid-cols-[13rem_minmax(0,1fr)]">
      <aside className="rounded-2xl border border-border/50 bg-surface/50 p-4 backdrop-blur-sm lg:sticky lg:top-24 lg:h-fit">
        <p className="mb-3 text-xs font-medium tracking-widest text-fg/45 uppercase">分类</p>
        <div className="grid grid-cols-2 gap-2 lg:flex lg:flex-col">
          <button
            type="button"
            onClick={() => replace({ type: null, view: null })}
            className={`min-h-11 w-full rounded-xl px-3 py-2 text-left text-sm transition-colors ${
              !showingArchive && activeType === 'all' ? 'bg-accent-fill text-on-accent' : 'text-fg/65 hover:bg-surface hover:text-fg'
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
                onClick={() => replace({ type, view: null })}
                className={`min-h-11 w-full rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                  !showingArchive && activeType === type ? 'bg-accent-fill text-on-accent' : 'text-fg/65 hover:bg-surface hover:text-fg'
                }`}
              >
                {TYPE_LABELS[type]} <span className="float-right opacity-60">{count}</span>
              </button>
            )
          })}
          {archivedEntries.length > 0 && (
            <button
              type="button"
              onClick={() => replace({ view: 'archive', type: null })}
              className={`col-span-2 min-h-11 w-full cursor-pointer rounded-xl border-t border-border/30 px-3 py-2 text-left text-sm transition-colors lg:mt-2 lg:rounded-t-none ${showingArchive ? 'bg-accent-fill text-on-accent' : 'text-fg/65 hover:bg-surface hover:text-fg'}`}
            >
              归档条目 <span className="float-right opacity-60">{archivedEntries.length}</span>
            </button>
          )}
        </div>
      </aside>

      <div className="space-y-4">
        <ContentToolbar className="sm:justify-end">
          <SortControls
            options={KNOWLEDGE_SORT_OPTIONS}
            value={sortBy}
            direction={sortDirection}
            onValueChange={setSortBy}
            onDirectionChange={setSortDirection}
            label="知识库排序方式"
            className="self-start sm:self-auto"
          />
        </ContentToolbar>
        {sortedEntries.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border/60 px-5 py-12 text-center text-fg/45">{showingArchive ? '还没有归档条目。' : '这个分类还没有条目。'}</p>
        ) : (
          sortedEntries.map((entry, index) => (
            <MotionLink
              key={entry.slug}
              href={`/knowledge/${entry.slug}`}
              initial={shouldReduceMotion ? false : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3, ease: 'easeOut', delay: Math.min(index * 0.04, 0.16) }}
              className={`${CONTENT_CARD_SURFACE} ${entry.pinned ? PINNED_CONTENT_CARD_SURFACE : ''} block ${CONTENT_CARD_PADDING} ${CONTENT_CARD_FOCUS}`}
            >
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-accent/15 px-2.5 py-1 text-accent">{TYPE_LABELS[entry.type]}</span>
                <span className={`rounded-full border px-2.5 py-1 ${KNOWLEDGE_STATUS_CLASSES[entry.status]}`}>{KNOWLEDGE_STATUS_LABELS[entry.status]}</span>
                {entry.publication === 'archived' && <span className={`rounded-full border px-2.5 py-1 ${ARCHIVED_STATUS_CLASS.archived}`}>归档</span>}
                {entry.pinned && <span className={`rounded-full border px-2.5 py-1 ${PINNED_STATUS_CLASS}`}>置顶</span>}
                {entry.gameVersion && <span className="text-fg/45">{entry.gameVersion}</span>}
              </div>
              <h2 className="mt-3 text-lg font-semibold leading-snug text-fg/90 transition-colors group-hover:text-accent sm:text-xl">{entry.title}</h2>
              <p className="mt-2 max-w-3xl line-clamp-2 text-sm leading-6 text-fg/60">{entry.excerpt}</p>
              <div className="mt-4 flex min-h-5 flex-wrap gap-2">
                {entry.tags.map((tag) => <span key={tag} className="text-xs text-fg/45">#{tag}</span>)}
              </div>
            </MotionLink>
          ))
        )}
      </div>
    </div>
  )
}
