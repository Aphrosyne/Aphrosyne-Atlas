'use client'

import { useState } from 'react'
import {
  DASHBOARD_CARD_IDS,
  DASHBOARD_LAYOUT,
  type DashboardCardId,
  type DashboardLayoutItem,
} from '@/config/dashboard-layout'

const LABELS: Record<DashboardCardId, string> = {
  bio: 'Profile',
  posts: 'Recent Posts',
  knowledge: 'Knowledge',
  projects: 'Projects',
  tagcloud: 'Tag Cloud',
  memes: 'Meme',
  status: 'Status',
  clock: 'Clock',
  hitokoto: 'Hitokoto',
}

type Layout = Record<DashboardCardId, DashboardLayoutItem>

function cloneLayout(): Layout {
  return Object.fromEntries(
    DASHBOARD_CARD_IDS.map((id) => [id, { ...DASHBOARD_LAYOUT[id] }]),
  ) as Layout
}

function clamp(item: DashboardLayoutItem): DashboardLayoutItem {
  const columnSpan = Math.max(1, Math.min(12, item.columnSpan))
  const rowSpan = Math.max(1, Math.min(6, item.rowSpan))
  return {
    ...item,
    columnSpan,
    rowSpan,
    column: Math.max(1, Math.min(13 - columnSpan, item.column)),
    row: Math.max(1, Math.min(7 - rowSpan, item.row)),
  }
}

function asConfig(layout: Layout) {
  const entries = DASHBOARD_CARD_IDS.map((id) => {
    const item = layout[id]
    return `  ${id}: { column: ${item.column}, row: ${item.row}, columnSpan: ${item.columnSpan}, rowSpan: ${item.rowSpan} },`
  })
  return `export const DASHBOARD_LAYOUT = {\n${entries.join('\n')}\n} satisfies Record<DashboardCardId, DashboardLayoutItem>\n`
}

export default function DashboardStudio() {
  const [layout, setLayout] = useState<Layout>(cloneLayout)
  const [selected, setSelected] = useState<DashboardCardId>('bio')
  const [message, setMessage] = useState('拖动卡片调整位置；右侧按钮调整尺寸。')

  const update = (change: Partial<DashboardLayoutItem>) => {
    setLayout((current) => ({
      ...current,
      [selected]: clamp({ ...current[selected], ...change }),
    }))
  }

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const id = event.dataTransfer.getData('text/dashboard-card') as DashboardCardId
    if (!DASHBOARD_CARD_IDS.includes(id)) return
    const rect = event.currentTarget.getBoundingClientRect()
    const column = Math.floor(((event.clientX - rect.left) / rect.width) * 12) + 1
    const row = Math.floor(((event.clientY - rect.top) / rect.height) * 6) + 1
    setLayout((current) => ({
      ...current,
      [id]: clamp({ ...current[id], column, row }),
    }))
    setSelected(id)
    setMessage(`${LABELS[id]} 已移动；重叠时请继续拖动或调整尺寸。`)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(asConfig(layout))
    setMessage('布局配置已复制。替换 src/config/dashboard-layout.ts 中的对象后保存即可。')
  }

  const download = () => {
    const blob = new Blob([asConfig(layout)], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'dashboard-layout.ts.txt'
    link.click()
    URL.revokeObjectURL(url)
    setMessage('已下载布局配置。')
  }

  const current = layout[selected]

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 text-fg">
      <div className="mb-8">
        <p className="text-xs tracking-[0.25em] uppercase text-accent">Local tool</p>
        <h1 className="mt-2 text-3xl font-semibold">Dashboard Layout Studio</h1>
        <p className="mt-3 max-w-2xl text-sm text-fg/60">仅用于本地编辑布局；它不会向 GitHub Pages 或仓库写入任何内容。</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <section
          onDragOver={(event) => event.preventDefault()}
          onDrop={onDrop}
          className="grid min-h-180 grid-cols-12 grid-rows-[repeat(6,minmax(88px,1fr))] gap-2 rounded-3xl border border-border/20 bg-surface/50 p-3 backdrop-blur-xl"
        >
          {DASHBOARD_CARD_IDS.map((id) => {
            const item = layout[id]
            const isSelected = id === selected
            return (
              <button
                key={id}
                draggable
                onDragStart={(event) => event.dataTransfer.setData('text/dashboard-card', id)}
                onClick={() => setSelected(id)}
                style={{ gridColumn: `${item.column} / span ${item.columnSpan}`, gridRow: `${item.row} / span ${item.rowSpan}` }}
                className={`rounded-2xl border p-3 text-left transition-colors ${isSelected ? 'border-accent bg-accent/15 shadow-[0_0_0_1px_var(--color-accent)]' : 'border-border/15 bg-white/4 hover:bg-white/8'}`}
              >
                <span className="block text-xs font-semibold">{LABELS[id]}</span>
                <span className="mt-2 block text-[10px] text-fg/45">{item.column}–{item.column + item.columnSpan - 1} 列 · 第 {item.row} 行</span>
              </button>
            )
          })}
        </section>

        <aside className="rounded-3xl border border-border/20 bg-surface/50 p-5 backdrop-blur-xl">
          <p className="text-xs tracking-widest uppercase text-fg/45">Selected</p>
          <h2 className="mt-2 text-lg font-semibold">{LABELS[selected]}</h2>
          <p className="mt-2 text-xs leading-relaxed text-fg/55">{message}</p>
          <div className="mt-6 grid grid-cols-2 gap-2 text-sm">
            <button onClick={() => update({ column: current.column - 1 })} className="rounded-xl bg-white/6 px-3 py-2 hover:bg-white/10">← 左移</button>
            <button onClick={() => update({ column: current.column + 1 })} className="rounded-xl bg-white/6 px-3 py-2 hover:bg-white/10">右移 →</button>
            <button onClick={() => update({ row: current.row - 1 })} className="rounded-xl bg-white/6 px-3 py-2 hover:bg-white/10">↑ 上移</button>
            <button onClick={() => update({ row: current.row + 1 })} className="rounded-xl bg-white/6 px-3 py-2 hover:bg-white/10">下移 ↓</button>
            <button onClick={() => update({ columnSpan: current.columnSpan - 1 })} className="rounded-xl bg-white/6 px-3 py-2 hover:bg-white/10">缩窄</button>
            <button onClick={() => update({ columnSpan: current.columnSpan + 1 })} className="rounded-xl bg-white/6 px-3 py-2 hover:bg-white/10">加宽</button>
            <button onClick={() => update({ rowSpan: current.rowSpan - 1 })} className="rounded-xl bg-white/6 px-3 py-2 hover:bg-white/10">变矮</button>
            <button onClick={() => update({ rowSpan: current.rowSpan + 1 })} className="rounded-xl bg-white/6 px-3 py-2 hover:bg-white/10">加高</button>
          </div>
          <button onClick={() => { setLayout(cloneLayout()); setMessage('已恢复当前源码中的布局。') }} className="mt-6 w-full rounded-xl border border-border/20 px-3 py-2 text-sm hover:bg-white/6">恢复默认</button>
          <button onClick={copy} className="mt-2 w-full rounded-xl bg-accent px-3 py-2 text-sm font-medium text-white">复制 TypeScript 配置</button>
          <button onClick={download} className="mt-2 w-full rounded-xl border border-border/20 px-3 py-2 text-sm hover:bg-white/6">下载配置文件</button>
        </aside>
      </div>
    </main>
  )
}
