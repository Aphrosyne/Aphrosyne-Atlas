'use client'

import { motion } from 'framer-motion'

export default function PageTransition({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <motion.div
      className="flex flex-1 flex-col"
      style={{ backfaceVisibility: 'hidden' }}
      initial={{ opacity: 0.01 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
