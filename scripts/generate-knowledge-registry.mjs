import fs from 'node:fs/promises'
import path from 'node:path'
import { getCanonicalContentIndex } from '../src/lib/content-index.js'

const root = process.cwd()
const outputPath = path.join(root, 'src/lib/knowledge-articles.ts')
const entries = (await getCanonicalContentIndex()).knowledge
  .filter((entry) => entry.metadata.publication !== 'draft')
  .map((entry) => ({ slug: entry.metadata.slug, relativePath: entry.relativePath }))

const loaders = entries
  .map(({ slug, relativePath }) => `  ${JSON.stringify(slug)}: () => import(${JSON.stringify(`@/content/knowledge/${relativePath}`)}),`)
  .join('\n')

const generated = `// 此文件由 scripts/generate-knowledge-registry.mjs 自动生成，请勿手动编辑。\n\nimport type { ComponentType } from 'react'\n\ntype KnowledgeArticleModule = {\n  default: ComponentType\n}\n\nexport const KNOWLEDGE_ARTICLE_LOADERS: Record<\n  string,\n  () => Promise<KnowledgeArticleModule>\n> = {\n${loaders}\n}\n`

let current = ''
try {
  current = await fs.readFile(outputPath, 'utf8')
} catch {
  // The first generation creates the file.
}

if (current !== generated) await fs.writeFile(outputPath, generated, 'utf8')
console.log(`Generated knowledge registry with ${entries.length} entries.`)
