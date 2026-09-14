import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { deploymentConfigFromArgs } from './static-args.mjs'

const config = deploymentConfigFromArgs()
const args = process.argv.slice(2)
const portIndex = args.indexOf('--port')
const port = portIndex === -1 ? 4173 : Number(args[portIndex + 1])
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error(`无效端口：${args[portIndex + 1]}`)

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputRoot = path.join(repositoryRoot, 'out')
const mimeTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webp', 'image/webp'],
  ['.woff2', 'font/woff2'],
  ['.xml', 'application/xml; charset=utf-8'],
])

function outputFileFor(pathname) {
  if (pathname.includes('\\0') || pathname.includes('\\')) return null
  const decoded = decodeURIComponent(pathname)
  if (config.basePath && decoded !== config.basePath && !decoded.startsWith(`${config.basePath}/`)) return null
  const route = config.basePath ? decoded.slice(config.basePath.length) || '/' : decoded
  const relative = route.replace(/^\/+/, '')
  const candidates = relative.endsWith('/') || !path.extname(relative)
    ? [path.join(relative, 'index.html'), `${relative}.html`]
    : [relative]

  for (const candidate of candidates) {
    const resolved = path.resolve(outputRoot, candidate)
    if (!resolved.startsWith(`${outputRoot}${path.sep}`) || !existsSync(resolved)) continue
    if (statSync(resolved).isFile()) return resolved
  }
  return null
}

function sendFile(response, file, statusCode = 200, headOnly = false) {
  response.writeHead(statusCode, {
    'Content-Type': mimeTypes.get(path.extname(file)) ?? 'application/octet-stream',
    'Cache-Control': 'no-store',
  })
  if (headOnly) return response.end()
  createReadStream(file).pipe(response)
}

const server = createServer((request, response) => {
  const pathname = new URL(request.url ?? '/', 'http://localhost').pathname
  const file = outputFileFor(pathname)
  if (file) return sendFile(response, file, 200, request.method === 'HEAD')

  const fallback = path.join(outputRoot, '404.html')
  if (existsSync(fallback)) return sendFile(response, fallback, 404, request.method === 'HEAD')
  response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
  response.end('Not found')
})

server.listen(port, '127.0.0.1', () => {
  console.log(`静态预览已启动：http://127.0.0.1:${port}${config.basePath || '/'}`)
})

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)))
}
