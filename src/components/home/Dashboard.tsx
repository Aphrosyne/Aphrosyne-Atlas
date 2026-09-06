'use client'

import { useState } from 'react'
import { useBounce } from '@/lib/useBounce'
import { motion, type Variants } from 'framer-motion'
import Link from 'next/link'
import socialIcons from '@/components/shared/SocialIcons'
import TagCloud from '@/components/home/TagCloud'
import ClockCard from '@/components/home/ClockCard'
import { SITE, SOCIAL_LINKS } from '@/config/site'
import { DASHBOARD_LAYOUT, type DashboardCardId, type DashboardLayoutItem } from '@/config/dashboard-layout'
import type { PostMetadata } from '@/types/post'
import type { KnowledgeMetadata } from '@/types/knowledge'
import { publicPath } from '@/lib/public-path'

interface DashboardProps {
  siteName: string
  recentPosts: PostMetadata[]
  recentKnowledge: KnowledgeMetadata[]
  projects: { slug: string; title: string; description: string }[]
  tags: string[]
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
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

type Direction = 'left' | 'right' | 'top' | 'bottom'

const OFFSETS: Record<Direction, { x: number; y: number }> = {
  left:   { x: -120, y:   0 },
  right:  { x:  120, y:   0 },
  top:    { x:    0, y: -80 },
  bottom: { x:    0, y:  80 },
}

const EXPO_EASE = [0.16, 1, 0.3, 1] as const

const CARD_VARIANTS: Record<Direction, Variants> = {
  left:   { hidden: { opacity: 0, x: OFFSETS.left.x,   y: OFFSETS.left.y   }, visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.5, ease: EXPO_EASE } } },
  right:  { hidden: { opacity: 0, x: OFFSETS.right.x,  y: OFFSETS.right.y  }, visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.5, ease: EXPO_EASE } } },
  top:    { hidden: { opacity: 0, x: OFFSETS.top.x,    y: OFFSETS.top.y    }, visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.5, ease: EXPO_EASE } } },
  bottom: { hidden: { opacity: 0, x: OFFSETS.bottom.x, y: OFFSETS.bottom.y }, visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.5, ease: EXPO_EASE } } },
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

function Card({ children, className = '', direction = 'bottom', layout }: {
  children: React.ReactNode
  className?: string
  direction?: Direction
  layout: DashboardLayoutItem
}) {
  const style = {
    '--dashboard-column': `${layout.column} / span ${layout.columnSpan}`,
    '--dashboard-row': `${layout.row} / span ${layout.rowSpan}`,
  } as React.CSSProperties

  return (
    <motion.div
      variants={CARD_VARIANTS[direction]}
      whileHover={{ y: -3 }}
      style={style}
      className={`${GLASS} p-5 md:[grid-column:var(--dashboard-column)] md:[grid-row:var(--dashboard-row)] ${className}`}
    >
      {children}
    </motion.div>
  )
}

function ProjectSubCard({ project }: { project: DashboardProps['projects'][number] }) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      className="rounded-2xl overflow-hidden bg-white/2 backdrop-blur-md border-t border-t-white/15 border-b border-b-white/5 p-3 shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:shadow-[0_14px_30px_rgba(75,169,178,0.08)] transition-shadow duration-500 group cursor-pointer"
    >
      <div className="text-sm font-medium text-white/80 group-hover:text-accent transition-colors truncate">{project.title}</div>
      <div className="text-[11px] text-white/50 leading-snug mt-1 line-clamp-2">{project.description}</div>
    </motion.div>
  )
}

/* ─── Dashboard ─── */

/* ─── Grid Layout — 改这里调整卡片位置 ─── */
/* ─── 飞入方向 — 底部卡片不能用 bottom，否则卡滚动 ─── */
const DIR: Record<DashboardCardId, Direction> = {
  bio:           'left',
  posts:         'top',
  knowledge:     'top',
  projects:      'left',
  tagcloud:      'bottom',
  memes:         'right',
  status:        'right',
  clock:         'right',
  hitokoto:      'left',
}

export default function Dashboard({ siteName, recentPosts, recentKnowledge, projects, tags }: DashboardProps) {
  return (
    <section id="content" className="px-4 pb-12 max-w-5xl mx-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-[repeat(6,minmax(120px,auto))] gap-4 lg:gap-5"
      >
        {/* Bio */}
        <Card layout={DASHBOARD_LAYOUT.bio} direction={DIR.bio} className="flex flex-col gap-3 py-6">
          <div className="text-[10px] text-white/40 tracking-widest uppercase mb-3">Profile</div>
          <div className="flex flex-col items-center gap-3 flex-1 justify-center">
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
                style={{ clipPath: 'url(#bio-avatar-clip)', background: 'var(--color-avatar-ring)', animationDuration: '4s' }}
              />
              <img src={publicPath(SITE.assets.avatar)} alt="Avatar" className="relative w-16 h-16 object-cover" style={{ clipPath: 'url(#bio-avatar-clip)' }} />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{siteName}</div>
              <div className="text-[11px] text-white/50">{SITE.profile.tagline}</div>
            </div>
            <div className="flex gap-3 mt-2">
              {SOCIAL_LINKS.map((link) => (
                <a key={link.platform} href={link.href} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-surface/50 border border-border/20 flex items-center justify-center text-fg/40 hover:text-fg hover:border-border/70 transition-all" title={link.label}>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">{socialIcons[link.platform]}</svg>
                </a>
              ))}
            </div>
          </div>
        </Card>

        {/* Knowledge */}
        <Card layout={DASHBOARD_LAYOUT.knowledge} direction={DIR.knowledge}>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[10px] tracking-widest text-white/40 uppercase">Knowledge</div>
            <Link href="/knowledge" className="text-xs text-accent transition-colors hover:text-avatar-ring">查看全部 →</Link>
          </div>
          {recentKnowledge.length === 0 ? (
            <p className="text-sm text-white/50">知识库正在整理中。</p>
          ) : recentKnowledge.map((entry) => (
            <Link key={entry.slug} href={`/knowledge/${entry.slug}`} className="flex items-center gap-3 rounded-lg px-1.5 py-2 text-sm transition-colors hover:bg-surface/40">
              <span className="text-base">📚</span>
              <span className="min-w-0 flex-1 truncate text-white/80">{entry.title}</span>
              <span className="shrink-0 text-[11px] text-white/40">{entry.lastVerified ?? '未验证'}</span>
            </Link>
          ))}
        </Card>

        {/* Posts */}
        <Card layout={DASHBOARD_LAYOUT.posts} direction={DIR.posts}>
          <div className="text-[10px] text-white/40 tracking-widest uppercase mb-3">Recent Posts</div>
          {recentPosts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="flex items-center gap-3 py-2 px-1.5 rounded-lg -mx-1.5 transition-colors hover:bg-surface/40 group">
              <div className="w-10 h-10 rounded-lg bg-accent/6 flex items-center justify-center shrink-0 text-sm group-hover:bg-accent/10 transition-colors">📄</div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-white/80 truncate group-hover:text-accent transition-colors">{p.title}</div>
                <div className="text-[11px] text-white/40">{p.date}</div>
              </div>
            </Link>
          ))}
        </Card>

        {/* Projects */}
        <Card layout={DASHBOARD_LAYOUT.projects} direction={DIR.projects}>
          <div className="text-[10px] text-white/40 tracking-widest uppercase mb-3">Projects</div>
          <div className="grid grid-cols-2 gap-3">
            {projects.slice(0, 4).map((p) => (
              <Link key={p.slug} href={`/projects/${p.slug}`}><ProjectSubCard project={p} /></Link>
            ))}
          </div>
        </Card>

        {/* TagCloud */}
        <Card layout={DASHBOARD_LAYOUT.tagcloud} direction={DIR.tagcloud} className="flex items-center justify-center">
          <TagCloud tags={tags} />
        </Card>

        {/* Memes */}
        <Card layout={DASHBOARD_LAYOUT.memes} direction={DIR.memes} className="flex flex-col">
          <div className="text-[10px] text-white/40 tracking-widest uppercase mb-3">Memes</div>
          <div className="flex-1 flex items-center justify-center"><MemCard /></div>
        </Card>

        {/* Status */}
        <Card layout={DASHBOARD_LAYOUT.status} direction={DIR.status}><StatusCard /></Card>

        {/* Clock */}
        <Card layout={DASHBOARD_LAYOUT.clock} direction={DIR.clock} className="flex flex-col">
          <div className="text-[10px] text-white/40 tracking-widest uppercase mb-3">Clock</div>
          <div className="flex-1 flex items-center justify-center"><ClockCard /></div>
        </Card>

        {/* Hitokoto */}
        <Card layout={DASHBOARD_LAYOUT.hitokoto} direction={DIR.hitokoto} className="flex items-center justify-center"><HitokotoCard /></Card>

      </motion.div>

    </section>
  )
}

/* ─── Extras Components ─── */

function HitokotoCard() {
  return (
    <>
      <div className="text-[10px] text-white/40 tracking-widest uppercase mb-3">Hitokoto</div>
      <p className="text-sm text-white/50 italic leading-relaxed text-center">「{SITE.dashboard.hitokoto}」</p>
    </>
  )
}

function StatusCard() {
  const { bounce, bounceStyle } = useBounce()
  return (
    <>
      <div className="text-[10px] text-white/40 tracking-widest uppercase mb-3">Status</div>
      <p className="text-sm text-white/70 cursor-pointer select-none" onClick={bounce} style={bounceStyle}>
        {SITE.dashboard.status}
      </p>
    </>
  )
}

const MEM_COUNT = 1 // 改这个数字，对应 public/images/mems/ 下的图片数量（从0开始编号）

function MemCard() {
  const [idx] = useState(() => Math.floor(Math.random() * MEM_COUNT))
  const { bounce, bounceStyle } = useBounce()

  return (
    <img
      src={publicPath(`/images/mems/${idx}.jpg`)}
      alt="meme"
      onClick={bounce}
      className="max-h-28 rounded-2xl cursor-pointer select-none"
      style={bounceStyle}
    />
  )
}
