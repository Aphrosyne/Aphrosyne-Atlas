'use client'

import { useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useMotionPolicy } from '@/lib/use-motion-policy'

const THEME_CHOICES = [
  { value: 'system', label: '跟随系统' },
  { value: 'light', label: '浅色' },
  { value: 'dark', label: '深色' },
] as const

const motionTransition = {
  duration: 0.22,
  ease: [0.22, 1, 0.36, 1],
} as const

export default function BackToTop() {
  const { shouldReduceMotion, scrollBehavior } = useMotionPolicy()
  const { theme, setTheme } = useTheme()
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)
  const scrollRaf = useRef(0)
  const toolRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const themeButtonRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()

  useEffect(() => {
    let last = false
    const handleScroll = () => {
      cancelAnimationFrame(scrollRaf.current)
      scrollRaf.current = requestAnimationFrame(() => {
        const over = window.scrollY > 400
        if (over !== last) {
          last = over
          setVisible(over)
        }
      })
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(scrollRaf.current)
    }
  }, [])

  useEffect(() => {
    if (!open) return

    const focusRaf = requestAnimationFrame(() => {
      const selected = menuRef.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]')
      const firstItem = menuRef.current?.querySelector<HTMLButtonElement>('[role="menuitemradio"]')
      ;(selected ?? firstItem)?.focus()
    })

    const handlePointerDown = (event: PointerEvent) => {
      if (!toolRef.current?.contains(event.target as Node)) setOpen(false)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      setOpen(false)
      themeButtonRef.current?.focus()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      cancelAnimationFrame(focusRaf)
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const handleMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return

    const items = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]'),
    )
    if (!items.length) return

    event.preventDefault()
    const currentIndex = Math.max(0, items.indexOf(document.activeElement as HTMLButtonElement))
    const nextIndex =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? items.length - 1
          : event.key === 'ArrowDown'
            ? (currentIndex + 1) % items.length
            : (currentIndex - 1 + items.length) % items.length
    items[nextIndex]?.focus()
  }

  const selectTheme = (choice: (typeof THEME_CHOICES)[number]['value']) => {
    setTheme(choice)
    themeButtonRef.current?.focus()
    setOpen(false)
  }

  return (
    <div
      ref={toolRef}
      className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-[var(--z-nav)] sm:right-6 sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom))]"
    >
      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-label="选择主题"
            aria-orientation="vertical"
            onKeyDown={handleMenuKeyDown}
            initial={shouldReduceMotion ? false : { opacity: 0, x: 8, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 6, scale: 0.98 }}
            transition={shouldReduceMotion ? { duration: 0 } : motionTransition}
            style={{ transformOrigin: 'right bottom' }}
            className="absolute right-[calc(100%+0.5rem)] bottom-0 flex w-32 flex-col gap-0.5 rounded-2xl border border-border/30 bg-surface/95 p-1.5 shadow-lg backdrop-blur-xl"
          >
            {THEME_CHOICES.map((choice) => {
              const selected = theme === choice.value

              return (
                <button
                  key={choice.value}
                  type="button"
                  role="menuitemradio"
                  aria-checked={selected}
                  tabIndex={selected || (!THEME_CHOICES.some((item) => item.value === theme) && choice.value === 'system') ? 0 : -1}
                  onClick={() => selectTheme(choice.value)}
                  className={`flex min-h-11 w-full cursor-pointer items-center justify-between rounded-xl px-3 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none ${
                    selected
                      ? 'bg-accent-fill text-on-accent'
                      : 'text-fg/75 hover:bg-fg/8 hover:text-fg'
                  }`}
                >
                  <span>{choice.label}</span>
                  <svg
                    aria-hidden="true"
                    className={`size-3.5 transition-opacity duration-200 motion-reduce:transition-none ${selected ? 'opacity-100' : 'opacity-0'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
                  </svg>
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <div
        role="group"
        aria-label="阅读工具"
        className="flex flex-col overflow-hidden rounded-[1.4375rem] border border-border/30 bg-surface/90 shadow-lg backdrop-blur-xl"
      >
        <AnimatePresence initial={false}>
          {visible && (
            <motion.div
              key="back-to-top"
              initial={shouldReduceMotion ? false : { height: 0, opacity: 0, y: 4 }}
              animate={{ height: 44, opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { height: 0, opacity: 0 } : { height: 0, opacity: 0, y: 4 }}
              transition={shouldReduceMotion ? { duration: 0 } : motionTransition}
              className="overflow-hidden"
            >
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: scrollBehavior })
                  themeButtonRef.current?.focus({ preventScroll: true })
                }}
                className="grid size-11 cursor-pointer place-items-center border-b border-border/30 bg-accent-fill text-on-accent transition-colors duration-200 hover:brightness-110 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
                aria-label="返回顶部"
              >
                <svg
                  aria-hidden="true"
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          ref={themeButtonRef}
          type="button"
          onClick={() => setOpen((expanded) => !expanded)}
          aria-controls={menuId}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label={open ? '收起主题菜单' : '打开主题菜单'}
          className="grid size-11 cursor-pointer place-items-center text-fg/75 transition-colors duration-200 hover:bg-fg/8 hover:text-fg focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
        >
          <svg
            aria-hidden="true"
            className="size-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2m0 14v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M3 12h2m14 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
            />
            <circle cx="12" cy="12" r="4" />
          </svg>
        </button>
      </div>
    </div>
  )
}
