'use client'

import { useState, useEffect } from 'react'

interface SteamGame {
  name: string
  appId: number
  playtime2weeks: number
  playtimeForever: number
  icon: string
}

export default function SteamCard() {
  const [games, setGames] = useState<SteamGame[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/steam')
      .then(r => r.json())
      .then(data => setGames(data.games || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-[11px] text-white/30">加载中...</p>
  }

  if (games.length === 0) {
    return <p className="text-[11px] text-white/30">暂无游玩记录</p>
  }

  return (
    <div className="flex flex-col gap-2">
      {games.slice(0, 4).map(g => (
        <a
          key={g.appId}
          href={`https://store.steampowered.com/app/${g.appId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 group"
        >
          <img
            src={g.icon}
            alt=""
            className="w-8 h-8 rounded-lg object-cover shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium text-white/70 truncate group-hover:text-accent transition-colors">
              {g.name}
            </div>
            <div className="text-[10px] text-white/30">
              {g.playtime2weeks > 0
                ? `近两周 ${Math.round(g.playtime2weeks / 60)}h`
                : `共 ${Math.round(g.playtimeForever / 60)}h`}
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}
