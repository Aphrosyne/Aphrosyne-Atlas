import type { ComponentType } from 'react'

type KnowledgeArticleModule = {
  default: ComponentType
}

export const KNOWLEDGE_ARTICLE_LOADERS: Record<
  string,
  () => Promise<KnowledgeArticleModule>
> = {
  'experience-skill-cap': () => import('@/content/knowledge/fixes/experience-skill-cap.mdx'),
  'college-spellbook-levels': () => import('@/content/knowledge/fixes/college-spellbook-levels.mdx'),
  'sog4-integration-fork-guide-zh': () => import('@/content/knowledge/reference/sog4-integration-fork-guide-zh.mdx'),
}
