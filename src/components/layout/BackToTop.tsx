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
      className="fixed bottom-6 right-6 z-50 grid size-11 place-items-center rounded-full bg-accent text-white shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      aria-label="返回顶部"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      type="button"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    </motion.button>
  )
}
