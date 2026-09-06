import type { Metadata } from 'next'
import { Suspense } from 'react'
import KnowledgeList from '@/components/knowledge/KnowledgeList'
import PageTransition from '@/components/shared/PageTransition'
import { getAllKnowledge } from '@/lib/knowledge'

export const metadata: Metadata = {
  title: 'Knowledge',
  description: '教程、问题修复、实验记录与参考资料。',
}

export default async function KnowledgePage() {
  const entries = await getAllKnowledge()

  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <PageTransition>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Knowledge</h1>
        <p className="mt-2 text-white/55">按分类、版本与验证状态整理的长期记录。</p>
      </PageTransition>
      <div className="mt-8">
        <Suspense fallback={<p className="rounded-2xl border border-border/50 bg-surface/50 px-5 py-12 text-center text-fg/45">正在加载知识库…</p>}>
          <KnowledgeList entries={entries} />
        </Suspense>
      </div>
    </main>
  )
}
