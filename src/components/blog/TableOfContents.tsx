'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'

type Heading = {
  id: string
  text: string
  level: 2 | 3
}

type TocSection = {
  heading: Heading
  children: Heading[]
}

type ScrollMetrics = {
  progress: number
  thumbPercent: number
  canScroll: boolean
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set())
  const [activeId, setActiveId] = useState('')
  const [scrollMetrics, setScrollMetrics] = useState<ScrollMetrics>({
    progress: 0,
    thumbPercent: 24,
    canScroll: false,
  })
  const listRef = useRef<HTMLUListElement>(null)
  const itemRefs = useRef(new Map<string, HTMLAnchorElement>())
  const articleRangeRef = useRef({ start: 0, end: 0 })
  const dragPointerRef = useRef<number | null>(null)

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('article h2, article h3')
    const seen = new Set<string>()
    const items = Array.from(elements)
      .filter((element) => element.id && element.textContent)
      .map((element) => ({
        id: element.id,
        text: element.textContent?.trim() || '',
        level: Number(element.tagName[1]) as 2 | 3,
      }))
      .filter((heading) => {
        if (!heading.text || seen.has(heading.id)) return false
        seen.add(heading.id)
        return true
      })

    const frame = requestAnimationFrame(() => {
      setHeadings(items)
      setActiveId(items[0]?.id ?? '')
    })

    return () => cancelAnimationFrame(frame)
  }, [])

  const sections = useMemo(() => {
    const grouped: TocSection[] = []

    for (const heading of headings) {
      if (heading.level === 2 || grouped.length === 0) {
        grouped.push({ heading, children: [] })
      } else {
        grouped[grouped.length - 1].children.push(heading)
      }
    }

    return grouped
  }, [headings])

  useEffect(() => {
    if (headings.length === 0) return

    const article = document.querySelector<HTMLElement>('article')
    if (!article) return

    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const headingElements = headings
          .map((heading) => document.getElementById(heading.id))
          .filter((element): element is HTMLElement => Boolean(element))

        const activationLine = window.scrollY + 144
        let nextActiveId = headingElements[0]?.id ?? ''
        for (const element of headingElements) {
          if (element.getBoundingClientRect().top + window.scrollY <= activationLine) {
            nextActiveId = element.id
          } else {
            break
          }
        }
        setActiveId((current) => (current === nextActiveId ? current : nextActiveId))

        const articleRect = article.getBoundingClientRect()
        const articleTop = articleRect.top + window.scrollY
        const articleBottom = articleTop + article.scrollHeight
        const documentEnd = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
        const start = clamp(articleTop - 112, 0, documentEnd)
        const end = clamp(articleBottom - window.innerHeight + 96, start, documentEnd)
        const distance = end - start
        const progress = distance > 0 ? clamp((window.scrollY - start) / distance, 0, 1) : 0
        const thumbPercent = clamp((window.innerHeight / Math.max(article.scrollHeight, 1)) * 100, 12, 38)

        articleRangeRef.current = { start, end }
        setScrollMetrics((current) => {
          const next = { progress, thumbPercent, canScroll: distance > 1 }
          return current.progress === next.progress &&
            current.thumbPercent === next.thumbPercent &&
            current.canScroll === next.canScroll
            ? current
            : next
        })
      })
    }

    const resizeObserver = new ResizeObserver(update)
    resizeObserver.observe(article)
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [headings])

  useEffect(() => {
    const list = listRef.current
    if (!list || !activeId) return

    const activeSection = sections.find(
      (section) => section.heading.id === activeId || section.children.some((child) => child.id === activeId),
    )
    const visibleId = activeSection && collapsedIds.has(activeSection.heading.id) ? activeSection.heading.id : activeId
    const item = itemRefs.current.get(visibleId)
    if (!item) return

    const listRect = list.getBoundingClientRect()
    const itemRect = item.getBoundingClientRect()
    if (itemRect.top < listRect.top) {
      list.scrollTop -= listRect.top - itemRect.top + 8
    } else if (itemRect.bottom > listRect.bottom) {
      list.scrollTop += itemRect.bottom - listRect.bottom + 8
    }
  }, [activeId, collapsedIds, sections])

  const scrollToProgress = useCallback((progress: number) => {
    const { start, end } = articleRangeRef.current
    window.scrollTo({ top: start + (end - start) * clamp(progress, 0, 1), behavior: 'auto' })
  }, [])

  const updateFromPointer = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect()
      const thumbHeight = rect.height * (scrollMetrics.thumbPercent / 100)
      const availableHeight = Math.max(1, rect.height - thumbHeight)
      const thumbTop = event.clientY - rect.top - thumbHeight / 2
      scrollToProgress(thumbTop / availableHeight)
    },
    [scrollMetrics.thumbPercent, scrollToProgress],
  )

  const handleRailKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const increments: Partial<Record<string, number>> = {
      ArrowUp: -0.03,
      ArrowDown: 0.03,
      PageUp: -0.12,
      PageDown: 0.12,
    }

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      scrollToProgress(event.key === 'Home' ? 0 : 1)
      return
    }

    const increment = increments[event.key]
    if (increment !== undefined) {
      event.preventDefault()
      scrollToProgress(scrollMetrics.progress + increment)
    }
  }

  const toggleSection = (id: string) => {
    setCollapsedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (headings.length === 0) return null

  return (
    <nav
      aria-label="文章目录"
      className="sticky top-24 flex max-h-[calc(100vh-7rem)] flex-col overflow-hidden rounded-xl border border-border/60 bg-surface/50 p-3 backdrop-blur-sm"
    >
      <h2 className="mb-3 px-1 text-xs tracking-wider text-fg/40 uppercase">目录</h2>
      <div className="flex min-h-0 gap-2">
        <ul
          ref={listRef}
          className="min-w-0 flex-1 space-y-1 overflow-y-auto overscroll-contain pr-1 text-sm [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {sections.map((section, index) => {
            const hasChildren = section.children.length > 0
            const isCollapsed = collapsedIds.has(section.heading.id)
            const isSectionActive =
              section.heading.id === activeId || section.children.some((child) => child.id === activeId)
            const groupId = `toc-section-${index}`

            return (
              <li key={section.heading.id}>
                <div className={`flex min-w-0 items-center rounded-lg ${isSectionActive ? 'bg-accent/10' : ''}`}>
                  <a
                    ref={(node) => {
                      if (node) itemRefs.current.set(section.heading.id, node)
                      else itemRefs.current.delete(section.heading.id)
                    }}
                    href={`#${section.heading.id}`}
                    title={section.heading.text}
                    aria-current={section.heading.id === activeId ? 'location' : undefined}
                    className={`min-w-0 flex-1 truncate rounded-lg px-2 py-2 leading-relaxed transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent ${
                      isSectionActive ? 'font-medium text-accent' : 'text-fg/60 hover:text-accent'
                    }`}
                  >
                    {section.heading.text}
                  </a>
                  {hasChildren && (
                    <button
                      type="button"
                      aria-label={`${isCollapsed ? '展开' : '收起'}“${section.heading.text}”下的三级标题`}
                      aria-expanded={!isCollapsed}
                      aria-controls={groupId}
                      onClick={() => toggleSection(section.heading.id)}
                      className="mr-0.5 grid size-8 shrink-0 place-items-center rounded-lg text-fg/45 transition-colors hover:bg-surface hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                        className={`size-4 transition-transform ${isCollapsed ? '-rotate-90' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="m5.5 7.5 4.5 4.5 4.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  )}
                </div>
                {hasChildren && !isCollapsed && (
                  <ul id={groupId} className="ml-2 border-l border-border/60 pl-2">
                    {section.children.map((child) => (
                      <li key={child.id}>
                        <a
                          ref={(node) => {
                            if (node) itemRefs.current.set(child.id, node)
                            else itemRefs.current.delete(child.id)
                          }}
                          href={`#${child.id}`}
                          title={child.text}
                          aria-current={child.id === activeId ? 'location' : undefined}
                          className={`block truncate rounded-md px-2 py-1.5 text-xs leading-relaxed transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent ${
                            child.id === activeId ? 'bg-accent/10 font-medium text-accent' : 'text-fg/50 hover:text-accent'
                          }`}
                        >
                          {child.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>

        {scrollMetrics.canScroll && (
          <div
            role="scrollbar"
            tabIndex={0}
            aria-label="文章快速滚动"
            aria-controls="article-content"
            aria-orientation="vertical"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(scrollMetrics.progress * 100)}
            title="拖动以快速滚动文章"
            onKeyDown={handleRailKeyDown}
            onPointerDown={(event) => {
              dragPointerRef.current = event.pointerId
              event.currentTarget.setPointerCapture(event.pointerId)
              updateFromPointer(event)
            }}
            onPointerMove={(event) => {
              if (dragPointerRef.current === event.pointerId) updateFromPointer(event)
            }}
            onPointerUp={(event) => {
              dragPointerRef.current = null
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId)
              }
            }}
            onPointerCancel={() => {
              dragPointerRef.current = null
            }}
            className="relative min-h-36 w-3 shrink-0 touch-none cursor-pointer rounded-full bg-fg/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span
              aria-hidden="true"
              className="absolute inset-x-0 rounded-full bg-accent/55 shadow-[0_0_10px_color-mix(in_srgb,var(--color-accent)_35%,transparent)] transition-colors hover:bg-accent/75"
              style={{
                height: `${scrollMetrics.thumbPercent}%`,
                top: `${scrollMetrics.progress * (100 - scrollMetrics.thumbPercent)}%`,
              }}
            />
          </div>
        )}
      </div>
    </nav>
  )
}
