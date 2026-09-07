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
const FORCE_IMAGE_BUILD = process.argv.includes('--force')

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
    const input = renameReservedFontNames(await fs.readFile(inputPath))
    const output = await subsetFont(input, characters, {
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
    const width = isBackground ? 3840 : isAvatar ? 768 : 1920
    const quality = isBackground ? 90 : isAvatar ? 86 : 88
    const webpOptions = metadata.hasAlpha
      ? { lossless: true, effort: 6 }
      : { quality, smartSubsample: true, effort: 5 }

    await fs.mkdir(path.dirname(outputPath), { recursive: true })
    await sharp(sourcePath)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp(webpOptions)
      .toFile(outputPath)
    const { size } = await fs.stat(outputPath)
    console.log(`${path.relative(ROOT, outputPath)}: ${(size / 1024).toFixed(1)} KiB`)
  }
}

const characters = await collectSiteCharacters()
console.log(`Subsetting fonts for ${[...characters].length} code points.`)
await Promise.all([buildFontSubsets(characters), convertImages()])
