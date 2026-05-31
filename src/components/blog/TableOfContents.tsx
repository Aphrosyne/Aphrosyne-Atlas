'use client'

import { useEffect, useState } from 'react'

export default function TableOfContents() {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([])

  useEffect(() => {
    const elements = document.querySelectorAll('article h2, article h3')
    const items = Array.from(elements).map((el) => ({
      id: el.id,
      text: el.textContent || '',
      level: Number(el.tagName[1]),
    }))
    setHeadings(items)
  }, [])

  if (headings.length === 0) return null

  return (
    <nav className="sticky top-24 hidden xl:block">
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
        On this page
      </h4>
      <ul className="space-y-2 text-sm">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`block text-muted hover:text-accent transition-colors ${
                h.level === 3 ? 'pl-4' : ''
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
