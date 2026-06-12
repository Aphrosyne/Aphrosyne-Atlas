import Link from 'next/link'
import { SITE } from '@/lib/constants'
import ThemeToggle from './ThemeToggle'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto px-4 pb-4">
      <div className="mx-auto max-w-5xl rounded-2xl bg-surface/50 backdrop-blur-xl border border-bg/10 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="text-md text-fg/80">&copy; {year} {SITE.name}. All rights reserved.</span>
        <ThemeToggle />
      </div>
    </footer>
  )
}
