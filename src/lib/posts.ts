import fs from 'fs'
import path from 'path'
import { globby } from 'globby'
import type { PostMetadata } from '@/types/post'

const CONTENT_DIR = path.join(process.cwd(), 'src/content')

/** Parse the `export const metadata = {…}` block from raw MDX text. */
function parseMetadataFromFile(filePath: string): Record<string, unknown> {
  const content = fs.readFileSync(filePath, 'utf-8')
  const match = content.match(/export\s+const\s+metadata\s*=\s*({[\s\S]*?})\r?\n/)
  if (!match) return {}

  try {
    // Safe parse: wrap the object literal in parens so eval returns it
    return new Function(`"use strict"; return (${match[1]})`)()
  } catch {
    return {}
  }
}

/** Return all MDX slugs sorted alphabetically. */
export async function getPostSlugs(): Promise<string[]> {
  const files = await globby('*.mdx', { cwd: CONTENT_DIR })
  return files.map((f) => f.replace(/\.mdx$/, '')).sort()
}

/** Return metadata for every blog post, sorted newest-first. */
export async function getAllPosts(): Promise<PostMetadata[]> {
  const slugs = await getPostSlugs()
  const posts: PostMetadata[] = []

  for (const slug of slugs) {
    const filePath = path.join(CONTENT_DIR, `${slug}.mdx`)
    const meta = parseMetadataFromFile(filePath) as unknown as PostMetadata
    if (meta.title) {
      posts.push({ ...meta, slug })
    }
  }

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}

/** Return the N most recent posts. */
export async function getRecentPosts(count = 3): Promise<PostMetadata[]> {
  const all = await getAllPosts()
  return all.slice(0, count)
}

/** Return a single post's metadata by slug. */
export async function getPostBySlug(
  slug: string,
): Promise<PostMetadata | null> {
  const all = await getAllPosts()
  return all.find((p) => p.slug === slug) ?? null
}
