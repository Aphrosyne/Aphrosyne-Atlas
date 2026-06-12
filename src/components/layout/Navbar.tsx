'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_ITEMS } from '@/lib/constants'
import SearchModal from '@/components/layout/SearchModal'

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
  const pathname = usePathname()
  const active = isParentActive(pathname, href)
  const [open, setOpen] = useState(false)
  const timer = useRef<number>(0)

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
      ? 'bg-accent text-white shadow-sm'
      : 'text-fg/60 hover:text-fg'

  return (
    <>
      {/* Mobile: plain link, no dropdown */}
      <Link
        href={href}
        className={`md:hidden rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors ${
          active ? 'bg-accent text-white shadow-sm' : 'text-fg/60'
        }`}
      >
        {label}
      </Link>

      {/* Desktop: link with hover dropdown */}
      <div
        className="hidden md:block relative"
        onMouseEnter={onEnterTrigger}
        onMouseLeave={onLeaveTrigger}
      >
        <Link
          href={href}
          aria-expanded={open}
          className={`flex items-center gap-1 rounded-full px-4 py-1.5 text-[13px] font-semibold select-none transition-colors ${triggerClass}`}
        >
          {label}
          <svg
            className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </Link>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
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
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent pt-3">
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
            className="absolute -inset-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-spin"
            style={{
              clipPath: 'url(#avatar-clip)',
              background: 'var(--color-avatar-ring)',
              animationDuration: '4s',
            }}
          />
          <img
            src="/images/avatar/avatar.jpg"
            alt="Avatar"
            className="relative w-12 h-12 object-cover"
            style={{ clipPath: 'url(#avatar-clip)' }}
          />
        </Link>

        {/* Pill navigation */}
        <div className="flex items-center gap-0.5 bg-surface/50 backdrop-blur-xl border border-border/10 rounded-full px-1 py-1 shadow-sm">
          {NAV_ITEMS.map((item) => {
            if ('children' in item && item.children) {
              return (
                <NavDropdown
                  key={item.href}
                  label={item.label}
                  href={item.href}
                  children={item.children}
                />
              )
            }
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors ${
                  isActive
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-fg/60 hover:text-fg'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* Search */}
        <button
          onClick={() => setSearchOpen(true)}
          className="relative w-12 h-12 flex items-center justify-center text-fg/40 hover:text-fg transition-colors cursor-pointer group"
          aria-label="搜索"
        >
          <span
            className="absolute -inset-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-spin"
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
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  )
}
