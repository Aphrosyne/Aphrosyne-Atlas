'use client'

import { motion } from 'framer-motion'

type Direction = 'left' | 'right' | 'top' | 'bottom'

interface AnimatedEntranceProps {
  children: React.ReactNode
  direction: Direction
  delay?: number
  duration?: number
  className?: string
}

/** easeOutExpo — fast start, clean stop, zero bounce */
const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1]

/** Fixed off-screen distance — deterministic, no hydration mismatch */
const OFFSCREEN = 5000

function getInitial(direction: Direction) {
  switch (direction) {
    case 'left':   return { x: -OFFSCREEN, y: 0 }
    case 'right':  return { x: OFFSCREEN, y: 0 }
    case 'top':    return { x: 0, y: -OFFSCREEN }
    case 'bottom': return { x: 0, y: OFFSCREEN }
  }
}

export default function AnimatedEntrance({
  children,
  direction,
  delay = 0,
  duration = 0.7,
  className = '',
}: AnimatedEntranceProps) {
  const initial = getInitial(direction)

  return (
    <motion.div
      initial={{ x: initial.x, y: initial.y }}
      animate={{ x: 0, y: 0 }}
      transition={{ duration, ease: easeOutExpo, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
