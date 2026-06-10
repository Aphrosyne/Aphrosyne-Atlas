import { useState } from 'react'

export function useBounce() {
  const [bouncing, setBouncing] = useState(false)

  const bounce = () => {
    setBouncing(true)
    setTimeout(() => setBouncing(false), 300)
  }

  const bounceStyle = {
    transform: bouncing ? 'scale(1.2)' as const : 'scale(1)' as const,
    transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
  }

  return { bounce, bounceStyle }
}
