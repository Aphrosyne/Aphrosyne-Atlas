import type { KnowledgeStatus } from '@/types/knowledge'
import type { PublicationState } from '@/types/publication'

export const KNOWLEDGE_STATUS_LABELS: Record<KnowledgeStatus, string> = {
  verified: '已验证',
  'needs-review': '待复查',
  outdated: '已过时',
}

export const KNOWLEDGE_STATUS_CLASSES: Record<KnowledgeStatus, string> = {
  verified: 'border-status-verified-border bg-status-verified-bg text-status-verified-fg',
  'needs-review': 'border-status-review-border bg-status-review-bg text-status-review-fg',
  outdated: 'border-status-outdated-border bg-status-outdated-bg text-status-outdated-fg',
}

export const ARCHIVED_STATUS_CLASS: Record<PublicationState, string> = {
  published: '',
  archived: 'border-status-archived-border bg-status-archived-bg text-status-archived-fg',
  unlisted: '',
  draft: '',
}

export const PROJECT_STATUS = {
  public: { label: '公开', className: 'border-status-verified-border bg-status-verified-bg text-status-verified-fg' },
  archived: { label: '公开归档', className: 'border-status-archived-border bg-status-archived-bg text-status-archived-fg' },
} as const
