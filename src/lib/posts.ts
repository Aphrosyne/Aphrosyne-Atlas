import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { globby } from 'globby'
import type { PostMetadata } from '@/types/post'
import { isRoutablePublication } from '@/types/publication'
import { parseBlogMetadata } from '@/lib/content-schema.js'

const CONTENT_DIR = path.join(process.cwd(), 'src/content/blog')

/** Parse and validate YAML frontmatter without executing source text. */
function parseMetadataFromFile(filePath: string, slug: string): PostMetadata {
  const content = fs.readFileSync(filePath, 'utf-8')
  const { data } = matter(content)
  return parseBlogMetadata(data, filePath, slug) as PostMetadata
}

interface PostQueryOptions {
  includeArchived?: boolean
  includeUnlisted?: boolean
}

function matchesPostQuery(post: PostMetadata, options: PostQueryOptions): boolean {
  if (!isRoutablePublication(post.publication)) return false
  if (post.publication === 'unlisted') return options.includeUnlisted === true
  if (post.publication === 'archived') return options.includeArchived === true
  return true
}

/** Return all MDX slugs sorted alphabetically. */
export async function getPostSlugs(): Promise<string[]> {
  const files = await globby('*.mdx', { cwd: CONTENT_DIR })
  return files.flatMap((file) => {
    const slug = file.replace(/\.mdx$/, '')
    const metadata = parseMetadataFromFile(path.join(CONTENT_DIR, file), slug)
    return isRoutablePublication(metadata.publication) ? [slug] : []
  }).sort()
}

/** Return metadata for every blog post, sorted newest-first. */
export async function getAllPosts(options: PostQueryOptions = {}): Promise<PostMetadata[]> {
  const files = await globby('*.mdx', { cwd: CONTENT_DIR })
  const posts: PostMetadata[] = []

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, '')
    const filePath = path.join(CONTENT_DIR, file)
    const post = parseMetadataFromFile(filePath, slug)
    if (matchesPostQuery(post, options)) posts.push(post)
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
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const metadata = parseMetadataFromFile(filePath, slug)
  return isRoutablePublication(metadata.publication) ? metadata : null
}

/** Return prev/next posts for navigation. */
export async function getAdjacentPosts(slug: string) {
  const current = await getPostBySlug(slug)
  if (!current || current.publication === 'unlisted') return { prev: null, next: null }
  const all = await getAllPosts({ includeArchived: true })
  const idx = all.findIndex((p) => p.slug === slug)
  return {
    prev: idx < all.length - 1 ? all[idx + 1] : null,
    next: idx > 0 ? all[idx - 1] : null,
  }
}
