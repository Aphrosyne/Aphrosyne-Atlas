// 此文件由 scripts/generate-knowledge-registry.mjs 自动生成，请勿手动编辑。

import type { ComponentType } from 'react'

type KnowledgeArticleModule = {
  default: ComponentType
}

export const KNOWLEDGE_ARTICLE_LOADERS: Record<
  string,
  () => Promise<KnowledgeArticleModule>
> = {
  "openshaders-latex-reflection": () => import("@/content/knowledge/experiments/openshaders-latex-reflection.mdx"),
  "college-spellbook-levels": () => import("@/content/knowledge/fixes/college-spellbook-levels.mdx"),
  "experience-skill-cap": () => import("@/content/knowledge/fixes/experience-skill-cap.mdx"),
  "colorful-magic-light-bosses-loot": () => import("@/content/knowledge/guides/colorful-magic-light-bosses-loot.mdx"),
  "sog4-integration-fork-guide-zh": () => import("@/content/knowledge/reference/sog4-integration-fork-guide-zh.mdx"),
}
