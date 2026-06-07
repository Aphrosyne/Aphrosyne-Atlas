'use client'

import { motion } from 'framer-motion'
import MarqueeTechStack from '@/components/shared/MarqueeTechStack'
import socialIcons from '@/components/shared/SocialIcons'
import { SOCIAL_LINKS } from '@/lib/constants'

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

export default function AboutContent() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="rounded-2xl backdrop-blur-xl bg-bg/30 border border-white/10 p-8 sm:p-10"
      >
        {/* Avatar — superellipse */}
        <div className="flex justify-center mb-6">
          <svg width="0" height="0" className="absolute">
            <defs>
              <clipPath id="about-avatar-clip" clipPathUnits="objectBoundingBox">
                <path d={AVATAR_CLIP_PATH} />
              </clipPath>
            </defs>
          </svg>
          <div className="relative w-20 h-20 group">
            <div
              className="absolute -inset-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-spin"
              style={{
                clipPath: 'url(#about-avatar-clip)',
                background: '#f7a1c4',
                animationDuration: '4s',
              }}
            />
            <img
              src="/images/avatar/avatar.jpg"
              alt="Avatar"
              className="relative w-20 h-20 object-cover"
              style={{ clipPath: 'url(#about-avatar-clip)' }}
            />
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-center">关于</h1>
        <div className="mt-3 text-center text-sm text-fg">
          <p>创建于 2026-06-01</p>
          <p>最后编辑 2026-06-08</p>
        </div>
        <hr className="mt-8 border-0 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        <p className="mt-8 text-fg leading-relaxed">
          一个兴趣使然的人，喜欢学有趣的东西
        </p>
        <p className="mt-4 text-fg leading-relaxed">
          还没想好写什么喵
        </p>

        <p className="mt-6 text-center text-fg/80">
          🔨 当前正在：学习前端，构建个人网站
        </p>

        <div className="mt-14">
          <MarqueeTechStack />
        </div>

        {/* Social Links */}
        <div className="mt-10 flex justify-center gap-5">
          {Object.entries(SOCIAL_LINKS).map(([key, href]) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-surface/50 border border-border/30 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
              title={key}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
                {socialIcons[key]}
              </svg>
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
