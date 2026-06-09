'use client'

import { useEffect, useRef, useState } from 'react'

const demos = [
  { id: 'cube', title: 'CSS 3D 立方体', description: '纯 CSS 3D 旋转立方体' },
  { id: 'particles', title: '粒子跟随', description: 'Canvas 粒子跟随鼠标效果' },
]

export default function PlaygroundPage() {
  const [active, setActive] = useState(() => demos[Math.floor(Math.random() * demos.length)].id)

  return (
    <div className="mx-auto max-w-5xl px-4 py-20">
      <h1 className="text-3xl font-bold tracking-tight text-white text-center">Playground</h1>
      <p className="mt-3 text-center text-sm text-white/50">前端小玩意，写着玩的</p>

      <div className="mt-8 flex justify-center gap-2">
        {demos.map(demo => (
          <button
            key={demo.id}
            onClick={() => setActive(demo.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
              active === demo.id
                ? 'bg-accent text-white'
                : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
            }`}
          >
            {demo.title}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {active === 'cube' && <CubeDemo />}
        {active === 'particles' && <ParticlesDemo />}
      </div>
    </div>
  )
}

/* ─── CSS 3D Cube ─── */

function CubeDemo() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-48 h-48" style={{ perspective: '600px' }}>
        <div
          className="relative w-full h-full"
          style={{
            transformStyle: 'preserve-3d',
            animation: 'spin-cube 8s linear infinite',
          }}
        >
          {['front', 'back', 'right', 'left', 'top', 'bottom'].map(face => (
            <div
              key={face}
              className="absolute w-48 h-48 border border-accent/40 bg-accent/5 backdrop-blur-sm flex items-center justify-center text-accent/60 text-sm"
              style={faceStyles[face]}
            >
              {face}
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-white/30">纯 CSS 3D 变换，无 JavaScript</p>
      <style>{`
        @keyframes spin-cube {
          from { transform: rotateX(0deg) rotateY(0deg); }
          to { transform: rotateX(360deg) rotateY(360deg); }
        }
      `}</style>
    </div>
  )
}

const faceStyles: Record<string, React.CSSProperties> = {
  front:  { transform: 'translateZ(96px)' },
  back:   { transform: 'rotateY(180deg) translateZ(96px)' },
  right:  { transform: 'rotateY(90deg) translateZ(96px)' },
  left:   { transform: 'rotateY(-90deg) translateZ(96px)' },
  top:    { transform: 'rotateX(90deg) translateZ(96px)' },
  bottom: { transform: 'rotateX(-90deg) translateZ(96px)' },
}

/* ─── Particle Mouse Follow ─── */

function ParticlesDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number }[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    mouseRef.current = { x: rect.width / 2, y: rect.height / 2 }

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    canvas.addEventListener('mousemove', onMove)

    let frame: number
    const animate = () => {
      ctx.clearRect(0, 0, rect.width, rect.height)
      const { x, y } = mouseRef.current

      // Spawn particles
      for (let i = 0; i < 3; i++) {
        particlesRef.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          life: 1,
        })
      }

      // Update + draw
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.02
        if (p.life <= 0) return false
        ctx.beginPath()
        ctx.arc(p.x, p.y, 2 * p.life, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(75, 169, 178, ${p.life})`
        ctx.fill()
        return true
      })

      // Cap particle count
      if (particlesRef.current.length > 500) {
        particlesRef.current = particlesRef.current.slice(-500)
      }

      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frame)
      canvas.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        className="w-full h-80 rounded-2xl bg-white/3 border border-white/10 cursor-crosshair"
      />
      <p className="text-xs text-white/30">移动鼠标产生粒子</p>
    </div>
  )
}
