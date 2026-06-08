'use client'

import { useEffect, useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import Link from 'next/link'
import socialIcons from '@/components/shared/SocialIcons'
import TagCloud from '@/components/home/TagCloud'
import { SOCIAL_LINKS } from '@/lib/constants'
import type { PostMetadata } from '@/types/post'

const TECH_TAGS = ['Rust', 'Next.js', 'Embedded', 'CLI', 'React', 'Tailwind', 'Linux', 'TypeScript']

interface DashboardProps {
  siteName: string
  recentPosts: PostMetadata[]
  projects: { slug: string; title: string; description: string }[]
}

function superellipsePath(n: number, points = 48): string {
  const coords: string[] = []
  for (let i = 0; i < points; i++) {
    const t = (i / points) * Math.PI * 2
    const ct = Math.cos(t)
    const st = Math.sin(t)
    const x = 0.5 + 0.5 * Math.pow(Math.abs(ct), 2 / n) * Math.sign(ct)
    const y = 0.5 + 0.5 * Math.pow(Math.abs(st), 2 / n) * Math.sign(st)
    coords.push(`${x.toFixed(5)},${y.toFixed(5)}`)
  }
  return `M ${coords.join(' L ')} Z`
}

const AVATAR_CLIP_PATH = superellipsePath(3)

/* ─── Animation Variants ─── */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
}

type Direction = 'left' | 'right' | 'top' | 'bottom'

const EXPO_EASE = [0.16, 1, 0.3, 1] as const

const CARD_VARIANTS: Record<Direction, Variants> = {
  left:   { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5, ease: EXPO_EASE } } },
  right:  { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5, ease: EXPO_EASE } } },
  top:    { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5, ease: EXPO_EASE } } },
  bottom: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5, ease: EXPO_EASE } } },
}

const GLASS =
  'rounded-3xl overflow-hidden ' +
  'bg-white/3 backdrop-blur-[15px] ' +
  'border-t border-t-white/20 border-b border-b-white/5 ' +
  'shadow-[0_15px_35px_rgba(0,0,0,0.12)] ' +
  'hover:shadow-[0_18px_40px_rgba(75,169,178,0.1)] ' +
  'transition-shadow duration-500 ' +
  'transform-gpu'

function Card({ children, className = '', direction = 'bottom' }: {
  children: React.ReactNode
  className?: string
  direction?: Direction
}) {
  return (
    <motion.div
      variants={CARD_VARIANTS[direction]}
      whileHover={{ y: -4, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      className={`${GLASS} p-5 ${className}`}
    >
      {children}
    </motion.div>
  )
}

/* ─── GitHub Widget ─── */

interface GitHubRepo {
  name: string
  language: string
}

function GitHubRepos() {
  const [repos, setRepos] = useState<GitHubRepo[]>([])

  useEffect(() => {
    fetch('https://api.github.com/users/aphrosyne/repos?sort=updated&per_page=3')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setRepos(data)
      })
      .catch(() => {})
  }, [])

  return (
    <Card direction="top" className="flex flex-col gap-2">
      <div className="text-[10px] text-white/40 tracking-widest uppercase">GitHub</div>
      {repos.length === 0 && (
        <p className="text-[11px] text-white/30">加载中...</p>
      )}
      {repos.map((r) => (
        <a
          key={r.name}
          href={`https://github.com/aphrosyne/${r.name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg hover:bg-surface/30 transition-colors p-1 -m-1 group"
        >
          <svg className="w-3 h-3 text-white/40 group-hover:text-white/60 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          <span className="text-xs font-medium text-white/70 group-hover:text-white truncate">{r.name}</span>
          {r.language && <span className="text-[10px] text-white/30 ml-auto">{r.language}</span>}
        </a>
      ))}
    </Card>
  )
}

/* ─── Hitokoto Bar ─── */

function HitokotoBar() {
  const [quote, setQuote] = useState<string | null>(null)

  useEffect(() => {
    fetch('https://v1.hitokoto.cn/?c=i&encode=json')
      .then(r => r.json())
      .then(data => setQuote(data.hitokoto))
      .catch(() => setQuote('薄暝柳隙人独立，数点雨痕待江凝。'))
  }, [])

  return (
    <Card direction="bottom" className="text-center py-3">
      <p className="text-sm text-white/50 italic">
        {quote ? `「${quote}」` : `加载中...`}
      </p>
    </Card>
  )
}

/* ─── Project Card ─── */

function ProjectSubCard({ project }: { project: DashboardProps['projects'][number] }) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      className="rounded-2xl overflow-hidden bg-white/2 backdrop-blur-md border-t border-t-white/15 border-b border-b-white/5 p-4 shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:shadow-[0_14px_30px_rgba(75,169,178,0.08)] transition-shadow duration-500 group cursor-pointer"
    >
      <div className="text-lg mb-2">🔧</div>
      <div className="text-sm font-medium text-white/80 group-hover:text-accent transition-colors">{project.title}</div>
      <div className="text-[11px] text-white/50 leading-snug mt-1 line-clamp-2">{project.description}</div>
    </motion.div>
  )
}

/* ─── Dashboard ─── */

export default function Dashboard({ siteName, recentPosts, projects }: DashboardProps) {
  return (
    <section id="content" className="px-4 pb-20 max-w-5xl mx-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="flex flex-col gap-4 lg:gap-5"
      >
        {/* Row 1: Bio + Posts + GitHub */}
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr_200px] gap-4 lg:gap-5">
          {/* Bio */}
          <Card direction="left" className="flex flex-col items-center justify-center text-center gap-3 py-6">
            <svg width="0" height="0" aria-hidden="true">
              <defs>
                <clipPath id="bio-avatar-clip" clipPathUnits="objectBoundingBox">
                  <path d={AVATAR_CLIP_PATH} />
                </clipPath>
              </defs>
            </svg>
            <div className="relative w-14 h-14 group">
              <div
                className="absolute -inset-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-spin"
                style={{
                  clipPath: 'url(#bio-avatar-clip)',
                  background: '#f7a1c4',
                  animationDuration: '4s',
                }}
              />
              <img
                src="/images/avatar/avatar.jpg"
                alt="Avatar"
                className="relative w-14 h-14 object-cover"
                style={{ clipPath: 'url(#bio-avatar-clip)' }}
              />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{siteName}</div>
            </div>
            <div className="flex gap-2">
              {Object.entries(SOCIAL_LINKS).map(([key, href]) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-lg bg-surface/50 border border-border/30 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
                  title={key}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                    {socialIcons[key]}
                  </svg>
                </a>
              ))}
            </div>
          </Card>

          {/* Posts */}
          <Card direction="left">
            <div className="text-[10px] text-white/40 tracking-widest uppercase mb-2">Posts</div>
            {recentPosts.length === 0 && (
              <p className="text-xs text-white/40">暂无文章</p>
            )}
            {recentPosts.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`}
                className="flex items-center justify-between py-1.5 px-1 rounded -mx-1 transition-colors hover:bg-surface/30 group"
              >
                <span className="text-xs text-white/70 truncate group-hover:text-accent transition-colors">{p.title}</span>
                <span className="text-[10px] text-white/30 shrink-0 ml-3">{p.date}</span>
              </Link>
            ))}
          </Card>

          {/* GitHub */}
          <GitHubRepos />
        </div>

        {/* Hitokoto */}
        <HitokotoBar />

        {/* Tag Cloud */}
        <TagCloud tags={TECH_TAGS} />

        {/* Projects */}
        <Card direction="bottom">
          <div className="text-[10px] text-white/40 tracking-widest uppercase mb-4">Projects</div>
          <div className="grid grid-cols-2 gap-3">
            {projects.slice(0, 4).map((p) => (
              <Link key={p.slug} href={`/projects/${p.slug}`}>
                <ProjectSubCard project={p} />
              </Link>
            ))}
          </div>
        </Card>
      </motion.div>
    </section>
  )
}
