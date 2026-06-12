'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="text-xl text-fg/50 hover:text-accent transition-colors cursor-pointer"
      aria-label="切换主题"
    >
      {mounted ? (theme === 'dark' ? '☾' : '☀') : ' '}
    </button>
  )
}
