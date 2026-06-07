'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_ITEMS } from '@/lib/constants'

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
    ? 'bg-white/10 text-white'
    : active
      ? 'bg-accent text-white shadow-sm'
      : 'text-white/60 hover:text-white'

  return (
    <>
      {/* Mobile: plain link, no dropdown */}
      <Link
        href={href}
        className={`md:hidden rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
          active ? 'bg-accent text-white shadow-sm' : 'text-white/60'
        }`}
      >
        {label}
      </Link>

      {/* Desktop: hover dropdown */}
      <div
        className="hidden md:block relative"
        onMouseEnter={onEnterTrigger}
        onMouseLeave={onLeaveTrigger}
      >
        <div
          className={`flex items-center gap-1 rounded-full px-4 py-1.5 text-[13px] font-medium cursor-pointer select-none transition-colors ${triggerClass}`}
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
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onMouseEnter={onEnterMenu}
              onMouseLeave={onLeaveMenu}
              className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 min-w-[150px] rounded-2xl bg-black/50 backdrop-blur-md border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.3)] overflow-hidden"
            >
              {children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="block px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
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

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 h-14">
        {/* Logo */}
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-white/70 hover:text-accent transition-colors"
        >
          aphrosyne
        </Link>

        {/* Pill navigation */}
        <div className="flex items-center gap-0.5 bg-black/50 backdrop-blur-md border border-white/10 rounded-full px-1 py-1 shadow-sm">
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
                className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* Spacer */}
        <div className="w-16" />
      </nav>
    </header>
  )
}
