import { getRecentPosts } from '@/lib/posts'
import AnimatedEntrance from '@/components/shared/AnimatedEntrance'
import Link from 'next/link'

const skills = ['C / C++', 'Rust', 'Python', 'Go', 'Embedded Linux', 'Next.js']

const hueStyles = {
  blue: {
    gradient: 'from-blue-500/10 via-blue-400/5 to-transparent',
    border: 'hover:border-blue-500/30',
    shadow: 'hover:shadow-blue-500/8',
    iconColor: 'group-hover:text-blue-500',
  },
  amber: {
    gradient: 'from-amber-500/10 via-amber-400/5 to-transparent',
    border: 'hover:border-amber-500/30',
    shadow: 'hover:shadow-amber-500/8',
    iconColor: 'group-hover:text-amber-500',
  },
  violet: {
    gradient: 'from-violet-500/10 via-violet-400/5 to-transparent',
    border: 'hover:border-violet-500/30',
    shadow: 'hover:shadow-violet-500/8',
    iconColor: 'group-hover:text-violet-500',
  },
}

export default async function Home() {
  const posts = await getRecentPosts(1)
  const latest = posts[0]

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 pt-24 pb-16">
      <div className="flex w-full max-w-2xl flex-col items-center gap-16">

        {/* Brand card */}
        <AnimatedEntrance direction="left" className="w-full max-w-md">
          <div className="group relative w-full overflow-hidden rounded-xl border border-border/50 bg-surface/30 backdrop-blur-xl p-6 text-center transition-all duration-500 hover:border-border/70 hover:shadow-lg hover:shadow-accent/5">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
            <div className="absolute -top-24 left-1/2 h-48 w-3/4 -translate-x-1/2 rounded-full bg-accent/[0.04] blur-3xl transition-opacity duration-500 group-hover:opacity-70" />
            <div className="absolute right-5 top-5 h-1.5 w-1.5 rounded-full bg-accent/30" />
            <span className="relative block text-xl font-bold tracking-tight text-fg">
              aphrosyne
            </span>
            <p className="relative mt-1.5 text-sm text-muted/80 font-light tracking-wide">
              Embedded systems {'&'} creative code.
            </p>
          </div>
        </AnimatedEntrance>

        {/* Asymmetric grid: Blog (2/3) + Projects (1/3) */}
        <div className="grid w-full grid-cols-[2fr_1fr] gap-4">

          {/* Blog card with latest post preview */}
          <AnimatedEntrance direction="bottom" delay={0.08} className="flex">
            <Link
              href="/blog"
              className={`group relative flex flex-1 flex-col overflow-hidden rounded-xl border border-border/50 bg-surface/30 backdrop-blur-xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${hueStyles.blue.border} ${hueStyles.blue.shadow}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-b ${hueStyles.blue.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/[0.04] text-fg/50 transition-all duration-300 group-hover:scale-110">
                  <span className={`transition-colors duration-300 ${hueStyles.blue.iconColor}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </span>
                </span>
                <div>
                  <div className={`text-sm font-semibold text-fg/90 transition-colors duration-300 group-hover:text-accent ${hueStyles.blue.iconColor}`}>
                    Blog
                  </div>
                  <div className="text-[11px] text-muted/60 leading-snug">
                    Thoughts, notes, deep dives
                  </div>
                </div>
              </div>

              {latest && (
                <div className="relative mt-4 rounded-lg border border-border/30 bg-surface/40 px-4 py-3 transition-colors duration-300 group-hover:border-accent/15">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-accent/70 uppercase tracking-widest">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent/50" />
                      Latest
                    </span>
                    {latest.date && (
                      <span className="text-[10px] text-muted/40">{latest.date}</span>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm font-medium text-fg/80 line-clamp-1 transition-colors duration-300 group-hover:text-fg">
                    {latest.title}
                  </p>
                  {latest.excerpt && (
                    <p className="mt-0.5 text-xs text-muted/50 line-clamp-1">
                      {latest.excerpt}
                    </p>
                  )}
                </div>
              )}

              <div className="relative mt-4 flex items-center gap-1 text-[11px] text-muted/30 transition-all duration-300 group-hover:text-accent/50">
                <span>Browse all posts</span>
                <svg className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </Link>
          </AnimatedEntrance>

          {/* Projects card */}
          <AnimatedEntrance direction="top" delay={0.16} className="flex">
            <Link
              href="/projects"
              className={`group relative flex flex-1 flex-col items-center gap-3 overflow-hidden rounded-xl border border-border/50 bg-surface/30 backdrop-blur-xl p-5 text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${hueStyles.amber.border} ${hueStyles.amber.shadow}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-b ${hueStyles.amber.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-accent/[0.04] text-fg/50 transition-all duration-300 group-hover:scale-110">
                <span className={`transition-colors duration-300 ${hueStyles.amber.iconColor}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                  </svg>
                </span>
              </span>
              <div className="relative">
                <div className={`text-sm font-semibold text-fg/90 transition-colors duration-300 group-hover:text-accent ${hueStyles.amber.iconColor}`}>
                  Projects
                </div>
                <div className="mt-0.5 text-[11px] text-muted/60 leading-snug">
                  Things built & tinkered
                </div>
              </div>

              <div className="relative mt-1 flex flex-col gap-1 w-full">
                {['Project Alpha', 'Aphrosyne Blog', 'CLI Toolbox'].map((name, i) => (
                  <div
                    key={name}
                    className="rounded-md border border-border/30 bg-surface/40 px-2.5 py-1 text-[10px] text-muted/50 text-left transition-colors duration-300 group-hover:border-accent/10 group-hover:text-muted/70"
                    style={{ marginLeft: `${i * 6}px`, marginRight: `${(2 - i) * 6}px` }}
                  >
                    {name}
                  </div>
                ))}
              </div>
            </Link>
          </AnimatedEntrance>
        </div>

        {/* About + Skills merged bar */}
        <AnimatedEntrance direction="right" delay={0.24} className="w-full">
          <div className="group relative w-full overflow-hidden rounded-xl border border-border/50 bg-surface/30 backdrop-blur-xl transition-all duration-300 hover:border-border/70 hover:shadow-lg hover:shadow-accent/5">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
            <div className="absolute -right-16 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-accent/[0.03] blur-2xl transition-opacity duration-500 group-hover:opacity-70" />

            <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 p-5">
              <Link
                href="/about"
                className="flex items-center gap-3 shrink-0 rounded-lg p-1.5 -m-1.5 transition-colors duration-200 hover:bg-accent/[0.03]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/[0.04] text-fg/50 transition-colors duration-300 group-hover:text-violet-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </span>
                <div>
                  <div className="text-sm font-semibold text-fg/90 transition-colors duration-300 group-hover:text-accent">
                    About
                  </div>
                  <div className="text-[11px] text-muted/60">
                    Background {'&'} experience
                  </div>
                </div>
              </Link>

              <div className="hidden sm:block w-px h-8 bg-border/40 shrink-0" />

              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-[10px] font-semibold text-muted/50 uppercase tracking-widest shrink-0">
                  Skills
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center rounded-full border border-border/40 bg-surface/40 px-2.5 py-1 text-[11px] text-muted/70 transition-all duration-200 hover:border-accent/20 hover:bg-accent/[0.04] hover:text-fg/90"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimatedEntrance>

      </div>
    </div>
  )
}
