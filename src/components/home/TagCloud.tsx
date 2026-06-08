'use client'

import { useEffect, useState } from 'react'

interface TagCloudProps {
  tags: string[]
}

export default function TagCloud({ tags }: TagCloudProps) {
  const [ready, setReady] = useState(false)
  useEffect(() => { setReady(true) }, [])

  const r = 120

  return (
    <div className="relative w-64 h-64 mx-auto" style={{ perspective: '800px' }}>
      {/* Placeholder — always rendered, fixes layout shift */}
      {!ready && <div className="w-full h-full" />}
      {ready && (
        <>
          <div
            className="w-full h-full relative"
            style={{
              transformStyle: 'preserve-3d',
              animation: 'rotateSphere 20s linear infinite',
            }}
          >
            {tags.map((tag, i) => {
              const phi = Math.acos(-1 + (2 * i + 1) / tags.length)
              const theta = Math.sqrt(tags.length * Math.PI) * phi
              const x = r * Math.cos(theta) * Math.sin(phi)
              const y = r * Math.sin(theta) * Math.sin(phi)
              const z = r * Math.cos(phi)

              return (
                <span
                  key={tag}
                  className="absolute left-1/2 top-1/2 text-sm font-medium text-white/70 cursor-default"
                  style={{
                    transform: `translate(-50%, -50%) translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px)`,
                    animation: `counterRotate-${i} 20s linear infinite`,
                  }}
                >
                  {tag}
                </span>
              )
            })}
          </div>
          <style>{`
            @keyframes rotateSphere {
              from { transform: rotateY(0deg); }
              to { transform: rotateY(360deg); }
            }
            ${tags.map((_, i) => {
              const phi = Math.acos(-1 + (2 * i + 1) / tags.length)
              const theta = Math.sqrt(tags.length * Math.PI) * phi
              const x = (r * Math.cos(theta) * Math.sin(phi)).toFixed(2)
              const y = (r * Math.sin(theta) * Math.sin(phi)).toFixed(2)
              const z = (r * Math.cos(phi)).toFixed(2)
              return `
                @keyframes counterRotate-${i} {
                  from { transform: translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotateY(0deg); }
                  to { transform: translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotateY(-360deg); }
                }
              `
            }).join('')}
          `}</style>
        </>
      )}
    </div>
  )
}
