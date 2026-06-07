'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const raf = useRef(0)

  useEffect(() => {
    let last = false
    const handleScroll = () => {
      cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(() => {
        const over = window.scrollY > 400
        if (over !== last) {
          last = over
          setVisible(over)
        }
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <motion.button
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.8 }}
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-accent text-white shadow-lg"
      aria-label="Back to top"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    </motion.button>
  )
}
