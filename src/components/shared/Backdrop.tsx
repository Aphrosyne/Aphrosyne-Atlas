'use client'

import { useEffect, useRef, useState } from 'react'
import { publicPath } from '@/lib/public-path'
import { SITE } from '@/config/site'

export default function Backdrop() {
  const [blurPx, setBlurPx] = useState(0)
  const rAF = useRef(0)

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
