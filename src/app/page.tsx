import { getRecentPosts } from '@/lib/posts'
import { projects } from '@/lib/projects'
import { SITE } from '@/lib/constants'
import Dashboard from '@/components/home/Dashboard'
import HeroLinks from '@/components/home/HeroLinks'

const skills = ['C / C++', 'Rust', 'Python', 'Go', 'Embedded Linux', 'Next.js']

export default async function Home() {
  const recentPosts = await getRecentPosts(3)

  return (
    <div className="overflow-x-hidden">

      {/* ═══ SECTION 1 — Minimal Hero ═══ */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-accent/3 blur-3xl pointer-events-none" />

        <p className="text-sm text-white/60 tracking-[0.2em] uppercase mb-3">Hello, I&apos;m</p>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-4">
          {SITE.name}
        </h1>
        <p className="max-w-md text-base text-white/70 leading-relaxed mb-8">
          Embedded systems &amp; creative code.
          Building at the intersection of hardware and software.
        </p>

        <HeroLinks />

        <a href="#content" className="flex flex-col items-center gap-2 text-[11px] text-white/30 tracking-widest uppercase hover:text-white/50 transition-colors cursor-pointer group">
          <span className="w-6 h-10 border-2 border-white/20 rounded-full relative group-hover:border-white/40 transition-colors">
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
