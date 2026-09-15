import { useState, useCallback, useMemo } from 'react'
import { useMotionPolicy } from '@/lib/use-motion-policy'

export function useBounce() {
  const { shouldReduceMotion } = useMotionPolicy()
  const [bouncing, setBouncing] = useState(false)

  const bounce = useCallback(() => {
    if (shouldReduceMotion) return
    setBouncing(true)
    setTimeout(() => setBouncing(false), 300)
  }, [shouldReduceMotion])

  const bounceStyle = useMemo(() => ({
    transform: !shouldReduceMotion && bouncing ? 'scale(1.2)' as const : 'scale(1)' as const,
    transition: shouldReduceMotion ? 'none' : 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
  }), [bouncing, shouldReduceMotion])

  return { bounce, bounceStyle }
}
