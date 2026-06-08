'use client'

import { motion } from 'framer-motion'

const EXPO_EASE = [0.16, 1, 0.3, 1] as const

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: EXPO_EASE },
})

export default function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-4 text-center">

      <motion.p
        {...fadeUp(0)}
        className="max-w-md text-base text-white/70 leading-relaxed mb-6"
      >
        薄暝柳隙人独立，数点雨痕待江凝。
      </motion.p>

      <motion.p
        {...fadeUp(0.15)}
        className="mb-8"
      >
        <span className="text-md text-white/60 tracking-[0.2em] uppercase">在下，</span>
        <span className="text-4xl sm:text-6xl font-bold tracking-tight text-white">柳江凝</span>
      </motion.p>

      <motion.button
        {...fadeUp(0.35)}
        onClick={() => document.getElementById('content')?.scrollIntoView({ behavior: 'smooth' })}
        className="flex flex-col items-center gap-2 text-[11px] text-white/30 tracking-widest uppercase hover:text-white/50 transition-colors cursor-pointer group mt-12"
      >
        <span className="w-6 h-10 border-2 border-white/20 rounded-full relative group-hover:border-white/40 transition-colors">
          <span className="absolute top-1.5 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-accent/60 rounded-full animate-bounce" />
        </span>
        Scroll
      </motion.button>
    </section>
  )
}
