'use client'

import { motion } from 'framer-motion'
import { useMotionPolicy } from '@/lib/use-motion-policy'

export default function PageTransition({
  children,
}: {
  children: React.ReactNode
}) {
  const { shouldReduceMotion } = useMotionPolicy()

  return (
    <motion.div
      className="flex flex-1 flex-col"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
