import fs from 'node:fs/promises'
import path from 'node:path'
import { getCanonicalContentIndex } from '../src/lib/content-index.js'
import { projects } from '../src/config/projects.ts'

const root = process.cwd()

function textFromMarkdown(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!?(\[[^\]]*\])\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[*_`>#|~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function searchEntries(entries, kind) {
  return entries.filter(({ metadata }) => metadata.publication !== 'draft' && metadata.publication !== 'unlisted').map(({ metadata, source }) => {
    const details = kind === 'knowledge'
      ? [metadata.type, metadata.status, metadata.gameVersion, metadata.lastEdited]
      : [metadata.date, metadata.readingTime]
    return { title: metadata.title, href: `/${kind}/${metadata.slug}`, type: kind, publication: metadata.publication, excerpt: metadata.excerpt, tags: metadata.tags, searchableText: textFromMarkdown([metadata.title, metadata.excerpt, ...metadata.tags, ...details, source].filter(Boolean).join(' ')) }
  })
}

const canonical = await getCanonicalContentIndex()
const blog = searchEntries(canonical.blog, 'blog')
const knowledge = searchEntries(canonical.knowledge, 'knowledge')
const projectEntries = projects.map((project) => ({
  title: project.title,
  href: `/projects/${project.slug}`,
  type: 'project',
  excerpt: project.description,
  tags: project.tags,
  searchableText: textFromMarkdown([project.title, project.description, project.longDescription, ...project.tags, project.language, project.status].join(' ')),
}))

const pages = [
  { title: '关于', href: '/about', type: 'page', excerpt: '关于我和这个网站', tags: [], searchableText: '关于 我 作者 网站' },
  { title: '项目', href: '/projects', type: 'page', excerpt: '项目归档与介绍', tags: [], searchableText: '项目 Projects 作品' },
]

const output = path.join(root, 'public/search-index.json')
await fs.writeFile(output, `${JSON.stringify([...pages, ...projectEntries, ...blog, ...knowledge])}\n`, 'utf8')
console.log(`Generated search index with ${pages.length + projectEntries.length + blog.length + knowledge.length} entries.`)
