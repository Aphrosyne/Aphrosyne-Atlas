'use client'

import { motion } from 'framer-motion'

const EASE_OUT = [0.25, 0.1, 0.25, 1] as const

const fadeIn = (delay: number) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8, delay, ease: EASE_OUT },
})

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center">
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
        薄暝柳隙人独立，数点雨痕待江凝。
      </motion.p>

      <motion.p
        {...fadeIn(0.15)}
        className="mb-8"
      >
        <span className="text-md text-white/60 tracking-[0.2em] uppercase">在下，</span>
        <span className="flow-text text-4xl sm:text-6xl font-bold tracking-tight">柳江凝</span>
      </motion.p>

      {/* Scroll arrow */}
      <motion.div
        {...fadeIn(0.5)}
        className="absolute bottom-32 left-1/2 -translate-x-1/2"
      >
        <button
          onClick={() => document.getElementById('content')?.scrollIntoView({ behavior: 'smooth' })}
          className="scroll-arrow cursor-pointer"
        >
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#4ba9b2">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 9l7 7 7-7" />
          </svg>
        </button>
      </motion.div>
    </section>
  )
}
