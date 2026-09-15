'use client'

import type { KeyboardEvent, ReactNode } from 'react'

export default function ArticleScrollRegion({ children, label }: { children: ReactNode; label: string }) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const region = event.currentTarget
    const step = Math.max(48, Math.floor(region.clientWidth * 0.75))

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      region.scrollBy({ left: -step })
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      region.scrollBy({ left: step })
    } else if (event.key === 'Home') {
      event.preventDefault()
      region.scrollTo({ left: 0 })
    } else if (event.key === 'End') {
      event.preventDefault()
      region.scrollTo({ left: region.scrollWidth })
    }
  }

  return (
    <div
      className="article-scroll-region"
      tabIndex={0}
      role="region"
      aria-label={label}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  )
}
