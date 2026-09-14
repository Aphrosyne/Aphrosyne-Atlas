import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { deploymentConfigFromArgs } from './static-args.mjs'

const config = deploymentConfigFromArgs()
const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputRoot = path.join(repositoryRoot, 'out')
const failures = []

const requiredRoutes = [
  '/',
  '/about/',
  '/blog/',
  '/blog/framer-motion-blur/',
  '/blog/dashboard-hover-backdrop-compositing/',
  '/knowledge/',
  '/knowledge/engine-fixes-save-size-settings/',
  '/knowledge/colorful-magic-light-bosses-loot/',
  '/projects/',
  '/projects/aphrosyne-site/',
]

function outputPathForRoute(route) {
  const relative = route === '/' ? '' : route.replace(/^\/+/, '')
  return path.join(outputRoot, relative, 'index.html')
}

function sitemapUrlForRoute(route) {
  const pathname = route === '/' ? '/' : route.replace(/\/+$/, '')
  return `${config.siteUrl}${pathname}`
}

function external(value) {
  return /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(value)
}

async function allHtmlFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) return allHtmlFiles(target)
    return entry.isFile() && entry.name.endsWith('.html') ? [target] : []
  }))
  return files.flat()
}

for (const route of requiredRoutes) {
  const file = outputPathForRoute(route)
  try {
    await fs.access(file)
    const html = await fs.readFile(file, 'utf8')
    const expectedCanonical = `${config.siteUrl}${route}`
    if (!html.includes(`<link rel="canonical" href="${expectedCanonical}"`)) {
      failures.push(`静态路由缺少正确 canonical：${route}`)
    }
  } catch {
    failures.push(`缺少核心路由产物：${route}`)
  }
}

for (const file of await allHtmlFiles(outputRoot)) {
  const html = await fs.readFile(file, 'utf8')
  for (const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
    const reference = match[1]
    if (external(reference) || !reference.startsWith('/')) continue
    const expectedPrefix = config.basePath ? `${config.basePath}/` : '/'
    if (!reference.startsWith(expectedPrefix)) {
      failures.push(`${path.relative(outputRoot, file)} 使用未匹配 basePath 的资源：${reference}`)
      continue
    }
    const assetPath = reference.slice(config.basePath.length).split(/[?#]/, 1)[0]
    const localPath = path.join(outputRoot, assetPath.replace(/^\/+/, ''))
    try {
      await fs.access(localPath)
    } catch {
      failures.push(`${path.relative(outputRoot, file)} 引用不存在的资源：${reference}`)
    }
  }
}

const sitemapUrl = `${config.siteUrl}/sitemap.xml`
let robots = ''
let sitemap = ''
try {
  robots = await fs.readFile(path.join(outputRoot, 'robots.txt'), 'utf8')
} catch {
  failures.push('缺少 robots.txt')
}
try {
  sitemap = await fs.readFile(path.join(outputRoot, 'sitemap.xml'), 'utf8')
} catch {
  failures.push('缺少 sitemap.xml')
}

if (robots && !robots.includes(`Sitemap: ${sitemapUrl}`)) failures.push('robots.txt 的 sitemap URL 与部署配置不一致')

for (const route of requiredRoutes) {
  const expectedUrl = sitemapUrlForRoute(route)
  if (sitemap && !sitemap.includes(`<loc>${expectedUrl}</loc>`)) failures.push(`sitemap.xml 缺少公开路由：${expectedUrl}`)
}
if (sitemap.includes('/studio/')) failures.push('sitemap.xml 不应包含 Studio 路由')

const searchIndex = JSON.parse(await fs.readFile(path.join(outputRoot, 'search-index.json'), 'utf8'))
for (const entry of searchIndex) {
  if (typeof entry.href !== 'string' || !entry.href.startsWith('/')) {
    failures.push('search-index.json 含有无效 href')
    break
  }
  const file = outputPathForRoute(`${entry.href.replace(/\/$/, '')}/`)
  try {
    await fs.access(file)
  } catch {
    failures.push(`search-index.json 指向不存在的静态路由：${entry.href}`)
  }
}

if (failures.length) {
  console.error(`静态 smoke 失败（${failures.length} 项）：`)
  for (const failure of failures) console.error(`- ${failure}`)
  process.exitCode = 1
} else {
  console.log(`静态 smoke 通过：${config.siteUrl || config.siteOrigin}，${requiredRoutes.length} 个核心路由与全部本地 HTML 资源已检查。`)
}
