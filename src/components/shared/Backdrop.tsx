'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { publicPath } from '@/lib/public-path'
import { SITE } from '@/config/site'

export default function Backdrop() {
  const pathname = usePathname()
  const [blurPx, setBlurPx] = useState(0)
  const rAF = useRef(0)
  const section = pathname.startsWith('/knowledge')
    ? 'knowledge'
    : pathname.startsWith('/blog')
      ? 'blog'
      : pathname.startsWith('/projects')
        ? 'projects'
        : pathname.startsWith('/about')
          ? 'about'
          : 'home'

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rAF.current)
      rAF.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY
        const docH = document.documentElement.scrollHeight - window.innerHeight
        const progress = docH > 0 ? scrollY / docH : 0
        setBlurPx(Math.min(12, progress * 12))
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (section !== 'home') {
    return <div className={`content-backdrop content-backdrop--${section}`} aria-hidden="true" />
  }

  return (
    <img
      src={publicPath(SITE.assets.background)}
      alt=""
      className="absolute inset-0 w-full h-full object-cover"
      style={{
        filter: `blur(${blurPx}px)`,
        transform: 'scale(1.02)',
      }}
    />
  )
}
