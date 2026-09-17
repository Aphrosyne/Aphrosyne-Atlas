import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug, getPostSlugs, getAdjacentPosts } from '@/lib/posts'
import { siteUrl } from '@/lib/site-url'
import PostHeader from '@/components/blog/PostHeader'
import TableOfContents from '@/components/blog/TableOfContents'
import CopyAttribution from '@/components/blog/CopyAttribution'
import { ARTICLE_PROSE_CLASS } from '@/components/content/article-prose'
import PageTransition from '@/components/shared/PageTransition'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const meta = await getPostBySlug(slug)
  return meta
    ? { title: meta.title, description: meta.excerpt, alternates: { canonical: siteUrl(`/blog/${slug}`) } }
    : { title: 'Post Not Found' }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const meta = await getPostBySlug(slug)
  if (!meta) notFound()
  const { default: Post } = await import(`@/content/blog/${slug}.mdx`)
  const { prev, next } = await getAdjacentPosts(slug)

  return (
    <div className="relative mx-auto w-full min-w-0 max-w-5xl px-4 py-12">
        <div className="min-w-0 rounded-[2rem] border border-border/40 bg-reading-surface p-5 shadow-[0_25px_80px_rgba(0,0,0,0.32)] backdrop-blur-md sm:p-8">
            {/* Back link */}
            <Link href="/blog" className="mb-8 inline-flex min-h-11 items-center gap-1 rounded-xl border border-border/10 bg-surface/40 px-4 py-2.5 text-base font-semibold text-fg/60 backdrop-blur-sm transition-colors hover:bg-surface/60 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
              ← 返回博客
            </Link>

            <div className="flex min-w-0 justify-center gap-8">
              {/* Main content */}
              <div className="max-w-4xl flex-1 min-w-0">
                <CopyAttribution>
                  <article id="article-content" className={ARTICLE_PROSE_CLASS}>
                    <PostHeader {...meta} />
                    <details className="not-prose mb-8 rounded-xl border border-border/50 bg-surface/35 p-3 lg:hidden">
                      <summary className="cursor-pointer rounded-lg px-2 py-1 text-sm font-semibold text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">本篇目录</summary>
                      <div className="mt-3"><TableOfContents variant="mobile" /></div>
                    </details>
                    <PageTransition fade={false}><Post /></PageTransition>
                  </article>
                </CopyAttribution>

                {/* Prev / Next */}
                <nav className="mt-12 flex flex-col gap-4 sm:flex-row">
                  {prev ? (
                    <Link href={`/blog/${prev.slug}`} className="group min-w-0 flex-1 rounded-xl border border-border/10 bg-surface/40 p-4 backdrop-blur-sm transition-colors hover:bg-surface/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                      <span className="text-base font-semibold text-fg/40 group-hover:text-fg transition-colors">上一篇</span>
                      <p className="mt-1 line-clamp-2 text-lg text-fg/70 group-hover:text-fg transition-colors">{prev.title}</p>
                    </Link>
                  ) : <div className="flex-1" />}
                  {next ? (
                    <Link href={`/blog/${next.slug}`} className="group min-w-0 flex-1 rounded-xl border border-border/10 bg-surface/40 p-4 text-right backdrop-blur-sm transition-colors hover:bg-surface/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                      <span className="text-base font-semibold text-fg/40 group-hover:text-fg transition-colors">下一篇</span>
                      <p className="mt-1 line-clamp-2 text-lg text-fg/70 group-hover:text-fg transition-colors">{next.title}</p>
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
    </div>
  )
}

export async function generateStaticParams() {
  const slugs = await getPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export const dynamicParams = false
