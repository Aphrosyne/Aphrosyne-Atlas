import assert from 'node:assert/strict'
import matter from 'gray-matter'
import { parseBlogMetadata, parseKnowledgeMetadata } from '../src/lib/content-schema.js'

const validBlog = { title: '中文 标题', date: '2026-09-15', tags: ['测试'], excerpt: '摘要', publication: 'published' }
const crlfBlog = matter('---\r\ntitle: 中文 标题\r\ndate: 2026-09-15\r\ntags: [测试]\r\nexcerpt: 摘要\r\npublication: published\r\n---\r\n正文').data
assert.equal(parseBlogMetadata(crlfBlog, 'fixtures/中文 空格.mdx', 'fixture').title, '中文 标题')
for (const publication of ['published', 'archived', 'unlisted', 'draft']) assert.equal(parseBlogMetadata({ ...validBlog, publication }, 'fixtures/中文 空格.mdx', 'fixture').publication, publication)
assert.throws(() => parseBlogMetadata({ ...validBlog, publication: undefined }, 'fixtures/missing.mdx', 'fixture'), /publication/)
assert.throws(() => parseBlogMetadata({ ...validBlog, date: '2026-99-99' }, 'fixtures/date.mdx', 'fixture'), /日期/)
const validKnowledge = { title: '中文知识', type: 'guide', status: 'verified', publication: 'published', excerpt: '摘要', tags: [], last_edited: '2026-09-15', related: [], sources: [] }
assert.equal(parseKnowledgeMetadata(validKnowledge, 'fixtures/CRLF.mdx', 'fixture').type, 'guide')
assert.throws(() => parseKnowledgeMetadata({ ...validKnowledge, type: 'other' }, 'fixtures/type.mdx', 'fixture'), /type/)
assert.throws(() => parseKnowledgeMetadata({ ...validKnowledge, related: [''] }, 'fixtures/related.mdx', 'fixture'), /related/)
assert.throws(() => parseKnowledgeMetadata({ ...validKnowledge, sources: [{ label: '来源', href: 'ftp://example.com' }] }, 'fixtures/sources.mdx', 'fixture'), /sources/)
console.log('内容 schema fixture 通过：publication、日期、枚举、中文/空格路径、related 与 sources 均已覆盖。')
