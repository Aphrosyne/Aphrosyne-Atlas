/** Shared, fail-closed frontmatter validation for the app and build scripts. */
export const PUBLICATION_STATES = ['published', 'archived', 'unlisted', 'draft']
export const KNOWLEDGE_TYPES = ['guide', 'fix', 'experiment', 'reference']
export const KNOWLEDGE_STATUSES = ['verified', 'needs-review', 'outdated']

function fail(filePath, message) {
  throw new Error(`内容校验失败：${filePath}\n${message}`)
}

function requiredString(data, key, filePath) {
  if (typeof data[key] !== 'string' || !data[key].trim()) fail(filePath, `frontmatter.${key} 必须是非空字符串`)
  return data[key].trim()
}

function stringArray(data, key, filePath) {
  if (!Array.isArray(data[key]) || !data[key].every((value) => typeof value === 'string' && value.trim())) {
    fail(filePath, `frontmatter.${key} 必须是非空字符串数组（可为空数组）`)
  }
  return data[key].map((value) => value.trim())
}

function dateString(value, key, filePath) {
  const result = value instanceof Date ? value.toISOString().slice(0, 10) : value
  if (typeof result !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(result) || Number.isNaN(Date.parse(`${result}T00:00:00Z`))) {
    fail(filePath, `frontmatter.${key} 必须是有效的 YYYY-MM-DD 日期`)
  }
  return result
}

export function publicationState(data, filePath) {
  if (!PUBLICATION_STATES.includes(data.publication)) fail(filePath, `frontmatter.publication 必须显式为 ${PUBLICATION_STATES.join('、')}`)
  return data.publication
}

export function parseBlogMetadata(data, filePath, slug) {
  const publication = publicationState(data, filePath)
  const readingTime = data.readingTime === undefined ? undefined : requiredString(data, 'readingTime', filePath)
  return { slug, title: requiredString(data, 'title', filePath), date: dateString(data.date, 'date', filePath), tags: stringArray(data, 'tags', filePath), excerpt: requiredString(data, 'excerpt', filePath), publication, readingTime }
}

export function parseKnowledgeMetadata(data, filePath, slug) {
  const type = requiredString(data, 'type', filePath)
  const status = requiredString(data, 'status', filePath)
  if (!KNOWLEDGE_TYPES.includes(type)) fail(filePath, `frontmatter.type 必须为 ${KNOWLEDGE_TYPES.join('、')}`)
  if (!KNOWLEDGE_STATUSES.includes(status)) fail(filePath, `frontmatter.status 必须为 ${KNOWLEDGE_STATUSES.join('、')}`)
  const sources = data.sources
  if (!Array.isArray(sources) || !sources.every((source) => source && typeof source === 'object' && typeof source.label === 'string' && source.label.trim() && typeof source.href === 'string' && /^https?:\/\//.test(source.href))) {
    fail(filePath, 'frontmatter.sources 必须是含 label 与 http(s) href 的数组（可为空数组）')
  }
  return { slug, title: requiredString(data, 'title', filePath), type, status, publication: publicationState(data, filePath), excerpt: requiredString(data, 'excerpt', filePath), tags: stringArray(data, 'tags', filePath), gameVersion: data.game_version === undefined ? undefined : requiredString(data, 'game_version', filePath), lastEdited: dateString(data.last_edited, 'last_edited', filePath), related: stringArray(data, 'related', filePath), sources: sources.map((source) => ({ label: source.label.trim(), href: source.href })) }
}

export function collectExplicitIds(source) {
  return [...source.matchAll(/\bid\s*=\s*["']([^"']+)["']/g)].map((match) => match[1])
}

export function collectHashLinks(source) {
  return [...source.matchAll(/\]\(#([^)\s]+)\)/g)].map((match) => decodeURIComponent(match[1]))
}
