'use client'

import { motion } from 'framer-motion'
import { SITE } from '@/config/site'

const EASE_OUT = [0.25, 0.1, 0.25, 1] as const

const fadeIn = (delay: number) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8, delay, ease: EASE_OUT },
})

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100svh-3.75rem)] flex-col items-center justify-center px-4 text-center">
      <style>{`
        @keyframes flow {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .flow-text {
          color: transparent;
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0.2) 0%,
            rgba(255,255,255,0.8) 30%,
            rgba(255,255,255,0.8) 70%,
            rgba(255,255,255,0.2) 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          animation: flow 12s linear infinite;
        }
        .scroll-arrow {
          animation: float 2.5s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
      `}</style>

      <motion.p
        {...fadeIn(0)}
        className="max-w-md text-base text-white/70 leading-relaxed mb-6"
      >
        {SITE.profile.heroQuote}
      </motion.p>

      <motion.p
        {...fadeIn(0.15)}
        className="mb-8"
      >
        <span className="text-md text-white/60 tracking-[0.2em] uppercase">{SITE.profile.heroPrefix}</span>
        <span className="flow-text text-4xl sm:text-6xl font-bold tracking-tight">{SITE.profile.heroName}</span>
      </motion.p>

      {/* Scroll arrow */}
      <motion.div
        {...fadeIn(0.5)}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 sm:bottom-20"
      >
        <button
          onClick={() => document.getElementById('content')?.scrollIntoView({ behavior: 'smooth' })}
          className="scroll-arrow grid size-11 place-items-center rounded-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label="滚动到主要内容"
          type="button"
        >
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="var(--color-accent)">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 9l7 7 7-7" />
          </svg>
        </button>
      </motion.div>
    </section>
  )
}
