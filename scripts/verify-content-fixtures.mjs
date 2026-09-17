import assert from 'node:assert/strict'
import matter from 'gray-matter'
import { parseBlogMetadata, parseKnowledgeMetadata } from '../src/lib/content-schema.js'
import { comparePinned } from '../src/lib/pinned-order.ts'

const validBlog = { title: '中文 标题', date: '2026-09-15', tags: ['测试'], excerpt: '摘要', publication: 'published' }
const crlfBlog = matter('---\r\ntitle: 中文 标题\r\ndate: 2026-09-15\r\ntags: [测试]\r\nexcerpt: 摘要\r\npublication: published\r\n---\r\n正文').data
assert.equal(parseBlogMetadata(crlfBlog, 'fixtures/中文 空格.mdx', 'fixture').title, '中文 标题')
for (const publication of ['published', 'archived', 'unlisted', 'draft']) assert.equal(parseBlogMetadata({ ...validBlog, publication }, 'fixtures/中文 空格.mdx', 'fixture').publication, publication)
assert.throws(() => parseBlogMetadata({ ...validBlog, publication: undefined }, 'fixtures/missing.mdx', 'fixture'), /publication/)
assert.throws(() => parseBlogMetadata({ ...validBlog, date: '2026-99-99' }, 'fixtures/date.mdx', 'fixture'), /日期/)
assert.equal(parseBlogMetadata(validBlog, 'fixtures/blog.mdx', 'fixture').pinned, false)
assert.equal(parseBlogMetadata({ ...validBlog, pinned: true }, 'fixtures/blog.mdx', 'fixture').pinned, true)
assert.throws(() => parseBlogMetadata({ ...validBlog, pinned: 'true' }, 'fixtures/blog.mdx', 'fixture'), /pinned/)
assert.throws(() => parseBlogMetadata({ ...validBlog, publication: 'archived', pinned: true }, 'fixtures/blog.mdx', 'fixture'), /published/)
const validKnowledge = { title: '中文知识', type: 'guide', status: 'verified', publication: 'published', excerpt: '摘要', tags: [], last_edited: '2026-09-15', related: [], sources: [] }
assert.equal(parseKnowledgeMetadata(validKnowledge, 'fixtures/CRLF.mdx', 'fixture').type, 'guide')
assert.throws(() => parseKnowledgeMetadata({ ...validKnowledge, type: 'other' }, 'fixtures/type.mdx', 'fixture'), /type/)
assert.throws(() => parseKnowledgeMetadata({ ...validKnowledge, related: [''] }, 'fixtures/related.mdx', 'fixture'), /related/)
assert.throws(() => parseKnowledgeMetadata({ ...validKnowledge, sources: [{ label: '来源', href: 'ftp://example.com' }] }, 'fixtures/sources.mdx', 'fixture'), /sources/)
assert.equal(parseKnowledgeMetadata(validKnowledge, 'fixtures/knowledge.mdx', 'fixture').pinned, false)
assert.equal(parseKnowledgeMetadata({ ...validKnowledge, pinned: true }, 'fixtures/knowledge.mdx', 'fixture').pinned, true)
assert.throws(() => parseKnowledgeMetadata({ ...validKnowledge, pinned: 1 }, 'fixtures/knowledge.mdx', 'fixture'), /pinned/)
assert.throws(() => parseKnowledgeMetadata({ ...validKnowledge, publication: 'draft', pinned: true }, 'fixtures/knowledge.mdx', 'fixture'), /published/)
assert.deepEqual([{ pinned: false, title: '甲' }, { pinned: true, title: '乙' }].sort(comparePinned).map((item) => item.title), ['乙', '甲'])
console.log('内容 schema fixture 通过：publication、置顶、日期、枚举、中文/空格路径、related 与 sources 均已覆盖。')
