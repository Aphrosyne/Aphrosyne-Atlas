'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { publicPath } from '@/lib/public-path'

interface SearchItem {
  title: string
  href: string
  excerpt: string
  type: 'blog' | 'knowledge' | 'page'
  searchableText: string
}

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [data, setData] = useState<SearchItem[]>([])
  const [scope, setScope] = useState<'all' | 'blog' | 'knowledge'>('all')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      fetch(publicPath('/search-index.json')).then(r => r.json()).then(setData)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  const filteredResults = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLocaleLowerCase()
    return data
      .filter((item) => scope === 'all' || item.type === scope)
      .filter((item) => item.searchableText.toLocaleLowerCase().includes(q))
      .slice(0, 8)
  }, [data, query, scope])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay: bg-black kept intentionally — darker than themed bg-bg for contrast */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4"
          >
            <div className="rounded-2xl bg-surface/90 backdrop-blur-xl border border-border/10 shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border/5">
                <svg className="w-4 h-4 text-fg/30 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="搜索文章、知识库、项目..."
                  className="flex-1 bg-transparent text-fg placeholder:text-fg/30 text-sm outline-none"
                />
                <kbd className="hidden sm:inline text-[10px] text-fg/20 border border-border/10 rounded px-1.5 py-0.5">ESC</kbd>
              </div>
              <div className="flex gap-2 border-b border-border/5 px-4 py-2 text-xs">
                {([['all', '全部'], ['knowledge', '知识库'], ['blog', 'Blog']] as const).map(([value, label]) => (
                  <button key={value} type="button" onClick={() => setScope(value)} className={`rounded-full px-2.5 py-1 transition-colors ${scope === value ? 'bg-accent text-white' : 'text-fg/50 hover:bg-fg/5 hover:text-fg'}`}>{label}</button>
                ))}
              </div>
              {filteredResults.length > 0 && (
                <div className="py-2">
                  {filteredResults.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-fg/5 transition-colors group"
                    >
                      <span className="text-sm text-fg/80 group-hover:text-fg truncate">{item.title}</span>
                      <span className="text-[11px] text-fg/30 truncate ml-auto hidden sm:block">{item.href}</span>
                    </Link>
                  ))}
                </div>
              )}
              {query && filteredResults.length === 0 && data.length > 0 && (
                <div className="px-4 py-6 text-center text-sm text-fg/30">没有找到相关结果</div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
