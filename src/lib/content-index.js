import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { globby } from 'globby'
import { parseBlogMetadata, parseKnowledgeMetadata } from './content-schema.js'

const root = process.cwd()
let cache

async function readCollection(directory, parse) {
  const files = await globby('**/*.mdx', { cwd: directory })
  return Promise.all(files.sort().map(async (relativePath) => {
    const filePath = path.join(directory, relativePath)
    const source = await fs.readFile(filePath, 'utf8')
    const slug = path.basename(relativePath, '.mdx')
    return { relativePath: relativePath.replaceAll('\\', '/'), source, metadata: parse(matter(source).data, filePath, slug) }
  }))
}

export async function getCanonicalContentIndex() {
  if (!cache) cache = Promise.all([
    readCollection(path.join(root, 'src/content/blog'), parseBlogMetadata),
    readCollection(path.join(root, 'src/content/knowledge'), parseKnowledgeMetadata),
  ]).then(([blog, knowledge]) => {
    const checkUnique = (entries, kind) => {
      const seen = new Set()
      for (const entry of entries) {
        if (seen.has(entry.metadata.slug)) throw new Error(`内容校验失败：${kind} slug 重复：${entry.metadata.slug}`)
        seen.add(entry.metadata.slug)
      }
    }
    checkUnique(blog, 'Blog'); checkUnique(knowledge, 'Knowledge')
    const knowledgeSlugs = new Set(knowledge.map((entry) => entry.metadata.slug))
    for (const entry of knowledge) for (const related of entry.metadata.related) if (!knowledgeSlugs.has(related)) throw new Error(`内容校验失败：${entry.relativePath}\nrelated 指向不存在的知识库 slug：${related}`)
    return { blog, knowledge }
  })
  return cache
}
