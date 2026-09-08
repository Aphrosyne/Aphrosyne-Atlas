import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug, getPostSlugs, getAdjacentPosts } from '@/lib/posts'
import PostHeader from '@/components/blog/PostHeader'
import TableOfContents from '@/components/blog/TableOfContents'
import CopyAttribution from '@/components/blog/CopyAttribution'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const meta = await getPostBySlug(slug)
  return meta ? { title: meta.title, description: meta.excerpt } : { title: 'Post Not Found' }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params

  try {
    const meta = await getPostBySlug(slug)
    if (!meta) notFound()
    const { default: Post } = await import(`@/content/blog/${slug}.mdx`)
    const { prev, next } = await getAdjacentPosts(slug)

    return (
      <main className="relative mx-auto max-w-5xl px-4 py-12">
        <div className="rounded-[2rem] border border-border/40 bg-surface/50 p-5 shadow-[0_25px_80px_rgba(0,0,0,0.32)] backdrop-blur-md sm:p-8">
            {/* Back link */}
            <Link href="/blog" className="inline-flex items-center gap-1 rounded-xl bg-surface/40 backdrop-blur-sm border border-border/10 px-4 py-2.5 text-base font-semibold text-fg/60 hover:bg-surface/60 hover:text-fg transition-colors mb-8">
              ← 返回博客
            </Link>

            <div className="flex gap-8 justify-center">
              {/* Main content */}
              <div className="max-w-4xl flex-1 min-w-0">
                <CopyAttribution>
                  <article id="article-content" className="prose dark:prose-invert prose-headings:font-semibold prose-a:text-accent prose-a:no-underline [&_a:hover]:text-avatar-ring [&_a]:transition-colors prose-hr:border-t-2 prose-hr:border-fg [&_table]:border-2 [&_table]:border-fg [&_th]:border-2 [&_th]:border-fg [&_th]:px-3 [&_th]:py-2 [&_td]:border-2 [&_td]:border-fg [&_td]:px-3 [&_td]:py-2 [&_thead_tr]:bg-accent/50 [&_tbody_tr:nth-child(even)]:bg-surface/70 prose-pre:border-0 prose-pre:bg-transparent prose-code:rounded prose-code:bg-code-bg/40 [&_pre_code]:bg-transparent prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm max-w-none">
                    <PostHeader {...meta} />
                    <Post />
                  </article>
                </CopyAttribution>

                {/* Prev / Next */}
                <nav className="mt-12 flex gap-4">
                  {prev ? (
                    <Link href={`/blog/${prev.slug}`} className="group flex-1 rounded-xl bg-surface/40 backdrop-blur-sm border border-border/10 p-4 hover:bg-surface/60 transition-colors">
                      <span className="text-base font-semibold text-fg/40 group-hover:text-fg transition-colors">上一篇</span>
                      <p className="mt-1 text-lg text-fg/70 group-hover:text-fg transition-colors truncate">{prev.title}</p>
                    </Link>
                  ) : <div className="flex-1" />}
                  {next ? (
                    <Link href={`/blog/${next.slug}`} className="group flex-1 rounded-xl bg-surface/40 backdrop-blur-sm border border-border/10 p-4 hover:bg-surface/60 transition-colors text-right">
                      <span className="text-base font-semibold text-fg/40 group-hover:text-fg transition-colors">下一篇</span>
                      <p className="mt-1 text-lg text-fg/70 group-hover:text-fg transition-colors truncate">{next.title}</p>
                    </Link>
                  ) : <div className="flex-1" />}
                </nav>
              </div>

              {/* TOC sidebar — sticky, follows while scrolling */}
              <aside className="hidden lg:block w-48 shrink-0">
                <TableOfContents />
              </aside>
            </div>

        </div>
      </main>
    )
  } catch {
    notFound()
  }
}

export async function generateStaticParams() {
  const slugs = await getPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export const dynamicParams = false
