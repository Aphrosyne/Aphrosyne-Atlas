import Link from 'next/link'

export default function KnowledgeNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">未找到知识库条目</h1>
      <p className="mt-3 text-fg/60">这个条目可能尚未发布，或链接已经变更。</p>
      <Link href="/knowledge" className="mt-8 inline-flex rounded-xl bg-accent-fill px-4 py-2.5 font-semibold text-on-accent">返回知识库</Link>
    </div>
  )
}
