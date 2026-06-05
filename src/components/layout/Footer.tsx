import Link from 'next/link'
import { SITE } from '@/lib/constants'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-black/5 bg-white/40 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left block — copyright + links */}
        <div className="flex items-center gap-3 text-xs text-muted/50">
          <span>&copy; {year} {SITE.name}. All rights reserved.</span>
          <span className="text-black/10">|</span>
          <Link href="/blog" className="hover:text-muted/80 transition-colors">Blog</Link>
          <Link href="/projects" className="hover:text-muted/80 transition-colors">Projects</Link>
          <Link href="/about" className="hover:text-muted/80 transition-colors">About</Link>
        </div>

        {/* Right block — credits + ICP */}
        <div className="flex items-center gap-3 text-[11px] text-muted/30">
          <span>Built with Next.js & Tailwind CSS</span>
          <span className="text-black/10">|</span>
          <span>ICP 备 XXXXXXXX 号-1</span>
        </div>
      </div>
    </footer>
  )
}
