import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/posts'
import { projects } from '@/lib/projects'

export const dynamic = 'force-static'

const staticPages = [
  { title: '关于', href: '/about', excerpt: '关于我和这个网站' },
  { title: 'Playground', href: '/playground', excerpt: '前端小动画、CSS 实验、交互 Demo' },
]

export async function GET() {
  const posts = (await getAllPosts()).map((p) => ({
    title: p.title,
    href: `/blog/${p.slug}`,
    excerpt: p.excerpt ?? '',
  }))

  const projItems = projects.map((p) => ({
    title: p.title,
    href: `/projects/${p.slug}`,
    excerpt: p.description,
  }))

  return NextResponse.json([...staticPages, ...posts, ...projItems])
}
