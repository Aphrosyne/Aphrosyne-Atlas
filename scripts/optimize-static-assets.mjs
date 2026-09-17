import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { globby } from 'globby'
import sharp from 'sharp'
import subsetFont from 'subset-font'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const FONT_DIR = path.join(ROOT, 'src/app/fonts')
const IMAGE_SOURCE_DIR = path.join(ROOT, 'assets/images-source')
const IMAGE_OUTPUT_DIR = path.join(ROOT, 'public/images')
const IMAGE_DIMENSIONS_OUTPUT = path.join(ROOT, 'src/lib/image-dimensions.ts')
const MEME_IMAGES_OUTPUT = path.join(ROOT, 'src/lib/meme-images.ts')
const FORCE_IMAGE_BUILD = process.argv.includes('--force')
const BACKGROUND_MAX_DIMENSION = 2048

const FONT_SOURCES = [
  { input: 'SourceHanSansSC-Regular.otf', output: 'AphrosyneSansSC-Regular.woff2', style: 'Regular' },
  { input: 'SourceHanSansSC-Medium.otf', output: 'AphrosyneSansSC-Medium.woff2', style: 'Medium' },
  { input: 'SourceHanSansSC-Bold.otf', output: 'AphrosyneSansSC-Bold.woff2', style: 'Bold' },
]

async function collectSiteCharacters() {
  const files = await globby('src/**/*.{css,js,jsx,json,md,mdx,ts,tsx}', { cwd: ROOT, absolute: true })
  const text = (await Promise.all(files.map((file) => fs.readFile(file, 'utf8')))).join('\n')
  const characters = new Set(['\u00a0', '–', '—', '…', '←', '→', '\ufffd'])

  // Always retain printable ASCII so generated dates, URLs and code stay in the site font.
  for (let codePoint = 0x20; codePoint <= 0x7e; codePoint += 1) characters.add(String.fromCodePoint(codePoint))
  for (const character of text) characters.add(character)

  return [...characters].sort((a, b) => a.codePointAt(0) - b.codePointAt(0)).join('')
}

function decodeUtf16Be(bytes) {
  let value = ''
  for (let index = 0; index < bytes.length; index += 2) {
    value += String.fromCharCode((bytes[index] << 8) | bytes[index + 1])
  }
  return value
}

function encodeUtf16Be(value) {
  const bytes = Buffer.alloc(value.length * 2)
  for (let index = 0; index < value.length; index += 1) {
    bytes.writeUInt16BE(value.charCodeAt(index), index * 2)
  }
  return bytes
}

function renameReservedFontNames(input) {
  const font = Buffer.from(input)
  const view = new DataView(font.buffer, font.byteOffset, font.byteLength)
  const numberOfTables = view.getUint16(4)
  let nameTableOffset = -1

  for (let index = 0; index < numberOfTables; index += 1) {
    const recordOffset = 12 + index * 16
    const tag = font.toString('ascii', recordOffset, recordOffset + 4)
    if (tag === 'name') {
      nameTableOffset = view.getUint32(recordOffset + 8)
      break
    }
  }
  if (nameTableOffset < 0) throw new Error('Font has no name table.')

  const recordCount = view.getUint16(nameTableOffset + 2)
  const stringsOffset = nameTableOffset + view.getUint16(nameTableOffset + 4)
  const renamedNameIds = new Set([1, 3, 4, 6, 16, 17, 21, 22])

  for (let index = 0; index < recordCount; index += 1) {
    const recordOffset = nameTableOffset + 6 + index * 12
    const platformId = view.getUint16(recordOffset)
    const nameId = view.getUint16(recordOffset + 6)
    if (!renamedNameIds.has(nameId)) continue

    const length = view.getUint16(recordOffset + 8)
    const offset = stringsOffset + view.getUint16(recordOffset + 10)
    const originalBytes = font.subarray(offset, offset + length)
    const original = platformId === 0 || platformId === 3
      ? decodeUtf16Be(originalBytes)
      : originalBytes.toString('latin1')
    const renamed = original
      .replaceAll('Source Han Sans SC', 'Aphrosyne Atlas SC')
      .replaceAll('SourceHanSansSC', 'Aphrosyne-Atlas')
    if (renamed === original) continue

    const renamedBytes = platformId === 0 || platformId === 3
      ? encodeUtf16Be(renamed)
      : Buffer.from(renamed, 'latin1')
    if (renamedBytes.length !== originalBytes.length) {
      throw new Error(`Renamed font string changed byte length: ${original}`)
    }
    renamedBytes.copy(font, offset)
  }

  return font
}

async function buildFontSubsets(characters) {

  for (const source of FONT_SOURCES) {
    const inputPath = path.join(FONT_DIR, source.input)
    const outputPath = path.join(FONT_DIR, source.output)
    const input = await fs.readFile(inputPath).catch((error) => {
      if (error.code === 'ENOENT') return null
      throw error
    })

    if (!input) {
      const publishedSubsetExists = await fs.access(outputPath).then(() => true).catch(() => false)
      if (publishedSubsetExists) {
        console.log(`${source.input}: unavailable; keeping committed ${source.output}`)
        continue
      }

      throw new Error(
        `Missing ${source.input} and its published subset ${source.output}. `
        + 'Restore the committed WOFF2 file, or add the local OTF source and run npm run optimize:assets.'
      )
    }

    const renamedInput = renameReservedFontNames(input)
    const output = await subsetFont(renamedInput, characters, {
      targetFormat: 'woff2',
      preserveNameIds: [0, 13, 14],
    })

    await fs.writeFile(outputPath, output)
    console.log(`${source.output}: ${(output.length / 1024).toFixed(1)} KiB`)
  }
}

async function convertImages() {
  const sourcePaths = await globby('**/*.{jpg,jpeg,png}', {
    cwd: IMAGE_SOURCE_DIR,
    absolute: true,
    caseSensitiveMatch: false,
  })
  const outputPaths = new Set()

  for (const sourcePath of sourcePaths) {
    const relativePath = path.relative(IMAGE_SOURCE_DIR, sourcePath)
    const outputRelativePath = relativePath.replace(/\.(?:jpe?g|png)$/i, '.webp')
    const outputPath = path.join(IMAGE_OUTPUT_DIR, outputRelativePath)
    const outputKey = outputPath.toLowerCase()

    if (outputPaths.has(outputKey)) {
      throw new Error(`Image output collision: ${outputRelativePath}`)
    }
    outputPaths.add(outputKey)

    const [sourceStat, outputStat] = await Promise.all([
      fs.stat(sourcePath),
      fs.stat(outputPath).catch(() => null),
    ])
    if (!FORCE_IMAGE_BUILD && outputStat && outputStat.mtimeMs >= sourceStat.mtimeMs) {
      console.log(`${path.relative(ROOT, outputPath)}: unchanged`)
      continue
    }

    const normalizedRelativePath = outputRelativePath.split(path.sep).join('/')
    const isBackground = normalizedRelativePath.startsWith('bg/')
    const isAvatar = normalizedRelativePath.startsWith('avatar/')
    const metadata = await sharp(sourcePath).metadata()
    const width = isAvatar ? 768 : 1920
    const quality = isBackground ? 90 : isAvatar ? 86 : 88
    const webpOptions = metadata.hasAlpha
      ? { lossless: true, effort: 6 }
      : { quality, smartSubsample: true, effort: 5 }

    await fs.mkdir(path.dirname(outputPath), { recursive: true })
    const image = sharp(sourcePath).rotate()
    if (isBackground) {
      // 2K means the longest edge is at most 2048px. `inside` preserves the
      // source aspect ratio, so portrait and panorama backgrounds never stretch.
      image.resize({
        width: BACKGROUND_MAX_DIMENSION,
        height: BACKGROUND_MAX_DIMENSION,
        fit: 'inside',
        withoutEnlargement: true,
      })
    } else {
      image.resize({ width, withoutEnlargement: true })
    }

    await image
      .webp(webpOptions)
      .toFile(outputPath)
    const { size } = await fs.stat(outputPath)
    console.log(`${path.relative(ROOT, outputPath)}: ${(size / 1024).toFixed(1)} KiB`)
  }
}

async function generateImageDimensions() {
  const imagePaths = await globby('images/**/*.{avif,gif,jpeg,jpg,png,webp}', {
    cwd: path.join(ROOT, 'public'),
    absolute: true,
    caseSensitiveMatch: false,
  })

  const entries = await Promise.all(imagePaths.sort().map(async (imagePath) => {
    const metadata = await sharp(imagePath).metadata()
    if (!metadata.width || !metadata.height) {
      throw new Error(`无法读取图片尺寸：${path.relative(ROOT, imagePath)}`)
    }
    const publicPath = `/${path.relative(path.join(ROOT, 'public'), imagePath).split(path.sep).join('/')}`
    return { publicPath, width: metadata.width, height: metadata.height }
  }))

  const generated = `// 此文件由 scripts/optimize-static-assets.mjs 自动生成，请勿手动编辑。\n\nexport type ImageDimensions = { width: number; height: number }\n\nexport const IMAGE_DIMENSIONS: Record<string, ImageDimensions> = {\n${entries.map(({ publicPath, width, height }) => `  ${JSON.stringify(publicPath)}: { width: ${width}, height: ${height} },`).join('\n')}\n}\n`
  const current = await fs.readFile(IMAGE_DIMENSIONS_OUTPUT, 'utf8').catch(() => '')
  if (current !== generated) await fs.writeFile(IMAGE_DIMENSIONS_OUTPUT, generated, 'utf8')
  console.log(`Generated image dimensions for ${entries.length} public images.`)
}

async function generateMemeImages() {
  const memePaths = await globby('images/mems/*.webp', {
    cwd: path.join(ROOT, 'public'),
    caseSensitiveMatch: false,
  })
  const images = memePaths
    .map((imagePath) => `/${imagePath.split(path.sep).join('/')}`)
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }))
  const generated = `// 此文件由 scripts/optimize-static-assets.mjs 自动生成，请勿手动编辑。\n\nexport const MEME_IMAGES = ${JSON.stringify(images, null, 2)} as const\n`
  const current = await fs.readFile(MEME_IMAGES_OUTPUT, 'utf8').catch(() => '')
  if (current !== generated) await fs.writeFile(MEME_IMAGES_OUTPUT, generated, 'utf8')
  console.log(`Generated meme image manifest with ${images.length} entries.`)
}

const characters = await collectSiteCharacters()
console.log(`Subsetting fonts for ${[...characters].length} code points.`)
await Promise.all([buildFontSubsets(characters), convertImages()])
await Promise.all([generateImageDimensions(), generateMemeImages()])
