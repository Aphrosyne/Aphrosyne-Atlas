'use client'

import { useReducedMotion } from 'framer-motion'

/** Shared reduced-motion policy for CSS, Framer Motion, and imperative scrolling. */
export function useMotionPolicy() {
  const shouldReduceMotion = useReducedMotion() ?? false

  return {
    shouldReduceMotion,
    scrollBehavior: shouldReduceMotion ? 'auto' as const : 'smooth' as const,
  }
}
