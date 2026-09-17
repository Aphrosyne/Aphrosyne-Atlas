'use client'

import PageTransition from '@/components/shared/PageTransition'
import MarqueeTechStack from '@/components/shared/MarqueeTechStack'
import socialIcons from '@/components/shared/SocialIcons'
import { SITE, SOCIAL_LINKS } from '@/config/site'
import { publicPath } from '@/lib/public-path'

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
    <div className="mx-auto w-full min-w-0 max-w-3xl px-4 py-16">
      <div className="min-w-0 rounded-2xl border border-border/10 bg-bg/30 p-8 backdrop-blur-xl sm:p-10">
        <PageTransition>
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
              className="absolute -inset-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 motion-reduce:animate-none animate-spin"
              style={{
                clipPath: 'url(#about-avatar-clip)',
                background: 'var(--color-avatar-ring)',
                animationDuration: '4s',
              }}
            />
            {/* Static export avatar: publicPath and SVG clip-path require a native image element. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={publicPath(SITE.assets.avatar)}
              alt="Avatar"
              className="relative w-20 h-20 object-cover"
              style={{ clipPath: 'url(#about-avatar-clip)' }}
            />
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-center">关于</h1>
        <div className="mt-3 text-center text-sm text-fg">
          <p>创建于 {SITE.about.createdAt}</p>
          <p>最后编辑 {SITE.about.updatedAt}</p>
        </div>
        <hr className="mt-8 border-0 h-0.5 bg-linear-to-r from-transparent via-border to-transparent" />
        {SITE.about.paragraphs.map((paragraph, index) => (
          <p key={paragraph} className={`${index === 0 ? 'mt-8' : 'mt-4'} text-fg leading-relaxed`}>
            {paragraph}
          </p>
        ))}

        <p className="mt-6 text-center text-fg/80">
          🔨 当前正在：{SITE.about.currentFocus}
        </p>

        <div className="mt-14">
          <MarqueeTechStack />
        </div>

        {/* Social Links */}
        <div className="mt-10 flex justify-center gap-5">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.platform}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-11 items-center justify-center rounded-xl border border-border/30 bg-surface/50 text-fg/40 transition-colors duration-300 hover:border-fg/30 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              title={link.label}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
                {socialIcons[link.platform]}
              </svg>
            </a>
          ))}
        </div>
        </PageTransition>
      </div>
    </div>
  )
}
