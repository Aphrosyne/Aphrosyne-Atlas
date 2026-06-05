import { getRecentPosts } from '@/lib/posts'
import { projects } from '@/lib/projects'
import { SITE } from '@/lib/constants'
import Link from 'next/link'
import Dashboard from '@/components/home/Dashboard'

const skills = ['C / C++', 'Rust', 'Python', 'Go', 'Embedded Linux', 'Next.js']

const QUICK_LINKS = [
  { label: 'Blog', href: '/blog', desc: 'Thoughts & notes' },
  { label: 'Projects', href: '/projects', desc: 'Stuff I built' },
  { label: 'About', href: '/about', desc: 'Who I am' },
]

export default async function Home() {
  const recentPosts = await getRecentPosts(3)

  return (
    <div className="overflow-x-hidden">

      {/* ═══ SECTION 1 — Minimal Hero ═══ */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/[0.03] blur-3xl pointer-events-none" />

        <p className="text-sm text-muted/60 tracking-[0.2em] uppercase mb-3">Hello, I&apos;m</p>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-fg mb-4">
          {SITE.name}
        </h1>
        <p className="max-w-md text-base text-muted/70 leading-relaxed mb-8">
          Embedded systems &amp; creative code.
          Building at the intersection of hardware and software.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {QUICK_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-surface/30 backdrop-blur-sm px-5 py-2 text-sm text-fg/80 transition-all duration-200 hover:border-accent/40 hover:text-accent hover:-translate-y-0.5"
            >
              {l.label}
              <span className="hidden sm:inline text-[11px] text-muted/50">· {l.desc}</span>
            </Link>
          ))}
        </div>

        <a href="#content" className="flex flex-col items-center gap-2 text-[11px] text-muted/30 tracking-widest uppercase hover:text-muted/50 transition-colors cursor-pointer group">
          <span className="w-6 h-10 border-2 border-muted/20 rounded-full relative group-hover:border-muted/40 transition-colors">
            <span className="absolute top-1.5 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-accent/60 rounded-full animate-bounce" />
          </span>
          Scroll
        </a>
      </section>

      {/* ═══ SECTION 2 — Animated Bento Dashboard ═══ */}
      <Dashboard
        siteName={SITE.name}
        recentPosts={recentPosts}
        projects={projects}
        skills={skills}
      />
    </div>
  )
}
