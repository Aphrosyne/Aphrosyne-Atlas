export const KNOWLEDGE_TYPES = ['guide', 'fix', 'experiment', 'reference'] as const

import type { PublicationState } from '@/types/publication'

export const KNOWLEDGE_STATUSES = ['verified', 'needs-review', 'outdated'] as const

export type KnowledgeType = (typeof KNOWLEDGE_TYPES)[number]
export type KnowledgeStatus = (typeof KNOWLEDGE_STATUSES)[number]

export interface KnowledgeSource {
  label: string
  href: string
}

export interface KnowledgeMetadata {
  slug: string
  title: string
  type: KnowledgeType
  status: KnowledgeStatus
  publication: PublicationState
  excerpt: string
  tags: string[]
  gameVersion?: string
  lastEdited?: string
  lastVerified?: string
  related: string[]
  sources: KnowledgeSource[]
}
