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

const QUICK_LINKS = [
  { label: 'Blog', href: '/blog', desc: 'Thoughts & notes' },
  { label: 'Projects', href: '/projects', desc: 'Stuff I built' },
  { label: 'About', href: '/about', desc: 'Who I am' },
]

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

const OFFSETS: Record<Direction, { x: number; y: number }> = {
  left:   { x: -300, y:   0 },
  right:  { x:  300, y:   0 },
  top:    { x:    0, y: -200 },
  bottom: { x:    0, y:  200 },
}

const EXPO_EASE = [0.16, 1, 0.3, 1] as const

const CARD_VARIANTS: Record<Direction, Variants> = {
  left:   { hidden: { opacity: 0, x: OFFSETS.left.x,   y: OFFSETS.left.y   }, visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.7, ease: EXPO_EASE } } },
  right:  { hidden: { opacity: 0, x: OFFSETS.right.x,  y: OFFSETS.right.y  }, visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.7, ease: EXPO_EASE } } },
  top:    { hidden: { opacity: 0, x: OFFSETS.top.x,    y: OFFSETS.top.y    }, visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.7, ease: EXPO_EASE } } },
  bottom: { hidden: { opacity: 0, x: OFFSETS.bottom.x, y: OFFSETS.bottom.y }, visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.7, ease: EXPO_EASE } } },
}

/* ─── Glass card style (pure CSS, cross-browser) ─── */

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
      <p className="text-center text-[11px] text-white/30 tracking-[0.15em] uppercase mb-3">Explore</p>
      <div className="w-8 h-px bg-accent/30 mx-auto mb-12" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-1 md:grid-cols-[220px_1fr_240px] gap-4 lg:gap-5"
      >
        {/* ─── Left Sidebar ─── */}

        {/* Bio + Social */}
        <Card direction="left" className="flex flex-col items-center justify-center text-center gap-3 py-8">
          <svg width="0" height="0" aria-hidden="true">
            <defs>
              <clipPath id="bio-avatar-clip" clipPathUnits="objectBoundingBox">
                <path d={AVATAR_CLIP_PATH} />
              </clipPath>
            </defs>
          </svg>
          <div className="relative w-16 h-16 group">
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
              className="relative w-16 h-16 object-cover"
              style={{ clipPath: 'url(#bio-avatar-clip)' }}
            />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{siteName}</div>
            <div className="text-[11px] text-white/50">设计 · 创造</div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {Object.entries(SOCIAL_LINKS).map(([key, href]) => (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-surface/50 border border-border/30 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
                title={key}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                  {socialIcons[key]}
                </svg>
              </a>
            ))}
          </div>
        </Card>

        {/* Latest posts */}
        <Card direction="left">
          <div className="text-[10px] text-white/40 tracking-widest uppercase mb-3">Recent Posts</div>
          {recentPosts.slice(0, 3).map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`}
              className="flex items-center gap-3 py-2 px-1.5 rounded-lg -mx-1.5 transition-colors hover:bg-surface/40 group"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/6 flex items-center justify-center shrink-0 text-sm group-hover:bg-accent/10 transition-colors">
                📄
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-white/80 truncate group-hover:text-accent transition-colors">{p.title}</div>
                <div className="text-[11px] text-white/40">{p.date}</div>
              </div>
            </Link>
          ))}
        </Card>

        {/* ─── Main Area ─── */}

        <div className="flex flex-col gap-4 lg:gap-5">
          {/* Welcome */}
          <Card direction="top" className="p-4">
            <div className="text-xs text-white/50">欢迎回来</div>
            <div className="text-base font-semibold text-white">
              {siteName} <span className="text-white/40 font-normal text-sm">· 新发现</span>
            </div>
          </Card>

          {/* Quick Links */}
          <Card direction="bottom" className="flex items-center justify-around py-4">
            {QUICK_LINKS.map((l) => (
              <Link key={l.label} href={l.href}
                className="flex flex-col items-center gap-0.5 text-white/50 hover:text-accent transition-colors"
              >
                <span className="text-sm font-semibold">{l.label}</span>
                <span className="text-[10px] text-white/30">{l.desc}</span>
              </Link>
            ))}
          </Card>

          {/* Projects showcase */}
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
        </div>

        {/* ─── Right Sidebar ─── */}

        {/* Hitokoto */}
        <HitokotoCard />

        {/* GitHub */}
        <GitHubRepos />

      </motion.div>

      {/* Extras — outside animated container */}
      <TagCloud tags={TECH_TAGS} />

    </section>
  )
}

/* ─── Extras Components ─── */

function HitokotoCard() {
  const [quote, setQuote] = useState<string | null>(null)
  useEffect(() => {
    fetch('https://v1.hitokoto.cn/?c=i&encode=json')
      .then(r => r.json()).then(d => setQuote(d.hitokoto))
      .catch(() => setQuote('薄暝柳隙人独立，数点雨痕待江凝。'))
  }, [])
  return (
    <Card direction="right" className="text-center py-4">
      <p className="text-xs text-white/50 italic leading-relaxed">{quote ? `「${quote}」` : `加载中...`}</p>
    </Card>
  )
}

interface GitHubRepo { name: string; language: string }

function GitHubRepos() {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  useEffect(() => {
    fetch('https://api.github.com/users/aphrosyne/repos?sort=updated&per_page=3')
      .then(r => r.json()).then(d => { if (Array.isArray(d)) setRepos(d) })
      .catch(() => {})
  }, [])
  return (
    <Card direction="right">
      <div className="text-[10px] text-white/40 tracking-widest uppercase mb-3">GitHub</div>
      {repos.length === 0 && <p className="text-[11px] text-white/30">加载中...</p>}
      {repos.map(r => (
        <a key={r.name} href={`https://github.com/aphrosyne/${r.name}`} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 py-1 px-1 -mx-1 rounded hover:bg-surface/30 transition-colors group">
          <span className="text-xs font-medium text-white/70 group-hover:text-white truncate">{r.name}</span>
          {r.language && <span className="text-[10px] text-white/30 ml-auto">{r.language}</span>}
        </a>
      ))}
    </Card>
  )
}
