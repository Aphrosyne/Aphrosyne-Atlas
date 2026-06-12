'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

const BAR_COUNT = 32
const BAR_GAP = 2

function generatePlaceholderHeights(): number[] {
  const heights: number[] = []
  for (let i = 0; i < BAR_COUNT; i++) {
    const base = 0.3 + 0.4 * Math.sin((i / BAR_COUNT) * Math.PI * 0.7)
    const noise = Math.random() * 0.3
    heights.push(Math.min(1, base + noise))
  }
  return heights
}

export default function FFTVisualizer({ analyser }: { analyser?: AnalyserNode | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [placeholder, setPlaceholder] = useState<number[]>(() => new Array(BAR_COUNT).fill(0.3))
  const frameRef = useRef<number>(0)

  useEffect(() => {
    setPlaceholder(generatePlaceholderHeights())
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const barWidth = (rect.width - BAR_GAP * (BAR_COUNT - 1)) / BAR_COUNT
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim() || '#4ba9b2'

    ctx.clearRect(0, 0, rect.width, rect.height)

    let heights: number[]

    if (analyser) {
      // Real FFT data
      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      analyser.getByteFrequencyData(dataArray)
      // Sample BAR_COUNT bins from the lower frequencies (where most music energy is)
      const step = Math.floor(dataArray.length / BAR_COUNT)
      heights = []
      for (let i = 0; i < BAR_COUNT; i++) {
        const val = dataArray[i * step] / 255
        heights.push(val)
      }
    } else {
      // Placeholder: animate gently
      heights = placeholder.map((h, i) => {
        const t = Date.now() / 2000
        return h * (0.6 + 0.4 * Math.sin(t + i * 0.3))
      })
    }

    for (let i = 0; i < BAR_COUNT; i++) {
      const h = Math.max(2, heights[i] * rect.height * 0.9)
      const x = i * (barWidth + BAR_GAP)
      const y = rect.height - h

      const grad = ctx.createLinearGradient(x, y, x, rect.height)
      grad.addColorStop(0, accent)
      grad.addColorStop(1, 'rgba(75, 169, 178, 0.15)')
      ctx.fillStyle = grad

      ctx.beginPath()
      ctx.roundRect(x, y, barWidth, h, 2)
      ctx.fill()
    }

    frameRef.current = requestAnimationFrame(draw)
  }, [analyser, placeholder])

  useEffect(() => {
    frameRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frameRef.current)
  }, [draw])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: 'block' }}
    />
  )
}
