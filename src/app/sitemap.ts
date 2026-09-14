import type { MetadataRoute } from 'next'
import { projects } from '@/config/projects'
import { getAllKnowledge } from '@/lib/knowledge'
import { getAllPosts } from '@/lib/posts'
import { siteUrl } from '@/lib/site-url'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, knowledge] = await Promise.all([
    getAllPosts({ includeArchived: true }),
    getAllKnowledge({ includeArchived: true }),
  ])

  return [
    { url: siteUrl('/'), changeFrequency: 'monthly', priority: 1 },
    { url: siteUrl('/about'), changeFrequency: 'yearly', priority: 0.4 },
    { url: siteUrl('/blog'), changeFrequency: 'weekly', priority: 0.8 },
    { url: siteUrl('/knowledge'), changeFrequency: 'weekly', priority: 0.8 },
    { url: siteUrl('/projects'), changeFrequency: 'monthly', priority: 0.6 },
    ...posts.map((post) => ({
      url: siteUrl(`/blog/${post.slug}`),
      lastModified: post.date,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...knowledge.map((entry) => ({
      url: siteUrl(`/knowledge/${entry.slug}`),
      lastModified: entry.lastEdited,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...projects.map((project) => ({
      url: siteUrl(`/projects/${project.slug}`),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ]
}
