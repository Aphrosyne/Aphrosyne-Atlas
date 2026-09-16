import type { PostMetadata } from '@/types/post'
import { isRoutablePublication } from '@/types/publication'
import { getCanonicalContentIndex } from '@/lib/content-index.js'

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
  return (await getCanonicalContentIndex()).blog.filter((entry) => isRoutablePublication(entry.metadata.publication)).map((entry) => entry.metadata.slug)
}

/** Return metadata for every blog post, sorted newest-first. */
export async function getAllPosts(options: PostQueryOptions = {}): Promise<PostMetadata[]> {
  const posts = (await getCanonicalContentIndex()).blog.map((entry) => entry.metadata as PostMetadata).filter((post) => matchesPostQuery(post, options))

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
  const metadata = (await getCanonicalContentIndex()).blog.find((entry) => entry.metadata.slug === slug)?.metadata as PostMetadata | undefined
  if (!metadata) return null
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
