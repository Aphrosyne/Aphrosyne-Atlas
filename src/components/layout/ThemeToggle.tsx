'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="grid size-11 cursor-pointer place-items-center rounded-xl text-xl text-fg/50 transition-colors duration-300 hover:bg-surface/70 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      aria-label="切换主题"
    >
      {mounted ? (theme === 'dark' ? '☾' : '☀') : ' '}
    </button>
  )
}
