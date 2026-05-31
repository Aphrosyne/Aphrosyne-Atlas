'use client'

import { useEffect, useState } from 'react'

interface Dot {
  cx: number
  cy: number
  r: number
  hue: number
  sat: number
  light: number
  alpha: number
}

export default function GlowDots() {
  const [dots, setDots] = useState<Dot[] | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const count = 3 + Math.floor(Math.random() * 2) // 3 or 4
    const items: Dot[] = []
    for (let i = 0; i < count; i++) {
      items.push({
        cx: 33 + Math.random() * 34,
        cy: 33 + Math.random() * 34,
        r: 200 + Math.random() * 200,
        hue: Math.random() * 360,
        sat: 55 + Math.random() * 10,
        light: 65 + Math.random() * 10,
        alpha: 0.40 + Math.random() * 0.15,
      })
    }
    setDots(items)
    // fade in with cards, 1s ease-out
    setTimeout(() => setVisible(true), 50)
  }, [])

  if (!dots) return null

  return (
    <svg
      className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-out"
      style={{ opacity: visible ? 1 : 0 }}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        {dots.map((dot, i) => (
          <radialGradient
            key={i}
            id={`g-${i}`}
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop
              offset="0%"
              stopColor={`hsla(${dot.hue}, ${dot.sat}%, ${dot.light}%, ${dot.alpha})`}
            />
            <stop
              offset="100%"
              stopColor={`hsla(${dot.hue}, ${dot.sat}%, ${dot.light}%, 0)`}
            />
          </radialGradient>
        ))}
      </defs>
      {dots.map((dot, i) => (
        <circle
          key={i}
          cx={`${dot.cx}%`}
          cy={`${dot.cy}%`}
          r={dot.r}
          fill={`url(#g-${i})`}
        />
      ))}
    </svg>
  )
}
