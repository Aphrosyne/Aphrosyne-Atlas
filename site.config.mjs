const DEFAULT_SITE_ORIGIN = 'https://aphrosyne.github.io'

export function normalizeBasePath(value = '') {
  const trimmed = value.trim()
  if (!trimmed || trimmed === '/') return ''
  if (!trimmed.startsWith('/') || trimmed.includes('..') || trimmed.includes('\\')) {
    throw new Error(`无效的静态部署 basePath：${value}`)
  }
  return trimmed.replace(/\/+$/, '')
}

export function normalizeSiteOrigin(value = DEFAULT_SITE_ORIGIN) {
  const url = new URL(value)
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error(`站点 origin 必须使用 HTTP(S)：${value}`)
  }
  if (url.pathname !== '/' || url.search || url.hash) {
    throw new Error(`站点 origin 不能包含路径、查询或片段：${value}`)
  }
  return url.origin
}

export function getDeploymentConfig(environment = process.env) {
  const basePath = normalizeBasePath(environment.NEXT_PUBLIC_BASE_PATH ?? '')
  const siteOrigin = normalizeSiteOrigin(environment.NEXT_PUBLIC_SITE_ORIGIN ?? DEFAULT_SITE_ORIGIN)

  return {
    basePath,
    siteOrigin,
    siteUrl: `${siteOrigin}${basePath}`,
  }
}

export function toSiteUrl(pathname = '/', config = getDeploymentConfig()) {
  const normalizedPath = pathname === '/' ? '/' : `/${pathname.replace(/^\/+/, '')}`
  return `${config.siteUrl}${normalizedPath}`
}
