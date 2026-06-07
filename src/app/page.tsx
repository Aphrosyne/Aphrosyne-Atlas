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
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-accent/3 blur-3xl pointer-events-none" />

        {/* ══════ Scrolling Banner ══════ */}
        <div
          className="absolute pointer-events-none overflow-hidden"
          style={{
            bottom: '15%',
            left: '-30%',
            width: '160vw',
            height: '56px',
            transform: 'rotate(-40deg)',
            transformOrigin: 'left center',
            filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.12)) drop-shadow(0 2px 4px rgba(0,0,0,0.06))',
          }}
        >
          <div className="absolute inset-0 rounded-md border-y border-border/40 bg-surface/25 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04),inset_0_-1px_0_rgba(0,0,0,0.06)]" />
          <div className="absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-surface/40 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-r from-transparent to-surface/40 z-10 pointer-events-none" />
          <div
            className="banner-track flex whitespace-nowrap h-full items-center"
            style={{ animation: 'bannerScroll 28s linear infinite', willChange: 'transform' }}
          >
            {[...Array(2)].map((_, copy) => (
              <span key={copy} className="inline-flex items-center">
                {Array.from({ length: 24 }).map((_, i) => (
                  <span key={i} className="inline-flex items-center gap-10 sm:gap-14 mx-4 sm:mx-6">
                    <span className="text-2xl sm:text-3xl font-bold tracking-[0.12em] bg-gradient-to-r from-fg/5 via-fg/15 to-fg/5 bg-clip-text text-transparent select-none">
                      Aphrosyne
                    </span>
                    <span className="h-2 w-2 rounded-full bg-accent/25 shrink-0" />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

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
