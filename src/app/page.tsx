import { getRecentPosts } from '@/lib/posts'
import AnimatedEntrance from '@/components/shared/AnimatedEntrance'
import SkillsShowcase from '@/components/home/SkillsShowcase'
import Link from 'next/link'

const actions = [
  {
    label: 'Blog',
    desc: 'Thoughts, notes, deep dives',
    href: '/blog',
    dir: 'bottom' as const,
    delay: 0.08,
    hue: 'blue',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    label: 'Projects',
    desc: 'Things built & tinkered',
    href: '/projects',
    dir: 'top' as const,
    delay: 0.16,
    hue: 'amber',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
  {
    label: 'About',
    desc: 'Background & experience',
    href: '/about',
    dir: 'bottom' as const,
    delay: 0.24,
    hue: 'violet',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
] as const

const hueStyles = {
  blue:   { gradient: 'from-blue-500/10 via-blue-400/5 to-transparent',   border: 'hover:border-blue-500/30',   shadow: 'hover:shadow-blue-500/8',   iconColor: 'group-hover:text-blue-500' },
  amber:  { gradient: 'from-amber-500/10 via-amber-400/5 to-transparent',  border: 'hover:border-amber-500/30',  shadow: 'hover:shadow-amber-500/8',  iconColor: 'group-hover:text-amber-500' },
  violet: { gradient: 'from-violet-500/10 via-violet-400/5 to-transparent', border: 'hover:border-violet-500/30', shadow: 'hover:shadow-violet-500/8', iconColor: 'group-hover:text-violet-500' },
}

export default async function Home() {
  const posts = await getRecentPosts(1)
  const latest = posts[0]

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-16 overflow-hidden">

      {/* ══════ Banner: rotated -40°, spans across, upper-right, text scrolls along tilt ══════ */}
      <div
        className="absolute pointer-events-none overflow-hidden"
        style={{
          top: '15%',
          right: '-30%',
          width: '160vw',
          height: '56px',
          transform: 'rotate(-40deg)',
          transformOrigin: 'right center',
        }}
      >
        {/* Background + borders */}
        <div className="absolute inset-0 border-y border-border/30 bg-surface/20 backdrop-blur-sm" />
        {/* Scrolling text — rotates with parent, no italic */}
        <div
          className="flex whitespace-nowrap h-full items-center"
          style={{ animation: 'bannerScroll 25s linear infinite' }}
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="inline-flex items-center gap-10 sm:gap-14 mx-4 sm:mx-6">
              <span className="text-2xl sm:text-3xl font-bold tracking-[0.12em] text-fg/[0.05] select-none">
                Aphrosyne
              </span>
              <span className="h-2 w-2 rounded-full bg-accent/15 shrink-0" />
            </span>
          ))}
        </div>
      </div>

      {/* ══════ Cards ══════ */}
      <div className="flex w-full max-w-xl flex-col items-center gap-5 z-10">

        <AnimatedEntrance direction="left" className="w-full">
          <div className="group relative w-full overflow-hidden rounded-xl border border-border/50 bg-surface/30 backdrop-blur-xl p-6 text-center transition-all duration-500 hover:border-border/70 hover:shadow-lg hover:shadow-accent/5">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
            <div className="absolute -top-24 left-1/2 h-48 w-3/4 -translate-x-1/2 rounded-full bg-accent/[0.04] blur-3xl transition-opacity duration-500 group-hover:opacity-70" />
            <div className="absolute right-5 top-5 h-1.5 w-1.5 rounded-full bg-accent/30" />
            <span className="relative block text-xl font-bold tracking-tight text-fg">aphrosyne</span>
            <p className="relative mt-1.5 text-sm text-muted/80 font-light tracking-wide">Embedded systems &amp; creative code.</p>
          </div>
        </AnimatedEntrance>

        <div className="grid w-full grid-cols-3 gap-3 sm:gap-4">
          {actions.map((action) => {
            const s = hueStyles[action.hue]
            return (
              <AnimatedEntrance key={action.label} direction={action.dir} delay={action.delay} className="flex">
                <Link href={action.href} className={`group relative flex flex-1 flex-col items-center gap-3 overflow-hidden rounded-xl border border-border/50 bg-surface/30 backdrop-blur-xl p-5 text-center transition-all duration-300 ${s.border} ${s.shadow} hover:-translate-y-0.5 hover:shadow-lg`}>
                  <div className={`absolute inset-0 bg-gradient-to-b ${s.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-accent/[0.04] text-fg/50 transition-all duration-300 group-hover:scale-110">
                    <span className={`transition-colors duration-300 ${s.iconColor}`}>{action.icon}</span>
                  </span>
                  <div className="relative">
                    <div className={`text-sm font-semibold text-fg/90 transition-colors duration-300 group-hover:text-accent ${s.iconColor}`}>{action.label}</div>
                    <div className="mt-0.5 text-[11px] text-muted/60 leading-snug">{action.desc}</div>
                  </div>
                </Link>
              </AnimatedEntrance>
            )
          })}
        </div>

        {latest && (
          <AnimatedEntrance direction="left" delay={0.2} className="w-full">
            <Link href={`/blog/${latest.slug}`} className="group relative block w-full overflow-hidden rounded-xl border border-border/50 bg-surface/30 backdrop-blur-xl pl-5 pr-5 pt-4 pb-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/25 hover:shadow-lg hover:shadow-accent/5">
              <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-gradient-to-b from-accent/60 via-accent/40 to-transparent transition-all duration-300 group-hover:from-accent group-hover:via-accent/60" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
              <div className="absolute -right-8 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-accent/[0.03] blur-3xl transition-opacity duration-500 group-hover:opacity-70" />
              <div className="relative flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/8 px-2.5 py-0.5 text-[10px] font-semibold text-accent uppercase tracking-widest">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />Latest
                </span>
                {latest.date && <span className="text-[11px] text-muted/50">{latest.date}</span>}
              </div>
              <h3 className="relative mt-3 text-base font-semibold text-fg/90 transition-colors duration-300 group-hover:text-accent">{latest.title}</h3>
              {latest.excerpt && (
                <p className="relative mt-1.5 text-sm text-muted/60 leading-relaxed">
                  {latest.excerpt}
                  <span className="inline-flex ml-1 align-middle text-muted/25 transition-all duration-300 group-hover:text-accent group-hover:translate-x-0.5">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </p>
              )}
            </Link>
          </AnimatedEntrance>
        )}

        <AnimatedEntrance direction="right" delay={0.28} className="w-full">
          <SkillsShowcase />
        </AnimatedEntrance>
      </div>
    </div>
  )
}
