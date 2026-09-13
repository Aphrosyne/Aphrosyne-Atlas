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
  "engine-fixes-save-size-settings": () => import("@/content/knowledge/fixes/engine-fixes-save-size-settings.mdx"),
  "experience-skill-cap": () => import("@/content/knowledge/fixes/experience-skill-cap.mdx"),
  "ube-clothing-nipple-clipping": () => import("@/content/knowledge/fixes/ube-clothing-nipple-clipping.mdx"),
  "bodyslide-regex-filtering": () => import("@/content/knowledge/guides/bodyslide-regex-filtering.mdx"),
  "colorful-magic-light-bosses-loot": () => import("@/content/knowledge/guides/colorful-magic-light-bosses-loot.mdx"),
  "crimson-sin-build-overview": () => import("@/content/knowledge/guides/crimson-sin-build-overview.mdx"),
  "jzy-y4-new-game-mcm-setup": () => import("@/content/knowledge/guides/jzy-y4-new-game-mcm-setup.mdx"),
  "mod-organizer-profile-migration-checklist": () => import("@/content/knowledge/guides/mod-organizer-profile-migration-checklist.mdx"),
  "jzy-z3-y5-troubleshooting-notes": () => import("@/content/knowledge/reference/jzy-z3-y5-troubleshooting-notes.mdx"),
  "skyrim-outfit-creator-bookmarks": () => import("@/content/knowledge/reference/skyrim-outfit-creator-bookmarks.mdx"),
  "sog4-integration-fork-guide-zh": () => import("@/content/knowledge/reference/sog4-integration-fork-guide-zh.mdx"),
}
