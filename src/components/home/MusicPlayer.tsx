'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface SongData {
  id: string
  url: string
  title: string
  artist: string
  cover: string
  duration: number
}

const DEFAULT_VOLUME = 0.5

export default function MusicPlayer({ onAnalyser }: { onAnalyser?: (analyser: AnalyserNode) => void }) {
  const [song, setSong] = useState<SongData | null>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [loading, setLoading] = useState(true)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [volume, setVolume] = useState(DEFAULT_VOLUME)

  const audioRef = useRef<HTMLAudioElement>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)

  // Fetch song data + audio blob on mount
  useEffect(() => {
    fetch('/api/music')
      .then(r => r.json())
      .then(async data => {
        if (!data.url) return
        setSong(data)
        // Fetch audio as blob to avoid CORS with Web Audio API
        try {
          const res = await fetch(data.url)
          const blob = await res.blob()
          setBlobUrl(URL.createObjectURL(blob))
        } catch {
          // Fallback: use direct URL (FFT won't work but audio might play)
          setBlobUrl(null)
        }
      })
      .catch(() => {})
      .finally(() => { setLoading(false); setReady(true) })
  }, [])

  // Apply volume to audio element
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  // Cleanup blob URL
  useEffect(() => {
    return () => { if (blobUrl) URL.revokeObjectURL(blobUrl) }
  }, [blobUrl])

  // Setup AudioContext + AnalyserNode
  const setupAudio = useCallback(() => {
    if (!audioRef.current || ctxRef.current) return
    const ctx = new AudioContext()
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 256
    const source = ctx.createMediaElementSource(audioRef.current)
    source.connect(analyser)
    analyser.connect(ctx.destination)
    ctxRef.current = ctx
    sourceRef.current = source
    onAnalyser?.(analyser)
  }, [onAnalyser])

  const togglePlay = useCallback(async () => {
    if (!audioRef.current) return
    setupAudio()
    if (ctxRef.current?.state === 'suspended') {
      await ctxRef.current.resume()
    }
    if (playing) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setPlaying(!playing)
  }, [playing, setupAudio])

  // Sync currentTime
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setCurrentTime(audio.currentTime)
    const onEnd = () => setPlaying(false)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended', onEnd)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('ended', onEnd)
    }
  }, [song])

  const formatSec = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const progress = song ? currentTime / song.duration : 0
  const audioSrc = blobUrl || song?.url

  return (
    <div className="flex flex-col gap-2 w-full">
      {audioSrc && <audio ref={audioRef} src={audioSrc} preload="auto" />}

      {/* Cover + info */}
      <div className="flex items-center gap-3">
        {song?.cover ? (
          <img src={song.cover} alt="" className="w-10 h-10 rounded-lg object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-lg">
            {loading ? '⏳' : '🎵'}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-white/80 truncate">
            {song?.title || (loading ? '加载中...' : '无法获取')}
          </div>
          <div className="text-[10px] text-white/40 truncate">
            {song?.artist || '网易云音乐'}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <span className="text-[14px] text-white/50 w-8 text-right font-mono">
          {formatSec(currentTime)}
        </span>
        <DragSlider value={progress} onChange={v => { if (audioRef.current && song) audioRef.current.currentTime = v * song.duration }} />
        <span className="text-[14px] text-white/50 w-8 font-mono">
          {song ? formatSec(song.duration) : '0:00'}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center">
        <button
          onClick={togglePlay}
          className={`w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white transition-colors cursor-pointer ${ready ? 'hover:bg-white/20' : 'opacity-30 pointer-events-none'}`}
          aria-label={playing ? '暂停' : '播放'}
        >
          {playing ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
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
