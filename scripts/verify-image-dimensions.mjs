import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { deploymentConfigFromArgs } from './static-args.mjs'

const config = deploymentConfigFromArgs()
const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputRoot = path.join(repositoryRoot, 'out')
const failures = []

async function articlePages(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const pages = await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) return articlePages(target)
    if (entry.name !== 'index.html') return []
    const html = await fs.readFile(target, 'utf8')
    return html.includes('id="article-content"') ? [{ file: target, html }] : []
  }))
  return pages.flat()
}

function attribute(tag, name) {
  return tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1]
}

for (const { file, html } of await articlePages(outputRoot)) {
  const article = html.match(/<article id="article-content"[\s\S]*?<\/article>/)?.[0] ?? ''
  for (const tag of article.match(/<img\b[^>]*>/g) ?? []) {
    const source = attribute(tag, 'src')
    if (!source?.startsWith(`${config.basePath}/images/`) && !(source?.startsWith('/images/') && !config.basePath)) continue

    const width = Number(attribute(tag, 'width'))
    const height = Number(attribute(tag, 'height'))
    if (!Number.isInteger(width) || width < 1 || !Number.isInteger(height) || height < 1) {
      failures.push(`${path.relative(outputRoot, file)} 的文章图片缺少有效尺寸：${source}`)
      continue
    }

    if (!attribute(tag, 'alt')) {
      failures.push(`${path.relative(outputRoot, file)} 的文章图片缺少可读的替代文本：${source}`)
    }

    const publicPath = source.slice(config.basePath.length).split(/[?#]/, 1)[0]
    const localPath = path.join(outputRoot, publicPath.replace(/^\/+/, ''))
    const metadata = await sharp(localPath).metadata().catch(() => null)
    if (!metadata || metadata.width !== width || metadata.height !== height) {
      failures.push(`${path.relative(outputRoot, file)} 的图片尺寸与资产不一致：${source}`)
    }
  }
}

if (failures.length) {
  console.error(`图片尺寸验证失败（${failures.length} 项）：`)
  for (const failure of failures) console.error(`- ${failure}`)
  process.exitCode = 1
} else {
  console.log('图片尺寸验证通过：所有文章图片均使用与静态资产一致的宽高。')
}
