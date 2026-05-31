import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostSlugs } from '@/lib/posts'
import PostLayout from '@/components/blog/PostLayout'
import PostHeader from '@/components/blog/PostHeader'
import type { PostMetadata } from '@/types/post'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const { metadata } = await import(`@/content/${slug}.mdx`)
    const meta = metadata as PostMetadata
    return {
      title: meta.title,
      description: meta.excerpt,
    }
  } catch {
    return { title: 'Post Not Found' }
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params

  try {
    const { default: Post, metadata } = await import(`@/content/${slug}.mdx`)
    const meta = metadata as PostMetadata

    return (
      <PostLayout>
        <PostHeader {...meta} />
        <Post />
      </PostLayout>
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
