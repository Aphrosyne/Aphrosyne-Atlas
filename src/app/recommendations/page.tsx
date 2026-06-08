import type { Metadata } from 'next'
import { recommendations } from '@/lib/recommendations'

export const metadata: Metadata = {
  title: '推荐',
  description: '我推荐的网站、软件和工具',
}

export default function RecommendationsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-3xl font-bold tracking-tight text-white text-center">推荐</h1>
      <p className="mt-3 text-center text-sm text-white/50">我用过觉得好的网站、软件和工具</p>
      <div className="mt-12 flex flex-col gap-8">
        {recommendations.map((cat) => (
          <section key={cat.title}>
            <h2 className="text-lg font-semibold text-white mb-4">{cat.icon} {cat.title}</h2>
            <div className="grid gap-3">
              {cat.items.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl bg-white/3 backdrop-blur-md border border-white/10 p-4 hover:border-white/20 hover:bg-white/[0.05] transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white group-hover:text-accent transition-colors">{item.name}</span>
                    <svg className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="mt-1 text-sm text-white/50">{item.description}</p>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
