import Link from 'next/link'
import { SITE } from '@/lib/constants'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto px-4 pb-4">
      <div className="mx-auto max-w-5xl rounded-2xl bg-black/50 backdrop-blur-md border border-white/10 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left block — copyright + links */}
        <div className="flex items-center gap-3 text-xs text-white/50">
          <span>&copy; {year} {SITE.name}. All rights reserved.</span>
          <span className="text-white/10">|</span>
          <Link href="/blog" className="hover:text-white/80 transition-colors">Blog</Link>
          <Link href="/projects" className="hover:text-white/80 transition-colors">Projects</Link>
          <Link href="/about" className="hover:text-white/80 transition-colors">About</Link>
        </div>

        {/* Right block — credits + ICP */}
        <div className="flex items-center gap-3 text-[11px] text-white/30">
          <span>Built with Next.js & Tailwind CSS</span>
          <span className="text-white/10">|</span>
          <span>ICP 备 XXXXXXXX 号-1</span>
        </div>
      </div>
    </footer>
  )
}
