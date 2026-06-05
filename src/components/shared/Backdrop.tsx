'use client'

import { useEffect, useRef, useState } from 'react'

const formats = ['png', 'jpg', 'webp', 'jpeg']

export default function Backdrop() {
  const [src, setSrc] = useState<string | null>(null)
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
    <>
      {formats.map((ext) => (
        <img
          key={ext}
          src={`/images/bg/bg.${ext}`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: `blur(${blurPx}px)`,
            transform: 'scale(1.02)',
            opacity: src && src !== `/images/bg/bg.${ext}` ? 0 : 1,
          }}
          onLoad={(e) => {
            if (!src) setSrc((e.target as HTMLImageElement).src)
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none'
          }}
        />
      ))}
    </>
  )
}
