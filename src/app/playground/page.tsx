import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Playground',
  description: '前端小动画、CSS 实验、交互 Demo',
}

const demos = [
  { title: 'CSS 3D 立方体', slug: 'css-cube', description: '纯 CSS 3D 旋转立方体' },
  { title: '粒子文字', slug: 'particle-text', description: 'Canvas 粒子聚合文字效果' },
  { title: '毛玻璃生成器', slug: 'glassmorphism', description: '实时预览毛玻璃 CSS 参数' },
]

export default function PlaygroundPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-20">
      <h1 className="text-3xl font-bold tracking-tight text-white text-center">Playground</h1>
      <p className="mt-3 text-center text-sm text-white/50">前端小玩意，写着玩的</p>
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {demos.map((demo) => (
          <div key={demo.slug}
            className="rounded-2xl bg-white/3 backdrop-blur-md border border-white/10 p-6 hover:border-white/20 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-2xl mb-4">🎮</div>
            <h3 className="text-lg font-semibold text-white">{demo.title}</h3>
            <p className="mt-2 text-sm text-white/50">{demo.description}</p>
          </div>
        ))}
      </div>
      <p className="mt-12 text-center text-xs text-white/30">更多 demo 制作中...</p>
    </div>
  )
}
