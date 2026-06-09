'use client'

import { useState, useEffect } from 'react'

function formatTime(d: Date) {
  return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
}

function formatDate(d: Date) {
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  const m = d.getMonth() + 1
  const day = d.getDate()
  const w = weekdays[d.getDay()]
  return `${m}月${day}日 · 周${w}`
}

export default function ClockCard() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!now) {
    return (
      <div className="flex flex-col items-center justify-center gap-1">
        <div className="text-2xl font-mono font-light tracking-wider text-white/20">--:--:--</div>
        <div className="text-[11px] text-white/20">加载中...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <div className="text-2xl font-mono font-light tracking-wider text-white">
        {formatTime(now)}
      </div>
      <div className="text-[11px] text-white/40">
        {formatDate(now)}
      </div>
    </div>
  )
}
