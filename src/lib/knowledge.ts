import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { globby } from 'globby'
import {
  KNOWLEDGE_STATUSES,
  KNOWLEDGE_TYPES,
  type KnowledgeMetadata,
  type KnowledgeSource,
  type KnowledgeStatus,
  type KnowledgeType,
} from '@/types/knowledge'

const CONTENT_DIR = path.join(process.cwd(), 'src/content/knowledge')

function asDate(value: unknown): string | undefined {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return typeof value === 'string' && value ? value : undefined
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string') ? value : []
}

function asSources(value: unknown): KnowledgeSource[] {
  if (!Array.isArray(value)) return []

  return value.flatMap((source) => {
    if (
      typeof source === 'object' &&
      source !== null &&
      typeof source.label === 'string' &&
      typeof source.href === 'string'
    ) {
      return [{ label: source.label, href: source.href }]
    }
    return []
  })
}

function isKnowledgeType(value: unknown): value is KnowledgeType {
  return typeof value === 'string' && (KNOWLEDGE_TYPES as readonly string[]).includes(value)
}

function isKnowledgeStatus(value: unknown): value is KnowledgeStatus {
  return typeof value === 'string' && (KNOWLEDGE_STATUSES as readonly string[]).includes(value)
}

async function parseKnowledgeFile(filePath: string, slug: string): Promise<KnowledgeMetadata | null> {
  const source = await fs.readFile(filePath, 'utf8')
  const { data } = matter(source)

  if (
    typeof data.title !== 'string' ||
    typeof data.excerpt !== 'string' ||
    !isKnowledgeType(data.type) ||
    !isKnowledgeStatus(data.status)
  ) {
    return null
  }

  return {
    slug,
    title: data.title,
    type: data.type,
    status: data.status,
    excerpt: data.excerpt,
    tags: asStringArray(data.tags),
    gameVersion: typeof data.game_version === 'string' ? data.game_version : undefined,
    lastEdited: asDate(data.last_edited),
    lastVerified: asDate(data.last_verified),
    related: asStringArray(data.related),
    sources: asSources(data.sources),
  }
}

export async function getAllKnowledge(): Promise<KnowledgeMetadata[]> {
  const files = await globby('**/*.mdx', { cwd: CONTENT_DIR })
  const entries = await Promise.all(
    files.map(async (relativePath) => {
      const slug = path.basename(relativePath, '.mdx')
      return parseKnowledgeFile(path.join(CONTENT_DIR, relativePath), slug)
    }),
  )

  return entries
    .filter((entry): entry is KnowledgeMetadata => entry !== null)
    .sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'))
}

export async function getKnowledgeBySlug(slug: string): Promise<KnowledgeMetadata | null> {
  const entries = await getAllKnowledge()
  return entries.find((entry) => entry.slug === slug) ?? null
}

export async function getKnowledgeSlugs(): Promise<string[]> {
  return (await getAllKnowledge()).map((entry) => entry.slug)
}

export async function getRecentKnowledge(count = 3): Promise<KnowledgeMetadata[]> {
  return (await getAllKnowledge())
    .sort((a, b) => (b.lastVerified ?? '').localeCompare(a.lastVerified ?? ''))
    .slice(0, count)
}
