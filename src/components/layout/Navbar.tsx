'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS } from '@/lib/constants'

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 h-14">
        {/* Logo */}
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-fg/70 hover:text-accent transition-colors"
        >
          aphrosyne
        </Link>

        {/* Pill navigation */}
        <div className="flex items-center gap-0.5 bg-white/60 border border-black/5 rounded-full px-1 py-1 shadow-sm">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-muted/60 hover:text-fg'
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
