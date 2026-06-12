import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostSlugs, getAdjacentPosts } from '@/lib/posts'
import PageTransition from '@/components/shared/PageTransition'
import PostHeader from '@/components/blog/PostHeader'
import TableOfContents from '@/components/blog/TableOfContents'
import type { PostMetadata } from '@/types/post'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const { metadata } = await import(`@/content/${slug}.mdx`)
    const meta = metadata as PostMetadata
    return { title: meta.title, description: meta.excerpt }
  } catch {
    return { title: 'Post Not Found' }
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params

  try {
    const { default: Post, metadata } = await import(`@/content/${slug}.mdx`)
    const meta = metadata as PostMetadata
    const { prev, next } = await getAdjacentPosts(slug)

    return (
      <>
        {/* Full-screen reading mask — outside PageTransition to avoid flash */}
        <div className="fixed inset-0 bg-white/15 backdrop-blur-xl -z-[1]" />
        <PageTransition>
        <div className="relative">
          <div className="mx-auto max-w-5xl px-4 py-12 relative">
            {/* Back link */}
            <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-black/50 hover:text-accent transition-colors mb-8">
              ← 返回博客
            </Link>

            <div className="flex gap-8 justify-center">
              {/* Main content */}
              <div className="max-w-4xl flex-1 min-w-0">
                <article className="prose prose-zinc prose-headings:font-semibold prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-code:rounded prose-code:bg-code-bg prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-pre:bg-code-bg prose-pre:border prose-pre:border-border max-w-none">
                  <PostHeader {...meta} />
                  <Post />
                </article>

                {/* Prev / Next */}
                <nav className="mt-12 flex gap-4">
                  {prev ? (
                    <Link href={`/blog/${prev.slug}`} className="flex-1 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 hover:bg-white/8 transition-colors">
                      <span className="text-xs text-black/40">上一篇</span>
                      <p className="mt-1 text-sm text-black/70 truncate">{prev.title}</p>
                    </Link>
                  ) : <div className="flex-1" />}
                  {next ? (
                    <Link href={`/blog/${next.slug}`} className="flex-1 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 hover:bg-white/8 transition-colors text-right">
                      <span className="text-xs text-black/40">下一篇</span>
                      <p className="mt-1 text-sm text-black/70 truncate">{next.title}</p>
                    </Link>
                  ) : <div className="flex-1" />}
                </nav>
              </div>

              {/* TOC sidebar — sticky, follows while scrolling */}
              <aside className="hidden lg:block w-48 shrink-0">
                <div className="sticky top-24">
                  <TableOfContents />
                </div>
              </aside>
            </div>

          </div>
        </div>
      </PageTransition>
      </>
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
