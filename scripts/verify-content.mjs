import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { globby } from 'globby'
import { collectExplicitIds, collectHashLinks, parseBlogMetadata, parseKnowledgeMetadata } from '../src/lib/content-schema.js'

const root = process.cwd()
const sets = [
  ['blog', path.join(root, 'src/content/blog'), parseBlogMetadata],
  ['knowledge', path.join(root, 'src/content/knowledge'), parseKnowledgeMetadata],
]
const all = []
for (const [kind, directory, parse] of sets) {
  for (const relativePath of await globby('**/*.mdx', { cwd: directory })) {
    const filePath = path.join(directory, relativePath)
    const source = await fs.readFile(filePath, 'utf8')
    const slug = path.basename(relativePath, '.mdx')
    const metadata = parse(matter(source).data, filePath, slug)
    const ids = collectExplicitIds(source)
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index)
    if (duplicates.length) throw new Error(`内容校验失败：${filePath}\n重复 id：${[...new Set(duplicates)].join('、')}`)
    for (const hash of collectHashLinks(source)) if (hash !== 'top' && !ids.includes(hash)) throw new Error(`内容校验失败：${filePath}\n死 hash：#${hash}`)
    all.push({ kind, relativePath, filePath, metadata })
  }
}
for (const group of ['blog', 'knowledge']) {
  const entries = all.filter((entry) => entry.kind === group)
  const duplicates = entries.filter((entry, index) => entries.findIndex((other) => other.metadata.slug === entry.metadata.slug) !== index)
  if (duplicates.length) throw new Error(`内容校验失败：${group}\n重复 slug：${[...new Set(duplicates.map((entry) => entry.metadata.slug))].join('、')}`)
}
const knowledge = new Set(all.filter((entry) => entry.kind === 'knowledge').map((entry) => entry.metadata.slug))
for (const entry of all.filter((entry) => entry.kind === 'knowledge')) for (const related of entry.metadata.related) if (!knowledge.has(related)) throw new Error(`内容校验失败：${entry.filePath}\nrelated 指向不存在的知识库 slug：${related}`)
console.log(`内容校验通过：${all.length} 篇文章，Blog 与 Knowledge 元数据、slug、related 和显式 hash 均有效。`)
