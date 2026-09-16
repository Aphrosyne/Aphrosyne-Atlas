'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_ITEMS, SITE } from '@/config/site'
import { publicPath, sitePathname } from '@/lib/public-path'
import SearchModal from '@/components/layout/SearchModal'
import { useMotionPolicy } from '@/lib/use-motion-policy'

/** Generate SVG path for superellipse |x|^n + |y|^n = 1 (objectBoundingBox coords) */
function superellipsePath(n: number, points = 48): string {
  const coords: string[] = []
  for (let i = 0; i < points; i++) {
    const t = (i / points) * Math.PI * 2
    const ct = Math.cos(t)
    const st = Math.sin(t)
    const x = 0.5 + 0.5 * Math.pow(Math.abs(ct), 2 / n) * Math.sign(ct)
    const y = 0.5 + 0.5 * Math.pow(Math.abs(st), 2 / n) * Math.sign(st)
    coords.push(`${x.toFixed(5)},${y.toFixed(5)}`)
  }
  return `M ${coords.join(' L ')} Z`
}

const AVATAR_CLIP_PATH = superellipsePath(3)

function isParentActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(href + '/')
}

function NavDropdown({
  label,
  href,
  children,
}: {
  label: string
  href: string
  children: readonly { label: string; href: string }[]
}) {
  const { shouldReduceMotion } = useMotionPolicy()
  const pathname = sitePathname(usePathname())
  const active = isParentActive(pathname, href)
  const [open, setOpen] = useState(false)
  const timer = useRef<number>(0)
  const menuId = `desktop-navigation-${href.replaceAll('/', '-').replaceAll('?', '-')}`

  const onEnterTrigger = () => {
    clearTimeout(timer.current)
    setOpen(true)
  }
  const onLeaveTrigger = () => {
    timer.current = window.setTimeout(() => setOpen(false), 150)
  }
  const onEnterMenu = () => clearTimeout(timer.current)
  const onLeaveMenu = () => setOpen(false)

  const triggerClass = open
    ? 'bg-fg/10 text-fg'
    : active
      ? 'bg-accent-fill text-on-accent shadow-sm'
      : 'text-fg/60 hover:text-fg'

  return (
    <>
      {/* Mobile: plain link, no dropdown */}
      <Link
        href={href}
        className={`md:hidden rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors ${
          active ? 'bg-accent-fill text-on-accent shadow-sm' : 'text-fg/60'
        }`}
      >
        {label}
      </Link>

      {/* Desktop: parent navigation and child navigation have separate controls. */}
      <div
        className="hidden md:block relative"
        onMouseEnter={onEnterTrigger}
        onMouseLeave={onLeaveTrigger}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
        }}
      >
        <div className={`flex items-center rounded-full ${triggerClass}`}>
          <Link
            href={href}
            aria-current={active ? 'page' : undefined}
            className="rounded-l-full py-1.5 pl-4 pr-1 text-[13px] font-semibold select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            {label}
          </Link>
          <button
            type="button"
            aria-label={`展开${label}子导航`}
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((expanded) => !expanded)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') setOpen(false)
            }}
            className="rounded-r-full py-1.5 pl-1 pr-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <svg
              className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              id={menuId}
              initial={shouldReduceMotion ? false : { opacity: 0, y: -4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.95 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' }}
              onMouseEnter={onEnterMenu}
              onMouseLeave={onLeaveMenu}
              className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 min-w-37.5 rounded-2xl bg-bg/50 backdrop-blur-md border border-border/10 shadow-[0_15px_35px_rgba(0,0,0,0.3)] overflow-hidden"
            >
              {children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="block px-4 py-2.5 text-sm text-fg/80 hover:text-fg hover:bg-fg/10 transition-colors font-semibold"
                >
                  {child.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default function Navbar() {
  const { shouldReduceMotion } = useMotionPolicy()
  const pathname = sitePathname(usePathname())
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const searchButtonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLElement>(null)
  const handleCloseSearch = useCallback(() => setSearchOpen(false), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    if (!menuOpen) return

    const previousOverflow = document.body.style.overflow
    const trigger = menuButtonRef.current
    const focusableSelector = 'a[href], button:not([disabled])'
    const focusFirstItem = () => menuRef.current?.querySelector<HTMLElement>(focusableSelector)?.focus()
    const focusFrame = window.requestAnimationFrame(focusFirstItem)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeMenu()
        return
      }
      if (event.key !== 'Tab' || !menuRef.current) return

      const focusable = Array.from(menuRef.current.querySelectorAll<HTMLElement>(focusableSelector))
      const first = focusable[0]
      const last = focusable.at(-1)
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    const closeAtDesktopBreakpoint = () => {
      if (window.matchMedia('(min-width: 768px)').matches) closeMenu()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', closeAtDesktopBreakpoint)
    return () => {
      document.body.style.overflow = previousOverflow
      window.cancelAnimationFrame(focusFrame)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', closeAtDesktopBreakpoint)
      trigger?.focus()
    }
  }, [closeMenu, menuOpen])

  return (
    <header className="sticky top-0 z-[60] w-full bg-transparent pt-3">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 h-12">
        {/* Avatar - superellipse |x|^3 + |y|^3 = 1 */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <clipPath id="avatar-clip" clipPathUnits="objectBoundingBox">
              <path d={AVATAR_CLIP_PATH} />
            </clipPath>
          </defs>
        </svg>
        <Link href="/" className="shrink-0 relative group">
          {/* Rotating purple border ring on hover */}
          <div
            className="absolute -inset-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 motion-reduce:animate-none animate-spin"
            style={{
              clipPath: 'url(#avatar-clip)',
              background: 'var(--color-avatar-ring)',
              animationDuration: '4s',
            }}
          />
          {/* Static export avatar: publicPath and SVG clip-path require a native image element. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={publicPath(SITE.assets.avatar)}
            alt="Avatar"
            className="relative w-12 h-12 object-cover"
            style={{ clipPath: 'url(#avatar-clip)' }}
          />
        </Link>

        {/* Desktop pill navigation */}
        <div className="hidden items-center gap-0.5 rounded-full border border-border/10 bg-surface/50 px-1 py-1 shadow-sm backdrop-blur-xl md:flex">
          {NAV_ITEMS.map((item) => {
            if ('children' in item && item.children) {
              return (
                <NavDropdown
                  key={item.href}
                  label={item.label}
                  href={item.href}
                >
                  {item.children}
                </NavDropdown>
              )
            }
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors ${
                  isActive
                    ? 'bg-accent-fill text-on-accent shadow-sm'
                    : 'text-fg/60 hover:text-fg'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
        {/* Mobile navigation: keep touch targets intact instead of squeezing every label into the header. */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          ref={menuButtonRef}
          className="grid size-11 place-items-center rounded-2xl border border-border/20 bg-surface/65 text-fg/75 shadow-sm backdrop-blur-xl transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus md:hidden"
          aria-label={menuOpen ? '关闭导航菜单' : '打开导航菜单'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            {menuOpen
              ? <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" />
              : <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>

        {/* Search */}
        <button
          ref={searchButtonRef}
          onClick={() => setSearchOpen(true)}
          className="relative w-12 h-12 flex items-center justify-center text-fg/40 hover:text-fg transition-colors cursor-pointer group"
          aria-label="搜索"
        >
          <span
            className="absolute -inset-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 motion-reduce:animate-none animate-spin"
            style={{
              clipPath: 'url(#avatar-clip)',
              background: 'var(--color-accent)',
              animationDuration: '4s',
            }}
          />
          <span
            className="absolute inset-0 bg-surface/50 backdrop-blur-xl transition-colors"
            style={{ clipPath: 'url(#avatar-clip)' }}
          />
          <svg className="relative w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </nav>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.18, ease: 'easeOut' }}
            className="fixed inset-0 z-[60] bg-black/35 md:hidden"
          >
            <div className="absolute inset-0" aria-hidden="true" onClick={closeMenu} />
            <motion.nav
              id="mobile-navigation"
              ref={menuRef}
              role="dialog"
              aria-modal="true"
              aria-label="主导航"
              initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.18, ease: 'easeOut' }}
              className="absolute inset-x-4 top-3 max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-3xl border border-border/20 bg-surface/95 p-2 shadow-[0_18px_45px_rgba(0,0,0,0.22)] backdrop-blur-xl"
            >
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm font-semibold text-fg">导航</span>
                <button type="button" onClick={closeMenu} className="grid size-11 place-items-center rounded-2xl text-fg/70 transition-colors hover:bg-fg/8 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus" aria-label="关闭导航菜单">
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>
            {NAV_ITEMS.map((item) => {
              const active = isParentActive(pathname, item.href)
              return (
                <div key={item.href} className="border-b border-border/15 last:border-b-0">
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={`flex min-h-11 items-center rounded-2xl px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
                      active ? 'bg-accent-fill text-on-accent' : 'text-fg/75 hover:bg-fg/8 hover:text-fg'
                    }`}
                  >
                    {item.label}
                  </Link>
                  {'children' in item && item.children && (
                    <div className="mb-2 grid grid-cols-2 gap-1 px-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMenuOpen(false)}
                          className="flex min-h-11 items-center rounded-xl px-3 text-sm text-fg/65 transition-colors hover:bg-fg/8 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
      <SearchModal open={searchOpen} onClose={handleCloseSearch} triggerRef={searchButtonRef} />
    </header>
  )
}
