'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { useEffect } from 'react'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Force light mode — clear any stale dark cookie/localStorage
  useEffect(() => {
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add('light')
    try { localStorage.removeItem('theme') } catch {}
    try { localStorage.setItem('theme', 'light') } catch {}
  }, [])

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      forcedTheme="light"
      enableSystem={false}
    >
      {children}
    </NextThemesProvider>
  )
}
