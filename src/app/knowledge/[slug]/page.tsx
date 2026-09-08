import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import TableOfContents from '@/components/blog/TableOfContents'
import { KNOWLEDGE_ARTICLE_LOADERS } from '@/lib/knowledge-articles'
import { getAllKnowledge, getKnowledgeBySlug, getKnowledgeSlugs } from '@/lib/knowledge'

type Props = { params: Promise<{ slug: string }> }

const STATUS_LABELS = {
  verified: '已验证',
  'needs-review': '待复查',
  outdated: '已过时',
} as const

const STATUS_CLASSES = {
  verified: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  'needs-review': 'border-amber-400/30 bg-amber-400/10 text-amber-200',
  outdated: 'border-rose-400/30 bg-rose-400/10 text-rose-200',
} as const

const TYPE_LABELS = {
  guide: '教程',
  fix: '问题修复',
  experiment: '实验记录',
  reference: '参考资料',
} as const

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const entry = await getKnowledgeBySlug((await params).slug)
  return entry ? { title: entry.title, description: entry.excerpt } : { title: 'Knowledge Not Found' }
}

export default async function KnowledgeArticlePage({ params }: Props) {
  const { slug } = await params
  const entry = await getKnowledgeBySlug(slug)
  if (!entry) notFound()

  const loadArticle = KNOWLEDGE_ARTICLE_LOADERS[slug]
  if (!loadArticle) notFound()

  const { default: Article } = await loadArticle()
  const categories = await getAllKnowledge()

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="rounded-[2rem] border border-border/40 bg-surface/50 p-5 shadow-[0_25px_80px_rgba(0,0,0,0.32)] backdrop-blur-md sm:p-8">
          <Link href="/knowledge" className="inline-flex rounded-xl border border-border/20 bg-surface/40 px-4 py-2.5 text-base font-semibold text-fg/65 transition-colors hover:bg-surface/60 hover:text-fg">
            ← 返回知识库
          </Link>
          <div className="mt-8 grid gap-8 lg:grid-cols-[12rem_minmax(0,1fr)_12rem]">
            <aside className="order-2 lg:order-1">
              <details className="rounded-xl border border-border/50 bg-surface/35 p-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-hidden" open>
                <summary className="cursor-pointer text-xs font-medium tracking-widest text-fg/45 uppercase">知识库导航</summary>
                <ul className="mt-3 space-y-1 text-sm lg:max-h-[calc(100vh-11rem)] lg:overflow-y-auto lg:overscroll-contain lg:pr-1">
                  {categories.map((item) => (
                    <li key={item.slug}>
                      <Link href={`/knowledge/${item.slug}`} title={item.title} className={`block truncate rounded-lg px-2 py-1.5 transition-colors ${item.slug === slug ? 'bg-accent/15 text-accent' : 'text-fg/60 hover:bg-surface hover:text-fg'}`}>
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </aside>

            <article id="article-content" className="order-1 prose max-w-none prose-headings:font-semibold prose-a:text-accent prose-a:no-underline [&_a:hover]:text-avatar-ring [&_a]:transition-colors prose-pre:border-0 prose-pre:bg-transparent prose-code:rounded prose-code:bg-code-bg/40 prose-code:px-1.5 prose-code:py-0.5 dark:prose-invert lg:order-2">
              <header className="mb-10 not-prose">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-accent/15 px-2.5 py-1 text-accent">{TYPE_LABELS[entry.type]}</span>
                  <span className={`rounded-full border px-2.5 py-1 ${STATUS_CLASSES[entry.status]}`}>{STATUS_LABELS[entry.status]}</span>
                  {entry.publication === 'archived' && <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-amber-800 dark:text-amber-200">归档</span>}
                  {entry.gameVersion && <span className="text-fg/50">适用版本：{entry.gameVersion}</span>}
                </div>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-fg sm:text-4xl">{entry.title}</h1>
                <p className="mt-3 leading-7 text-fg/60">{entry.excerpt}</p>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-fg/45">
                  {entry.lastEdited && <p>最后编辑：{entry.lastEdited}</p>}
                  {entry.lastVerified && <p>最后验证：{entry.lastVerified}</p>}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">{entry.tags.map((tag) => <span key={tag} className="rounded-full bg-surface px-2.5 py-1 text-xs text-fg/55">{tag}</span>)}</div>
              </header>
              <Article />
              {(entry.related.length > 0 || entry.sources.length > 0) && (
                <footer className="not-prose mt-12 space-y-5 rounded-2xl border border-border/50 bg-surface/35 p-5">
                  {entry.related.length > 0 && <p className="text-sm text-fg/60">相关文档：{entry.related.join('、')}</p>}
                  {entry.sources.length > 0 && <div><p className="text-sm text-fg/60">来源</p><ul className="mt-2 space-y-1">{entry.sources.map((source) => <li key={source.href}><a className="text-sm text-accent hover:underline" href={source.href} target="_blank" rel="noreferrer">{source.label}</a></li>)}</ul></div>}
                </footer>
              )}
            </article>

            <aside className="order-3 hidden lg:block"><TableOfContents /></aside>
          </div>
        </div>
    </main>
  )
}

export async function generateStaticParams() {
  return (await getKnowledgeSlugs()).map((slug) => ({ slug }))
}

export const dynamicParams = false
