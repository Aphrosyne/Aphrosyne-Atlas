import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { globby } from 'globby'

const root = process.cwd()
const contentRoot = path.join(root, 'src/content')

function asStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === 'string') ? value : []
}

function dateString(value) {
  return value instanceof Date ? value.toISOString().slice(0, 10) : value
}

function publicationState(value) {
  return ['published', 'archived', 'unlisted', 'draft'].includes(value) ? value : 'published'
}

function textFromMarkdown(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!?(\[[^\]]*\])\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[*_`>#|~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function readEntries(directory, kind) {
  const files = await globby('**/*.mdx', { cwd: directory })
  const entries = await Promise.all(files.map(async (relativePath) => {
    const source = await fs.readFile(path.join(directory, relativePath), 'utf8')
    const { data, content } = matter(source)
    const publication = publicationState(data.publication)
    if (publication === 'draft' || publication === 'unlisted') return null
    const slug = path.basename(relativePath, '.mdx')
    const tags = asStringArray(data.tags)
    const metadata = kind === 'knowledge'
      ? [data.type, data.status, data.game_version, dateString(data.last_edited), dateString(data.last_verified)].filter(Boolean)
      : [data.date, data.readingTime].filter(Boolean)

    return {
      title: typeof data.title === 'string' ? data.title : slug,
      href: `/${kind}/${slug}`,
      type: kind,
      publication,
      excerpt: typeof data.excerpt === 'string' ? data.excerpt : '',
      tags,
      searchableText: textFromMarkdown([
        data.title,
        data.excerpt,
        ...tags,
        ...metadata,
        content,
      ].filter(Boolean).join(' ')),
    }
  }))
  return entries.filter(Boolean)
}

const [blog, knowledge] = await Promise.all([
  readEntries(path.join(contentRoot, 'blog'), 'blog'),
  readEntries(path.join(contentRoot, 'knowledge'), 'knowledge'),
])

const pages = [
  { title: '关于', href: '/about', type: 'page', excerpt: '关于我和这个网站', tags: [], searchableText: '关于 我 作者 网站' },
  { title: '项目', href: '/projects', type: 'page', excerpt: '项目归档与介绍', tags: [], searchableText: '项目 Projects 作品' },
]

const output = path.join(root, 'public/search-index.json')
await fs.writeFile(output, `${JSON.stringify([...pages, ...blog, ...knowledge])}\n`, 'utf8')
console.log(`Generated search index with ${pages.length + blog.length + knowledge.length} entries.`)
