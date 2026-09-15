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
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
