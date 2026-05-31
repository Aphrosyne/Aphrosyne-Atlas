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
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    label: 'Projects',
    desc: 'Things built & tinkered',
    href: '/projects',
    dir: 'top' as const,
    delay: 0.16,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
  {
    label: 'About',
    desc: 'Background & experience',
    href: '/about',
    dir: 'bottom' as const,
    delay: 0.24,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
]

export default async function Home() {
  const posts = await getRecentPosts(1)
  const latest = posts[0]

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="flex w-full max-w-lg flex-col items-center gap-3">

        {/* Brand card — flies in from left */}
        <AnimatedEntrance direction="left" className="w-full">
          <div className="w-full rounded-lg border border-border bg-surface/40 p-5 text-center">
            <span className="text-lg font-semibold tracking-tight">aphrosyne</span>
            <p className="mt-0.5 text-sm text-muted">
              Embedded systems &amp; creative code.
            </p>
          </div>
        </AnimatedEntrance>

        {/* Action cards — 3-column grid, each card flies in from its own direction */}
        <div className="grid w-full grid-cols-3 gap-3">
          {actions.map((action) => (
            <AnimatedEntrance
              key={action.label}
              direction={action.dir}
              delay={action.delay}
              className="flex"
            >
              <Link
                href={action.href}
                className="group flex flex-1 flex-col items-center gap-2 rounded-lg border border-border bg-surface/40 p-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-sm"
              >
                <span className="text-fg/70 group-hover:text-accent transition-colors">
                  {action.icon}
                </span>
                <div>
                  <div className="text-sm font-semibold text-fg group-hover:text-accent transition-colors">
                    {action.label}
                  </div>
                  <div className="mt-0.5 text-[11px] text-muted leading-tight">
                    {action.desc}
                  </div>
                </div>
              </Link>
            </AnimatedEntrance>
          ))}
        </div>

        {/* Latest post card — flies in from left */}
        {latest && (
          <AnimatedEntrance direction="left" delay={0.2} className="w-full">
            <Link
              href={`/blog/${latest.slug}`}
              className="group flex w-full rounded-lg border border-border bg-surface/40 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted uppercase tracking-wider">
                  Latest Post
                </span>
                <span className="text-[11px] text-muted">{latest.date}</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-sm font-semibold text-fg group-hover:text-accent transition-colors">
                  {latest.title}
                </span>
                <svg
                  className="ml-2 w-4 h-4 text-muted group-hover:text-accent transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="mt-1 text-xs text-muted leading-relaxed line-clamp-1">
                {latest.excerpt}
              </p>
            </Link>
          </AnimatedEntrance>
        )}

        {/* Skills card — flies in from right */}
        <AnimatedEntrance direction="right" delay={0.28} className="w-full">
          <SkillsShowcase />
        </AnimatedEntrance>

      </div>
    </div>
  )
}
