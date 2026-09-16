import { type KnowledgeMetadata } from '@/types/knowledge'
import { isRoutablePublication } from '@/types/publication'
import { getCanonicalContentIndex } from '@/lib/content-index.js'

interface KnowledgeQueryOptions {
  includeArchived?: boolean
  includeUnlisted?: boolean
}

function matchesKnowledgeQuery(entry: KnowledgeMetadata, options: KnowledgeQueryOptions): boolean {
  if (!isRoutablePublication(entry.publication)) return false
  if (entry.publication === 'unlisted') return options.includeUnlisted === true
  if (entry.publication === 'archived') return options.includeArchived === true
  return true
}

async function readKnowledgeEntries(): Promise<KnowledgeMetadata[]> { return (await getCanonicalContentIndex()).knowledge.map((entry) => entry.metadata as KnowledgeMetadata) }

export async function getAllKnowledge(options: KnowledgeQueryOptions = {}): Promise<KnowledgeMetadata[]> {
  return (await readKnowledgeEntries())
    .filter((entry) => matchesKnowledgeQuery(entry, options))
    .sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'))
}

export async function getKnowledgeBySlug(slug: string): Promise<KnowledgeMetadata | null> {
  const entries = await readKnowledgeEntries()
  return entries.find((entry) => entry.slug === slug && isRoutablePublication(entry.publication)) ?? null
}

export async function getKnowledgeSlugs(): Promise<string[]> {
  return (await readKnowledgeEntries())
    .filter((entry) => isRoutablePublication(entry.publication))
    .map((entry) => entry.slug)
    .sort()
}

export async function getRecentKnowledge(count = 3): Promise<KnowledgeMetadata[]> {
  return (await getAllKnowledge())
    .sort((a, b) => (b.lastEdited ?? '').localeCompare(a.lastEdited ?? ''))
    .slice(0, count)
}
