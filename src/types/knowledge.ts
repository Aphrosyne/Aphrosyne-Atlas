export const KNOWLEDGE_TYPES = ['guide', 'fix', 'experiment', 'reference'] as const

export const KNOWLEDGE_STATUSES = ['verified', 'needs-review', 'outdated', 'draft'] as const

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
  excerpt: string
  tags: string[]
  gameVersion?: string
  lastEdited?: string
  lastVerified?: string
  related: string[]
  sources: KnowledgeSource[]
}
