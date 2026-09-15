import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { globby } from 'globby'
import { type KnowledgeMetadata } from '@/types/knowledge'
import { isRoutablePublication } from '@/types/publication'
import { parseKnowledgeMetadata } from '@/lib/content-schema.js'

const CONTENT_DIR = path.join(process.cwd(), 'src/content/knowledge')

async function parseKnowledgeFile(filePath: string, slug: string): Promise<KnowledgeMetadata> {
  const source = await fs.readFile(filePath, 'utf8')
  const { data } = matter(source)

  return parseKnowledgeMetadata(data, filePath, slug) as KnowledgeMetadata
}

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

async function readKnowledgeEntries(): Promise<KnowledgeMetadata[]> {
  const files = await globby('**/*.mdx', { cwd: CONTENT_DIR })
  const entries = await Promise.all(
    files.map(async (relativePath) => {
      const slug = path.basename(relativePath, '.mdx')
      return parseKnowledgeFile(path.join(CONTENT_DIR, relativePath), slug)
    }),
  )

  return entries
}

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
