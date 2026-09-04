'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

const DEFAULT_VOLUME = 0.5

export default function MusicPlayer() {
  const [volume, setVolume] = useState(DEFAULT_VOLUME)

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Cover + info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-lg">🎵</div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-white/80 truncate">
            静态导出中不可用
          </div>
          <div className="text-[10px] text-white/40 truncate">
            音乐播放器
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <span className="text-[14px] text-white/50 w-8 text-right font-mono">
          0:00
        </span>
        <DragSlider value={0} onChange={() => {}} />
        <span className="text-[14px] text-white/50 w-8 font-mono">
          0:00
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center">
        <button
          disabled
          className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white opacity-30 cursor-not-allowed"
          aria-label="静态导出中不可用"
        >
          <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2 px-1" onDoubleClick={() => setVolume(DEFAULT_VOLUME)}>
        <svg className="w-4 h-4 text-white/50 shrink-0" fill="currentColor" viewBox="4 4 20 20">
          <path d="M3 9v6h4l5 5V4L7 9zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02" />
        </svg>
        <DragSlider value={volume} onChange={v => setVolume(Math.round(v * 10) / 10)} />
        <span className="text-[14px] text-white/50 w-6 text-right font-mono">
          {Math.round(volume * 100)}%
        </span>
      </div>
    </div>
  )
}

function DragSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const calc = useCallback((clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect) return
    onChange(Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)))
  }, [onChange])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return
      e.preventDefault()
      calc(e.clientX)
    }
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging.current) return
      calc(e.touches[0].clientX)
    }
    const onUp = () => { dragging.current = false }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    document.addEventListener('touchmove', onTouchMove, { passive: true })
    document.addEventListener('touchend', onUp)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onUp)
    }
  }, [calc])

  return (
    <div
      ref={trackRef}
      className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden cursor-pointer"
      onMouseDown={e => { dragging.current = true; calc(e.clientX) }}
      onTouchStart={e => { dragging.current = true; calc(e.touches[0].clientX) }}
    >
      <div
        className="h-full bg-accent rounded-full transition-[width] duration-75"
        style={{ width: `${value * 100}%` }}
      />
    </div>
  )
}
