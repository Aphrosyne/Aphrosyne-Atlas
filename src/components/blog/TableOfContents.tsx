'use client'

import { useEffect, useState } from 'react'

export default function TableOfContents() {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([])

  useEffect(() => {
    const elements = document.querySelectorAll('article h1, article h2, article h3, article h4, article h5, article h6')
    const seen = new Set<string>()
    const items = Array.from(elements)
      .filter((el) => el.id && el.textContent)
      .map((el) => ({
        id: el.id,
        text: el.textContent || '',
        level: Number(el.tagName[1]),
      }))
      .filter((h) => {
        if (seen.has(h.id)) return false
        seen.add(h.id)
        return true
      })
    setHeadings(items)
  }, [])

  if (headings.length === 0) return null

  return (
    <nav className="sticky top-24 rounded-xl bg-white/50 backdrop-blur-sm border border-white/60 p-4">
      <h4 className="mb-3 text-xs text-black/40 uppercase tracking-wider">目录</h4>
      <ul className="space-y-1.5 text-sm">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`block text-black/60 hover:text-accent transition-colors leading-relaxed ${
                h.level === 3 ? 'pl-3' : h.level >= 4 ? 'pl-6 text-xs' : ''
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
