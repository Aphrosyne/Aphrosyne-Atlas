import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { globby } from 'globby'

const root = process.cwd()
const contentDirectory = path.join(root, 'src/content/knowledge')
const outputPath = path.join(root, 'src/lib/knowledge-articles.ts')

const files = await globby('**/*.mdx', { cwd: contentDirectory })
const entries = []
const seenSlugs = new Map()

for (const relativePath of files.sort()) {
  const source = await fs.readFile(path.join(contentDirectory, relativePath), 'utf8')
  const { data } = matter(source)
  if (data.publication === 'draft') continue

  const slug = path.basename(relativePath, '.mdx')
  const duplicate = seenSlugs.get(slug)
  if (duplicate) {
    throw new Error(`知识库 slug 重复：${slug}\n- ${duplicate}\n- ${relativePath}`)
  }
  seenSlugs.set(slug, relativePath)
  entries.push({ slug, relativePath: relativePath.replaceAll('\\', '/') })
}

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
