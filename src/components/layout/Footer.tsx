import Link from 'next/link'
import { SITE } from '@/lib/constants'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto px-4 pb-4">
      <div className="mx-auto max-w-5xl rounded-2xl bg-black/50 backdrop-blur-md border border-white/10 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left block — copyright + links */}
        <span className="text-xs text-white/50">&copy; {year} {SITE.name}. All rights reserved.</span>
      </div>
    </footer>
  )
}
