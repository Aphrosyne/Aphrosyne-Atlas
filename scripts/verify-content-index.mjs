import assert from 'node:assert/strict'
import { getCanonicalContentIndex } from '../src/lib/content-index.js'
import { projects } from '../src/config/projects.ts'

const { blog, knowledge } = await getCanonicalContentIndex()
const search = JSON.parse(await (await import('node:fs/promises')).readFile('public/search-index.json', 'utf8'))
const routable = (entries) => entries.filter(({ metadata }) => metadata.publication !== 'draft' && metadata.publication !== 'unlisted')
assert.equal(search.filter((entry) => entry.type === 'blog').length, routable(blog).length)
assert.equal(search.filter((entry) => entry.type === 'knowledge').length, routable(knowledge).length)
assert.equal(search.filter((entry) => entry.type === 'project').length, projects.length)
for (const entry of [...routable(blog), ...routable(knowledge)]) assert(search.some((item) => item.href.endsWith(`/${entry.metadata.slug}`)))
for (const count of [20, 100, 500]) {
  const copies = await Promise.all(Array.from({ length: count }, () => getCanonicalContentIndex()))
  assert(copies.every((index) => index === copies[0]))
}
console.log(`canonical index 一致性通过：${blog.length} 篇 Blog、${knowledge.length} 篇 Knowledge、${projects.length} 个 Projects；20/100/500 次查询均复用同一索引。`)
