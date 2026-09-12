import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIRECTORIES = [
  'assets/images-source/avatar',
  'assets/images-source/bg',
  'assets/images-source/blog',
  'assets/images-source/knowledge',
  '.private',
]

await Promise.all(DIRECTORIES.map((directory) => fs.mkdir(path.join(ROOT, directory), { recursive: true })))
console.log('Local asset directories are ready.')
