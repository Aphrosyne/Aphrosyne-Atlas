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
  "ube-clothing-nipple-clipping": () => import("@/content/knowledge/fixes/ube-clothing-nipple-clipping.mdx"),
  "bodyslide-regex-filtering": () => import("@/content/knowledge/guides/bodyslide-regex-filtering.mdx"),
  "colorful-magic-bosses-loot": () => import("@/content/knowledge/guides/colorful-magic-bosses-loot.mdx"),
  "crimson-sin-build-overview": () => import("@/content/knowledge/guides/crimson-sin-build-overview.mdx"),
  "jzy-mcm-setup": () => import("@/content/knowledge/guides/jzy-mcm-setup.mdx"),
  "modpack-migration-files": () => import("@/content/knowledge/guides/modpack-migration-files.mdx"),
  "sog4-guide-zh": () => import("@/content/knowledge/reference/sog4-guide-zh.mdx"),
}
