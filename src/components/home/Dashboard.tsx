'use client'

import { useEffect, useState, useRef } from 'react'
import { useBounce } from '@/lib/useBounce'
import { motion, type Variants } from 'framer-motion'
import Link from 'next/link'
import socialIcons from '@/components/shared/SocialIcons'
import TagCloud from '@/components/home/TagCloud'
import ClockCard from '@/components/home/ClockCard'
import MusicPlayer from '@/components/home/MusicPlayer'
import FFTVisualizer from '@/components/home/FFTVisualizer'
import { SOCIAL_LINKS } from '@/lib/constants'
import type { PostMetadata } from '@/types/post'

interface DashboardProps {
  siteName: string
  recentPosts: PostMetadata[]
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

function Card({ children, className = '', direction = 'bottom' }: {
  children: React.ReactNode
  className?: string
  direction?: Direction
}) {
  return (
    <motion.div
      variants={CARD_VARIANTS[direction]}
      whileHover={{ y: -3 }}
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
      className="rounded-2xl overflow-hidden bg-white/2 backdrop-blur-md border-t border-t-white/15 border-b border-b-white/5 p-3 shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:shadow-[0_14px_30px_rgba(75,169,178,0.08)] transition-shadow duration-500 group cursor-pointer"
    >
      <div className="text-sm font-medium text-white/80 group-hover:text-accent transition-colors truncate">{project.title}</div>
      <div className="text-[11px] text-white/50 leading-snug mt-1 line-clamp-2">{project.description}</div>
    </motion.div>
  )
}

/* ─── Dashboard ─── */

/* ─── Grid Layout — 改这里调整卡片位置 ─── */
const GRID = {
  bio:           'md:col-start-1   md:col-span-3 md:row-start-1 md:row-span-1',
  posts:         'md:col-start-4   md:col-span-9 md:row-start-1 md:row-span-1',
  projects:      'md:col-start-1   md:col-span-3 md:row-start-2 md:row-span-3',
  tagcloud:      'md:col-start-4   md:col-span-6 md:row-start-2 md:row-span-3',
  memes:         'md:col-start-10  md:col-span-3 md:row-start-2 md:row-span-1',
  status:        'md:col-start-10  md:col-span-3 md:row-start-3 md:row-span-1',
  clock:         'md:col-start-10  md:col-span-3 md:row-start-4 md:row-span-1',
  playground:    'md:col-start-1   md:col-span-3 md:row-start-5 md:row-span-1',
  contributions: 'md:col-start-4   md:col-span-4 md:row-start-5 md:row-span-1',
  player:        'md:col-start-8   md:col-span-5 md:row-start-5 md:row-span-2',
  hitokoto:      'md:col-start-1   md:col-span-7 md:row-start-6 md:row-span-1',
} as const

/* ─── 飞入方向 — 底部卡片不能用 bottom，否则卡滚动 ─── */
const DIR: Record<keyof typeof GRID, Direction> = {
  bio:           'left',
  posts:         'top',
  projects:      'left',
  tagcloud:      'bottom',
  memes:         'right',
  status:        'right',
  clock:         'right',
  playground:    'left',
  contributions: 'bottom',
  player:        'right',
  hitokoto:      'left',
}

export default function Dashboard({ siteName, recentPosts, projects, tags }: DashboardProps) {
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
  return (
    <section id="content" className="px-4 pb-12 max-w-5xl mx-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-1 md:grid-cols-12 grid-rows-[repeat(6,minmax(120px,auto))] gap-4 lg:gap-5"
      >
        {/* Bio */}
        <Card direction={DIR.bio} className={`${GRID.bio} flex flex-col gap-3 py-6`}>
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
                style={{ clipPath: 'url(#bio-avatar-clip)', background: '#f7a1c4', animationDuration: '4s' }}
              />
              <img src="/images/avatar/avatar.jpg" alt="Avatar" className="relative w-16 h-16 object-cover" style={{ clipPath: 'url(#bio-avatar-clip)' }} />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{siteName}</div>
              <div className="text-[11px] text-white/50">设计 · 创造</div>
            </div>
            <div className="flex gap-3 mt-2">
              {Object.entries(SOCIAL_LINKS).map(([key, href]) => (
                <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-surface/50 border border-border/30 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all" title={key}>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">{socialIcons[key]}</svg>
                </a>
              ))}
            </div>
          </div>
        </Card>

        {/* Posts */}
        <Card direction={DIR.posts} className={GRID.posts}>
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
        <Card direction={DIR.projects} className={GRID.projects}>
          <div className="text-[10px] text-white/40 tracking-widest uppercase mb-3">Projects</div>
          <div className="grid grid-cols-2 gap-3">
            {projects.slice(0, 4).map((p) => (
              <Link key={p.slug} href={`/projects/${p.slug}`}><ProjectSubCard project={p} /></Link>
            ))}
          </div>
        </Card>

        {/* TagCloud */}
        <Card direction={DIR.tagcloud} className={`${GRID.tagcloud} flex items-center justify-center`}>
          <TagCloud tags={tags} />
        </Card>

        {/* Memes */}
        <Card direction={DIR.memes} className={`${GRID.memes} flex flex-col`}>
          <div className="text-[10px] text-white/40 tracking-widest uppercase mb-3">Memes</div>
          <div className="flex-1 flex items-center justify-center"><MemCard /></div>
        </Card>

        {/* Status */}
        <Card direction={DIR.status} className={GRID.status}><StatusCard /></Card>

        {/* Clock */}
        <Card direction={DIR.clock} className={`${GRID.clock} flex flex-col`}>
          <div className="text-[10px] text-white/40 tracking-widest uppercase mb-3">Clock</div>
          <div className="flex-1 flex items-center justify-center"><ClockCard /></div>
        </Card>

        {/* Playground */}
        <Card direction={DIR.playground} className={`${GRID.playground} flex flex-col`}>
          <div className="text-[10px] text-white/40 tracking-widest uppercase mb-3">Playground</div>
          <Link href="/playground" className="flex-1 flex items-center justify-center group"><PlaygroundThumb /></Link>
        </Card>

        {/* Contributions */}
        <Card direction={DIR.contributions} className={`${GRID.contributions} overflow-x-auto`}><ContributionsGraph /></Card>

        {/* Player — FFT + Music */}
        <Card direction={DIR.player} className={`${GRID.player} flex flex-col`}>
          <div className="text-[10px] text-white/40 tracking-widest uppercase mb-3">Music</div>
          <div className="h-24 mb-3"><FFTVisualizer analyser={analyser} /></div>
          <MusicPlayer onAnalyser={a => setAnalyser(a)} />
        </Card>

        {/* Hitokoto */}
        <Card direction={DIR.hitokoto} className={GRID.hitokoto}><HitokotoCard /></Card>

      </motion.div>

    </section>
  )
}

/* ─── Extras Components ─── */

function HitokotoCard() {
  const [quote, setQuote] = useState<string | null>(null)
  useEffect(() => {
    fetch('/api/hitokoto')
      .then(r => r.json()).then(d => setQuote(d.hitokoto))
      .catch(() => setQuote('薄暝柳隙人独立，数点雨痕待江凝。'))
  }, [])
  return (
    <>
      <div className="text-[10px] text-white/40 tracking-widest uppercase mb-3">Hitokoto</div>
      <p className="text-xs text-white/50 italic leading-relaxed text-center">{quote ? `「${quote}」` : `加载中...`}</p>
    </>
  )
}

interface ContributionDay {
  contributionCount: number
  date: string
  color: string
}

interface ContributionWeek {
  contributionDays: ContributionDay[]
}

const LEVEL_COLORS = ['bg-white/5', 'bg-accent/20', 'bg-accent/40', 'bg-accent/60', 'bg-accent/80']

function ContributionsGraph() {
  const [weeks, setWeeks] = useState<ContributionWeek[]>([])
  useEffect(() => {
    fetch('/api/github-contributions')
      .then(r => r.json())
      .then(d => setWeeks(d.weeks ?? []))
      .catch(() => {})
  }, [])

  const days = weeks.flatMap(w => w.contributionDays)
  const max = Math.max(...days.map(d => d.contributionCount), 1)

  return (
    <>
      <div className="text-[10px] text-white/40 tracking-widest uppercase mb-3">Contributions</div>
      {weeks.length === 0 && <p className="text-[11px] text-white/30">加载中...</p>}
      <div className="flex gap-0.75 overflow-hidden pb-1">
        {weeks.map((_w, i) => {
          const week = weeks[weeks.length - 1 - i]
          return (
          <div key={i} className="flex flex-col gap-0.75">
            {week.contributionDays.map((day) => {
              const level = day.contributionCount === 0 ? 0 : Math.min(4, Math.ceil((day.contributionCount / max) * 4))
              return (
                <div
                  key={day.date}
                  title={`${day.date}: ${day.contributionCount} contributions`}
                  className={`w-2.75 h-2.75 rounded-xs ${LEVEL_COLORS[level]} transition-colors`}
                />
              )
            })}
          </div>
        )})}
      </div>
    </>
  )
}

const THUMB_PARTICLE_DOTS = Array.from({ length: 20 }, (_, i) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453
  const t = Math.sin(i * 269.5 + 183.3) * 43758.5453
  const u = Math.sin(i * 419.2 + 371.1) * 43758.5453
  return {
    x: 15 + (s - Math.floor(s)) * 70,
    y: 10 + (t - Math.floor(t)) * 80,
    r: 1.5 + (u - Math.floor(u)) * 2.5,
    o: 0.3 + ((s - Math.floor(s)) * 0.5),
  }
})

function PlaygroundThumb() {
  const [variant, setVariant] = useState(0)
  useEffect(() => { setVariant(Math.random()) }, [])
  if (variant < 0.5) {
    // CSS Cube thumbnail — isometric static view
    return (
      <div className="relative w-14 h-14 group-hover:scale-110 transition-transform duration-300" style={{ perspective: '200px' }}>
        <div
          className="relative w-full h-full"
          style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-20deg) rotateY(30deg)' }}
        >
          {[
            { transform: 'translateZ(28px)' },
            { transform: 'rotateY(180deg) translateZ(28px)' },
            { transform: 'rotateY(90deg) translateZ(28px)' },
            { transform: 'rotateY(-90deg) translateZ(28px)' },
            { transform: 'rotateX(90deg) translateZ(28px)' },
            { transform: 'rotateX(-90deg) translateZ(28px)' },
          ].map((s, i) => (
            <div
              key={i}
              className="absolute w-14 h-14 border border-accent/30 bg-accent/5"
              style={s}
            />
          ))}
        </div>
      </div>
    )
  }
  const dots = THUMB_PARTICLE_DOTS
  return (
    <svg viewBox="0 0 100 100" className="w-14 h-14 group-hover:scale-110 transition-transform duration-300">
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={`rgba(75,169,178,${d.o})`} />
      ))}
    </svg>
  )
}

function StatusCard() {
  const [status, setStatus] = useState<{ status: string; emoji?: string } | null>(null)
  const { bounce, bounceStyle } = useBounce()
  useEffect(() => {
    fetch(`https://gist.githubusercontent.com/Aphrosyne/534c12c92c01c3eb2901cb41b4c81c64/raw?t=${Date.now()}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(data => setStatus(data))
      .catch(() => {})
  }, [])
  return (
    <>
      <div className="text-[10px] text-white/40 tracking-widest uppercase mb-3">Status</div>
      <p className="text-sm text-white/70 cursor-pointer select-none" onClick={bounce} style={bounceStyle}>
        {status ? `${status.emoji || ''} ${status.status}` : '加载中...'}
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
      src={`/images/mems/${idx}.jpg`}
      alt="meme"
      onClick={bounce}
      className="max-h-28 rounded-2xl cursor-pointer select-none"
      style={bounceStyle}
    />
  )
}
