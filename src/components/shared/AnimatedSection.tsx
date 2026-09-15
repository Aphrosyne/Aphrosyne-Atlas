'use client'

import { motion } from 'framer-motion'
import { useMotionPolicy } from '@/lib/use-motion-policy'

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export default function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: AnimatedSectionProps) {
  const { shouldReduceMotion } = useMotionPolicy()

  return (
    <motion.section
      initial={shouldReduceMotion ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.section>
  )
}
