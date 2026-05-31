'use client'

import { motion } from 'framer-motion'
import GradientText from '../shared/GradientText'
import Button from '../shared/Button'

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
      {/* Subtle background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg" />

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-sm font-medium text-muted tracking-widest uppercase"
      >
        Embedded Systems &amp; Creative Code
      </motion.p>

      <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
        Hello, I&apos;m{' '}
        <GradientText>Aphrosyne</GradientText>
      </h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-6 max-w-lg text-lg text-muted"
      >
        Building at the intersection of hardware and software.
        Exploring embedded systems, web development, and everything in between.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-4"
      >
        <Button href="/projects">View Projects</Button>
        <Button href="/blog" variant="outline">
          Read Blog
        </Button>
      </motion.div>
    </section>
  )
}
